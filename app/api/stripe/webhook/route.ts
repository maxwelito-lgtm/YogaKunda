import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOffre, lireOffre, SEMAINES_TRIMESTRE } from "@/data/offres";
import {
  alerteAchat,
  confirmationAchat,
  alerteAbonnement,
  confirmationAbonnement,
} from "@/lib/email";

export const runtime = "nodejs";

function statutSite(statutStripe: string): string {
  switch (statutStripe) {
    case "trialing":
      return "essai";
    case "active":
    case "past_due": // Stripe réessaie le paiement : l'accès continue jusqu'à la fin de période
      return "actif";
    case "canceled":
    case "unpaid":
    case "incomplete_expired":
      return "annule";
    default:
      return "aucun";
  }
}

// Nom et e-mail d'une personne inscrite (pour personnaliser les e-mails).
async function lireClient(userId: string) {
  try {
    const { data } = await createAdminClient().auth.admin.getUserById(userId);
    const u = data?.user;
    const meta = (u?.user_metadata ?? {}) as { prenom?: string; nom?: string };
    const nom = [meta.prenom, meta.nom].filter(Boolean).join(" ").trim();
    return { nom, email: u?.email ?? "" };
  } catch (erreur) {
    console.error("Webhook : client introuvable pour l'e-mail", erreur);
    return { nom: "", email: "" };
  }
}

