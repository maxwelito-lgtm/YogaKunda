import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe } from "@/lib/stripe";

// Ouvre le portail Stripe : changer de carte, voir les factures, résilier.
export async function GET(request: Request) {
  const { origin } = new URL(request.url);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/connexion?next=/mon-espace`);
  }

  const { data: abo } = await supabase
    .from("abonnements")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!abo?.stripe_customer_id) {
    return NextResponse.redirect(`${origin}/mon-espace`);
  }

  try {
    const session = await getStripe().billingPortal.sessions.create({
      customer: abo.stripe_customer_id,
      return_url: `${origin}/mon-espace`,
    });
    return NextResponse.redirect(session.url, 303);
  } catch (erreur) {
    console.error("Portail Stripe : échec", erreur);
    return NextResponse.redirect(`${origin}/mon-espace?abonnement=erreur`);
  }
}