import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

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

async function synchroniser(sub: Stripe.Subscription) {
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
    return;
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
  const formule =
    sub.metadata?.formule ?? (intervalle === "year" ? "annuelle" : "mensuelle");

  const statut = statutSite(sub.status);
  const fin =
    statut === "annule"
      ? new Date().toISOString() // résiliation effective : l'accès s'arrête
      : finTimestamp
        ? new Date(finTimestamp * 1000).toISOString()
        : null;

  const { error } = await admin.from("abonnements").upsert(
    {
      user_id: userId,
      statut,
      formule: formule === "mensuelle" ? "mensuelle" : "annuelle",
      fin_periode: fin,
      stripe_customer_id: clientId,
      stripe_subscription_id: sub.id,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) throw error;
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

  try {
    switch (evenement.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
        await synchroniser(evenement.data.object as Stripe.Subscription);
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