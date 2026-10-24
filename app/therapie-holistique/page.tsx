import type { Metadata } from "next";
import Header from "@/components/Header";
import TherapiePage from "@/components/TherapiePage";
import Footer from "@/components/Footer";
import { site } from "@/site.config";
import { partage, schemaService } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

const titre = `Thérapie holistique et EMDR en Béarn — ${site.nom}`;
const description =
  "Thérapie holistique avec Chantal Lassier : accompagnement des traumatismes, de l'enfant intérieur, des émotions, du chemin de vie et du féminin sacré, par l'approche psycho-intégrative transpersonnelle et l'EMDR.";

export const metadata: Metadata = {
  title: titre,
  description,
  ...partage(titre, description),
};

export default function TherapieHolistiquePage() {
  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <JsonLd data={schemaService("Thérapie holistique", description, "/therapie-holistique")} />
      <Header />
      <TherapiePage />
      <Footer />
    </main>
  );
}
