import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/site.config";
// Les adresses e-mail autorisées à entrer dans l'espace de Chantal.
// Elles se règlent dans Vercel (variable ADMIN_EMAILS), séparées par des virgules.
function adressesAutorisees(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

// À appeler en haut de chaque page de l'espace de Chantal.
// - pas connecté : on envoie vers la connexion, puis on revient ici ;
// - connecté mais pas autorisé : la page « n'existe pas » (404), sans rien révéler.
export async function exigerAdmin(chemin: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=${encodeURIComponent(chemin)}`);
  }

  const email = user.email?.toLowerCase() ?? "";
  const autorise = Boolean(user.email_confirmed_at) && adressesAutorisees().includes(email);
  if (!autorise) {
    notFound();
  }

  const meta = (user.user_metadata ?? {}) as { prenom?: string };
  return { user, prenom: meta.prenom?.trim() ?? "" };
}

// Vrai si cette personne a le droit d'entrer dans l'espace de Chantal.
export function estAdmin(user: {
  email?: string | null;
  email_confirmed_at?: string | null;
}): boolean {
  const email = user.email?.toLowerCase() ?? "";
  return Boolean(user.email_confirmed_at) && adressesAutorisees().includes(email);
}
// Le lien « Gérer mon site » n'apparaît que dans l'espace de la propriétaire du site,
// à condition qu'elle soit bien autorisée (l'accès par l'adresse /admin reste possible
// pour toutes les adresses autorisées).
export function lienAdminVisible(user: {
  email?: string | null;
  email_confirmed_at?: string | null;
}): boolean {
  const email = user.email?.toLowerCase() ?? "";
  return (
    Boolean(user.email_confirmed_at) &&
    email === site.email.toLowerCase() &&
    adressesAutorisees().includes(email)
  );
}