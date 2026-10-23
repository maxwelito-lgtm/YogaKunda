import type { Metadata } from "next";
import Header from "@/components/Header";
import TherapiePage from "@/components/TherapiePage";
import Footer from "@/components/Footer";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Thérapie holistique — ${site.nom}`,
  description:
    "Thérapie holistique avec Chantal Lassier : accompagnement des traumatismes, de l'enfant intérieur, des émotions, du chemin de vie et du féminin sacré, par l'approche psycho-intégrative transpersonnelle et l'EMDR.",
};

export default function TherapieHolistiquePage() {
  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />
      <TherapiePage />
      <Footer />
    </main>
  );
}
