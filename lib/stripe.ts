import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripe(): Stripe {
  const cle = process.env.STRIPE_SECRET_KEY;
  if (!cle) throw new Error("STRIPE_SECRET_KEY manquante");
  if (!client) client = new Stripe(cle);
  return client;
}

// Retrouve un prix Stripe grâce à son nom interne (créé par scripts/stripe-setup.mjs).
export async function prixParCle(cle: string): Promise<string> {
  const liste = await getStripe().prices.list({
    lookup_keys: [cle],
    active: true,
    limit: 1,
  });
  const prix = liste.data[0];
  if (!prix) throw new Error(`Prix Stripe introuvable : ${cle}`);
  return prix.id;
}