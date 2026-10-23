// Adresse publique du site, sans « / » final.
// Réglage : variable NEXT_PUBLIC_SITE_URL dans Vercel (à mettre à jour avec le nom de domaine).
export function urlSite(): string {
  const brute = process.env.NEXT_PUBLIC_SITE_URL || "https://yoga-kunda.vercel.app";
  return brute.replace(/\/+$/, "");
}
