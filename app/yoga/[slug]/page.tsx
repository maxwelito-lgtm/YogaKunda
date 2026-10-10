import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import ActivityPage from "@/components/ActivityPage";
import Footer from "@/components/Footer";
import { activityPages } from "@/data/activity-pages";
import { site } from "@/site.config";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(activityPages).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = activityPages[slug];
  if (!data) return {};
  return {
    title: `${data.titre} — ${site.nom}`,
    description: data.metaDescription,
  };
}

export default async function ActivityRoute({ params }: Props) {
  const { slug } = await params;
  const data = activityPages[slug];
  if (!data) notFound();

  return (
    <main>
      <Header />
      <ActivityPage data={data} />
      <Footer />
    </main>
  );
}