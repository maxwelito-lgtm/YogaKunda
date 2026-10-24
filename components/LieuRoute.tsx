import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LieuPage from "@/components/LieuPage";
import JsonLd from "@/components/JsonLd";
import type { LieuId } from "@/data/lieux";
import { lirePageLieu } from "@/data/pages-lieux";
import { partage, schemaCours, schemaFaq } from "@/lib/seo";

export function metadataLieu(lieuId: LieuId): Metadata {
  const p = lirePageLieu(lieuId);
  return {
    title: p.metaTitre,
    description: p.metaDescription,
    ...partage(p.metaTitre, p.metaDescription),
  };
}

export default function LieuRoute({ lieuId }: { lieuId: LieuId }) {
  const p = lirePageLieu(lieuId);
  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <JsonLd
        data={schemaCours({
          nom: `Cours de Kundalini Yoga à ${p.villeComplete}`,
          description: p.metaDescription,
          chemin: p.chemin,
          lieuxIds: [lieuId],
        })}
      />
      <JsonLd data={schemaFaq(p.questions)} />
      <Header />
      <LieuPage lieuId={lieuId} />
      <Footer />
    </main>
  );
}
