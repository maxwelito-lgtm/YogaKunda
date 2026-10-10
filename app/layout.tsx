import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/site.config";

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

export const metadata: Metadata = {
  title: site.ville ? `${titreBase} à ${site.ville}` : titreBase,
  description:
    "Cours de yoga en présentiel et en ligne, thérapie holistique et mantras, à Angoulême.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={`${fraunces.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  );
}