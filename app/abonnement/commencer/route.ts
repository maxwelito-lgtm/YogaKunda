import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe, prixParCle } from "@/lib/stripe";
import { estAbonne } from "@/lib/espace";
import { ABONNEMENT } from "@/data/offres";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const formule =
    searchParams.get("formule") === "mensuelle" ? "mensuelle" : "annuelle";
  const retour = `/abonnement/commencer?formule=${formule}`;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Pas de compte : on passe par l'inscription, puis on revient ici.
  if (!user) {
    return NextResponse.redirect(
      `${origin}/inscription?next=${encodeURIComponent(retour)}`
    );
  }

  const { data: abo } = await supabase
    .from("abonnements")
    .select("statut, fin_periode, stripe_customer_id, stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  // Déjà abonné : rien à payer.
  if (estAbonne(abo)) {
    return NextResponse.redirect(`${origin}/mon-espace`);
  }

  try {
    const stripe = getStripe();
    const admin = createAdminClient();

    let clientId = abo?.stripe_customer_id ?? null;
    if (!clientId) {
      const nouveau = await stripe.customers.create({
        email: user.email ?? undefined,
        metadata: { user_id: user.id },
      });
      clientId = nouveau.id;
      await admin.from("abonnements").upsert(
        {
          user_id: user.id,
          stripe_customer_id: clientId,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    }

    const prix = await prixParCle(
      formule === "mensuelle" ? "abonnement_mensuel" : "abonnement_annuel"
    );

    // L'essai gratuit n'est offert qu'une fois par personne.
    const dejaEuUnAbonnement = !!abo?.stripe_subscription_id;

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: clientId,
      line_items: [{ price: prix, quantity: 1 }],
      subscription_data: {
        ...(dejaEuUnAbonnement
          ? {}
          : { trial_period_days: ABONNEMENT.essaiJours }),
        metadata: { user_id: user.id, formule },
      },
      metadata: { user_id: user.id, formule },
      locale: "fr",
      allow_promotion_codes: true,
     
      success_url: `${origin}/mon-espace?abonnement=ok`,
      cancel_url: `${origin}/#abonnement`,
    });

    return NextResponse.redirect(session.url as string, 303);
  } catch (erreur) {
    console.error("Abonnement : échec de création du paiement", erreur);
    return NextResponse.redirect(`${origin}/mon-espace?abonnement=erreur`);
  }
}