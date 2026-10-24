import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/site.config";
import { urlSite } from "@/lib/url-site";
import { partage, schemaSite } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600"],
});

const titreBase = `${site.nom} — Yoga & Thérapie Holistique`;

const descriptionAccueil =
  "Yoga Kundalini à Oloron et Géronce, ateliers tantra, yoga nidra en ligne et thérapie holistique avec Chantal Lassier. Cours en présentiel et à distance.";

export const metadata: Metadata = {
  metadataBase: new URL(urlSite()),
  title: site.ville ? `${titreBase} à ${site.ville}` : titreBase,
  description: descriptionAccueil,
  // Chaque page déclare sa propre adresse officielle (évite les doublons une fois le nom de domaine en place).
  alternates: { canonical: "./" },
  ...partage(titreBase, descriptionAccueil),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${inter.variable}`}>
        <JsonLd data={schemaSite()} />
        {children}
      </body>
    </html>
  );
}