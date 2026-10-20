import type { Metadata } from "next";
import Header from "@/components/Header";
import ActivityPage from "@/components/ActivityPage";
import Footer from "@/components/Footer";
import { therapiePage } from "@/data/activity-pages";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `${therapiePage.titre} — ${site.nom}`,
  description: therapiePage.metaDescription,
};

export default function TherapieHolistiquePage() {
  return (
    <main style={therapiePage.fond ? { backgroundColor: therapiePage.fond } : undefined}>
      <Header />
      <ActivityPage data={therapiePage} />
      <Footer />
    </main>
  );
}