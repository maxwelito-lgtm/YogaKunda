import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ActivityPage from "@/components/ActivityPage";
import Footer from "@/components/Footer";
import { activityPages } from "@/data/activity-pages";
import { site } from "@/site.config";
import { partage, schemaCours } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

// La page se rafraîchit toute seule (calendrier des cours) au plus tard toutes les heures.
export const revalidate = 3600;

export function generateStaticParams() {
  return Object.keys(activityPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = activityPages[slug];
  if (!data) return {};
  const titre = data.metaTitre ?? `${data.titre} — ${site.nom}`;
  return {
    title: titre,
    description: data.metaDescription,
    ...partage(titre, data.metaDescription),
  };
}

export default async function ActivityRoute({ params }: Props) {
  const { slug } = await params;
  const data = activityPages[slug];
  if (!data) notFound();

  const cours = schemaCours({
    nom: data.titre,
    description: data.metaDescription,
    chemin: `/yoga/${data.slug}`,
    enLigne: data.slug === "nidra",
    lieuxIds: data.slug === "kundalini" ? ["geronce", "oloron"] : [],
  });

  return (
    <main style={data.fond ? { backgroundColor: data.fond } : undefined}>
      <JsonLd data={cours} />
      <Header />
      <ActivityPage data={data} />
      <Footer />
    </main>
  );
}