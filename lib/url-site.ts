// Adresse publique du site, sans « / » final.
// Réglage : variable NEXT_PUBLIC_SITE_URL dans Vercel. À défaut, l'adresse du site est celle du nom de domaine.
export function urlSite(): string {
  const brute = process.env.NEXT_PUBLIC_SITE_URL || "https://shantalam.yoga";
  return brute.replace(/\/+$/, "");
}