// Renvoie true si l'abonnement vient d'être enregistré pour la première fois.
async function synchroniser(sub: Stripe.Subscription): Promise<{
  nouveau: boolean;
  userId: string | null;
  statut: string;
  formule: "mensuelle" | "annuelle";
  fin: string | null;
}> {
  const admin = createAdminClient();
  const clientId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;

  // On retrouve la personne : par les métadonnées, sinon par son identifiant client Stripe.
  let userId = sub.metadata?.user_id || null;
  if (!userId) {
    const { data } = await admin
      .from("abonnements")
      .select("user_id")
      .eq("stripe_customer_id", clientId)
      .maybeSingle();
    userId = data?.user_id ?? null;
  }
  if (!userId) {
    console.error("Webhook : abonnement sans utilisateur", sub.id);
    return { nouveau: false, userId: null, statut: "aucun", formule: "mensuelle", fin: null };
  }

  // La date de fin de période a changé de place selon les versions de l'API Stripe.
  const element = sub.items.data[0] as unknown as {
    current_period_end?: number;
    price?: { recurring?: { interval?: string } };
  };
  const finTimestamp =
    (sub as unknown as { current_period_end?: number }).current_period_end ??
    element?.current_period_end ??
    null;

  const intervalle = element?.price?.recurring?.interval;
  const formuleBrute =
    sub.metadata?.formule ?? (intervalle === "year" ? "annuelle" : "mensuelle");
  const formule = formuleBrute === "mensuelle" ? "mensuelle" : "annuelle";

  const statut = statutSite(sub.status);
  const fin =
    statut === "annule"
      ? new Date().toISOString() // résiliation effective : l'accès s'arrête
      : finTimestamp
        ? new Date(finTimestamp * 1000).toISOString()
        : null;

  // Un abonnement n'est annoncé qu'une seule fois : la première fois qu'on voit son identifiant
  // Stripe, quel que soit l'événement qui arrive en premier. Si Stripe renvoie un événement
  // ou en envoie deux presque ensemble, la mise à jour conditionnelle ci-dessous (verrouillée
  // par la base de données) ne laisse passer qu'un seul traitement.
  const { data: existant } = await admin
    .from("abonnements")
    .select("user_id")
    .eq("user_id", userId)
    .maybeSingle();

  let nouveau = false;
  if (!existant) {
    nouveau = true; // première ligne pour cette personne : l'insertion se fait juste après
  } else {
    const { data: reserve } = await admin
      .from("abonnements")
      .update({ stripe_subscription_id: sub.id })
      .eq("user_id", userId)
      .or(`stripe_subscription_id.is.null,stripe_subscription_id.neq.${sub.id}`)
      .select("user_id");
    nouveau = (reserve?.length ?? 0) > 0;
  }

  const { error } = await admin.from("abonnements").upsert(
    {
      user_id: userId,
      statut,
      formule,
      fin_periode: fin,
      stripe_customer_id: clientId,
      stripe_subscription_id: sub.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;

  return { nouveau, userId, statut, formule, fin };
}

// Un nouvel abonné : e-mail à Chantal et message de bienvenue au client.
async function prevenirAbonnement(
  r: Awaited<ReturnType<typeof synchroniser>>,
  origine: string
) {
  if (!r.nouveau || !r.userId) return;
  if (r.statut !== "essai" && r.statut !== "actif") return;

  const client = await lireClient(r.userId);
  const infos = {
    nomClient: client.nom,
    emailClient: client.email,
    statut: r.statut as "essai" | "actif",
    formule: r.formule,
    finPeriode: r.fin ? new Date(r.fin) : null,
    origine,
  };
  await Promise.all([alerteAbonnement(infos), confirmationAbonnement(infos)]);
}

// Un paiement de cours ou d'atelier est réussi : on marque la commande comme payée,
// puis on prévient Chantal et le client (une seule fois par commande).
async function marquerCommandePayee(session: Stripe.Checkout.Session, origine: string) {
  if (session.mode !== "payment" || session.payment_status !== "paid") return;
  const commandeId = session.metadata?.commande_id;
  if (!commandeId) return;

  const intent =
    typeof session.payment_intent === "string"
      ? session.payment_intent
      : (session.payment_intent?.id ?? null);

  const maintenant = new Date();
  const telephone = session.customer_details?.phone ?? null;

  // « .neq("statut", "payee") » : seule la première exécution trouve la commande
  // en attente. Si Stripe renvoie l'événement, rien n'est renvoyé et aucun e-mail ne repart.
  const { data, error } = await createAdminClient()
    .from("commandes")
    .update({
      statut: "payee",
      paye_le: maintenant.toISOString(),
      stripe_session_id: session.id,
      stripe_payment_intent: intent,
      telephone,
    })
    .eq("id", commandeId)
    .neq("statut", "payee")
    .select("id, user_id, offre, formule, rythme, seances, montant_centimes");
  if (error) throw error;

  const commande = data?.[0];
  if (!commande) return; // déjà traitée

  const offre = getOffre(lireOffre(commande.offre));
  const seances = Number(commande.seances) || 1;
  const nbSeances = `${seances} ${offre.unite}${seances > 1 ? "s" : ""}`;
  const parSemaine = Number(commande.rythme) === 2 ? " · 2 par semaine" : "";
  const detail =
    commande.formule === "trim"
      ? `Au trimestre (${SEMAINES_TRIMESTRE} semaines) · ${nbSeances}${parSemaine}`
      : commande.formule === "annee"
        ? `À l'année (année scolaire) · ${nbSeances}${parSemaine}`
        : `À l'unité · ${nbSeances}`;

  const client = await lireClient(commande.user_id);
  const cgv = session.metadata?.cgv_acceptees_le;

  const achat = {
    commandeId: commande.id,
    offreNom: offre.nom,
    detail,
    surRendezVous: offre.id === "perso" || offre.id === "therapie",
    montantCentimes: Number(commande.montant_centimes) || session.amount_total || 0,
    nomClient: client.nom,
    emailClient: session.customer_details?.email || client.email,
    telephone,
    payeLe: maintenant,
    cgvAcceptees: cgv && !Number.isNaN(Date.parse(cgv)) ? new Date(cgv) : null,
    origine,
  };

  await Promise.all([alerteAchat(achat), confirmationAchat(achat)]);
}

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) {
    return NextResponse.json({ error: "Configuration manquante" }, { status: 400 });
  }

  const corps = await request.text();
  let evenement: Stripe.Event;
  try {
    evenement = getStripe().webhooks.constructEvent(corps, signature, secret);
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  const origine = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;

  try {
    switch (evenement.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const resultat = await synchroniser(
          evenement.data.object as Stripe.Subscription
        );
        // Les e-mails ne doivent jamais faire échouer le traitement.
        try {
          await prevenirAbonnement(resultat, origine);
        } catch (erreur) {
          console.error("Webhook : e-mails d'abonnement non envoyés", erreur);
        }
        break;
      }
      case "checkout.session.completed":
        await marquerCommandePayee(
          evenement.data.object as Stripe.Checkout.Session,
          origine
        );
        break;
      default:
        break;
    }
  } catch (erreur) {
    console.error("Webhook Stripe : échec de traitement", erreur);
    // 500 : Stripe réessaiera automatiquement.
    return NextResponse.json({ error: "Traitement échoué" }, { status: 500 });
  }

  return NextResponse.json({ recu: true });
}