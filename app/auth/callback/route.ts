import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cheminInterne } from "@/lib/chemin";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const suivant = cheminInterne(searchParams.get("next"));

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${suivant}`);
    }
  }

  return NextResponse.redirect(`${origin}/connexion?erreur=lien`);
}