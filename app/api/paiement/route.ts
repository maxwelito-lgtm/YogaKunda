import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import {
  calculer,
  enCentimes,
  offres,
  type Formule,
  type OffreId,
  type Rythme,
} from "@/data/offres";

// Nom interne du prix Stripe (créé par scripts/stripe-setup.mjs).
function cleStripe(offre: OffreId, formule: Formule, rythme: Rythme): string {
  const trim = formule === "trim";
  switch (offre) {
    case "kundalini":
      if (formule === "annee") return `kundalini_annee_${rythme}`;
      return trim ? `kundalini_trim_${rythme}` : "kundalini_cours";
    case "tantra":
      return trim ? "tantra_trim" : "tantra_cours";
    case "atelier":
      return trim ? "atelier_trim" : "atelier_cours";
    case "perso":
      return "perso";
    case "therapie":
      return "therapie";
  }
}

export async function POST(request: Request) {
  let corps: {
    offre?: unknown;
    formule?: unknown;
    rythme?: unknown;
    cgv?: unknown;
  };  try {
    corps = await request.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
  // Les CGV doivent avoir été acceptées (case cochée sur la page de réservation).
  if (corps.cgv !== true) {
    return NextResponse.json(
      { error: "Merci d'accepter les conditions générales de vente pour payer." },
      { status: 400 }
    );
  }

  // On ne fait confiance à rien : tout est revérifié ici.
  const offre = offres.find((o) => o.id === corps.offre);
  if (!offre) {
    return NextResponse.json({ error: "Offre inconnue." }, { status: 400 });
  }
  const formule: Formule =
    offre.trimestre && corps.formule === "trim"
      ? "trim"
      : offre.annee && corps.formule === "annee"
        ? "annee"
        : "cours";
  const rythme: Rythme = offre.rythmeChoisi && corps.rythme === 2 ? 2 : 1;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Connexion requise." }, { status: 401 });
  }

  const calcul = calculer(offre, formule, rythme);
  const montant = enCentimes(calcul.total);
  const origin = new URL(request.url).origin;
  const retour = `/reserver?offre=${offre.id}&formule=${formule}&rythme=${rythme}`;

  let commandeId: string | null = null;

  try {
    const stripe = getStripe();
    const admin = createAdminClient();

    // Anti-abus : au plus 10 paiements commencés par heure et par personne.
    // Au passage, on retire les commandes de cette personne restées « en attente » depuis plus
    // de 2 jours (la page de paiement Stripe expire après 24 h : elles ne peuvent plus être payées).
    const ilYa1h = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const ilYa2j = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    await admin
      .from("commandes")
      .delete()
      .eq("user_id", user.id)
      .eq("statut", "en_attente")
      .lt("created_at", ilYa2j);
    const { count: recentes } = await admin
      .from("commandes")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("statut", "en_attente")
      .gte("created_at", ilYa1h);
    if ((recentes ?? 0) >= 10) {
      return NextResponse.json(
        { error: "Trop de tentatives. Merci de patienter quelques minutes avant de réessayer." },
        { status: 429 }
      );
    }

    // 1. Le prix Stripe doit exister et correspondre exactement au calcul du site.
    const cle = cleStripe(offre.id, formule, rythme);
    const liste = await stripe.prices.list({
      lookup_keys: [cle],
      active: true,
      limit: 1,
    });
    const prix = liste.data[0];
    if (!prix || prix.unit_amount == null) {
      throw new Error(`Prix Stripe introuvable : ${cle}`);
    }
    // Cours de Kundalini à l'unité : le prix Stripe est celui d'un cours, multiplié par le nombre de cours.
    const quantite = offre.id === "kundalini" && formule === "cours" ? rythme : 1;
    if (prix.unit_amount * quantite !== montant) {
      throw new Error(
        `Prix incohérent (${cle}) : Stripe ${prix.unit_amount * quantite}, site ${montant}`
      );
    }

    // 2. Le client Stripe de la personne (créé une seule fois).
    const { data: abo } = await supabase
      .from("abonnements")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    let clientId = abo?.stripe_customer_id ?? null;
    if (!clientId) {
      const nouveau = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      clientId = nouveau.id;
      const { error: erreurClient } = await admin.from("abonnements").upsert(
        {
          user_id: user.id,
          stripe_customer_id: clientId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
      if (erreurClient) throw new Error(`Base de données : ${erreurClient.message}`);
    }

    // 3. La commande, en attente de paiement.
    const { data: commande, error: erreurCommande } = await admin
      .from("commandes")
      .insert({
        user_id: user.id,
        offre: offre.id,
        formule,
        rythme,
        seances: calcul.seances,
        montant_centimes: montant,
      })
      .select("id")
      .single();
    if (erreurCommande || !commande) {
      throw new Error(`Commande : ${erreurCommande?.message ?? "échec"}`);
    }
    commandeId = commande.id;

    // 4. La page de paiement Stripe (avec le numéro de téléphone pour le rappel).
    const parSemaine = rythme === 2 && offre.rythmeChoisi ? " · 2 cours par semaine" : "";
    const libelle =
      formule === "trim"
        ? `${offre.nom} — trimestre${parSemaine}`
        : formule === "annee"
          ? `${offre.nom} — année scolaire${parSemaine}`
          : rythme === 2 && offre.rythmeChoisi
          ? `${offre.nom} — 2 cours`
          : offre.nom;

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer: clientId,
      line_items: [{ price: prix.id, quantity: quantite }],
      phone_number_collection: { enabled: true },
      locale: "fr",
      metadata: {
        commande_id: commande.id,
        user_id: user.id,
        offre: offre.id,
        formule,
        rythme: String(rythme),
        cgv_acceptees_le: new Date().toISOString(),
      },
      payment_intent_data: {
        description: libelle,
        metadata: { commande_id: commande.id },
      },
      success_url: `${origin}/reserver/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}${retour}`,
      // Chantal reste la vendeuse (micro-entreprise) : on désactive Managed Payments.
      ...({ managed_payments: { enabled: false } } as object),
    });

    await admin
      .from("commandes")
      .update({ stripe_session_id: session.id })
      .eq("id", commande.id);

    return NextResponse.json({ url: session.url });
  } catch (erreur) {
    console.error("Paiement : échec de création du paiement", erreur);

    if (commandeId) {
      try {
        await createAdminClient().from("commandes").delete().eq("id", commandeId);
      } catch {
        // Sans importance : la commande resterait simplement « en attente ».
      }
    }

    // Pendant les tests seulement (clé sk_test_) : on affiche la raison.
    const enTest = process.env.STRIPE_SECRET_KEY?.startsWith("sk_test_");
    const detail =
      enTest && erreur instanceof Error ? ` (${erreur.message.slice(0, 250)})` : "";
    return NextResponse.json(
      { error: `Le paiement n'a pas pu démarrer. Merci de réessayer.${detail}` },
      { status: 500 }
    );
  }
}