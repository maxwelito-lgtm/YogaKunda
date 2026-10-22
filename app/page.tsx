import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ActivityBands from "@/components/ActivityBands";
import Separateur from "@/components/Separateur";
import ProfesseureSection from "@/components/ProfesseureSection";
import LocationSection from "@/components/LocationSection";
import FocusSection from "@/components/FocusSection";
import OnlineBanner from "@/components/OnlineBanner";
import PricingSection from "@/components/PricingSection";
import EngagementSection from "@/components/EngagementSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <Separateur compact />
      <ActivityBands />
      <Separateur />
      <ProfesseureSection />
      <LocationSection />
      <FocusSection />
      <OnlineBanner />
      <PricingSection />
      <EngagementSection />
      <Footer />
    </main>
  );
}