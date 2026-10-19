import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CredibilityStats from "@/components/CredibilityStats";
import ActivityCards from "@/components/ActivityCards";
import OnlineBanner from "@/components/OnlineBanner";
import FocusSection from "@/components/FocusSection";
import LocationSection from "@/components/LocationSection";
import PricingSection from "@/components/PricingSection";
import EngagementSection from "@/components/EngagementSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <CredibilityStats />
      <ActivityCards />
      <OnlineBanner />
      <FocusSection />
      <LocationSection />
      <PricingSection />
      <EngagementSection />
      <Footer />
    </main>
  );
}