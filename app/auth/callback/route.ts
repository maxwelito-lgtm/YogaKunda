import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/mon-espace";
  const suivant =
    next.startsWith("/") && !next.startsWith("//") ? next : "/mon-espace";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${suivant}`);
    }
  }

  return NextResponse.redirect(`${origin}/connexion?erreur=lien`);
}