import Header from "@/components/Header";
import Footer from "@/components/Footer";
import YogaHero from "@/components/yoga/YogaHero";
import DisciplinePresentation from "@/components/yoga/DisciplinePresentation";
import TarifsCards from "@/components/yoga/TarifsCards";
import PlanningSection from "@/components/yoga/PlanningSection";
import MaterielSection from "@/components/yoga/MaterielSection";
import DerouleSeance from "@/components/yoga/DerouleSeance";
import InscriptionSection from "@/components/yoga/InscriptionSection";

export default function YogaPage() {
  return (
    <main>
      <Header />
      <YogaHero />
      <DisciplinePresentation />
      <TarifsCards />
      <PlanningSection />
      <MaterielSection />
      <DerouleSeance />
      <InscriptionSection />
      <Footer />
    </main>
  );
}
