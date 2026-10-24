import type { NextConfig } from "next";

const enProduction = process.env.NODE_ENV === "production";

// En-têtes de sécurité envoyés avec chaque page.
// (Le HSTS, qui force le HTTPS, est déjà ajouté par Vercel.)
const entetes = [
  // Empêche le navigateur de deviner le type d'un fichier.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Interdit d'afficher le site dans un cadre d'une autre page (clickjacking).
  { key: "X-Frame-Options", value: "DENY" },
  // N'envoie que le nom du site (pas l'adresse complète) aux sites externes.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Le site n'utilise ni caméra, ni micro, ni localisation.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  // Politique de contenu en MODE RAPPORT : n'empêche rien, signale seulement dans la console
  // du navigateur ce qui serait bloqué. À passer en mode strict une fois vérifié.
  {
    key: "Content-Security-Policy-Report-Only",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${enProduction ? "" : " 'unsafe-eval'"} https://challenges.cloudflare.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "media-src 'self'",
      "font-src 'self' data:",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co",
      "frame-src https://www.youtube-nocookie.com https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "object-src 'none'",
    ].join("; "),
  },
];

const config: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [{ source: "/:path*", headers: entetes }];
  },
};

export default config;
