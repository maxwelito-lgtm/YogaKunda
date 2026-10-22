import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CredibilityStats from "@/components/CredibilityStats";
import ActivityBands from "@/components/ActivityBands";
import Separateur from "@/components/Separateur";
import LocationSection from "@/components/LocationSection";
import OnlineBanner from "@/components/OnlineBanner";
import FocusSection from "@/components/FocusSection";
import PricingSection from "@/components/PricingSection";
import EngagementSection from "@/components/EngagementSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <CredibilityStats />
      <ActivityBands />
      <Separateur />
      <LocationSection />
      <OnlineBanner />
      <FocusSection />
      <PricingSection />
      <EngagementSection />
      <Footer />
    </main>
  );
}