import Header from "@/components/Header";
import Hero from "@/components/Hero";
import CredibilityStats from "@/components/CredibilityStats";
import ActivityCards from "@/components/ActivityCards";
import FocusSection from "@/components/FocusSection";
import LocationSection from "@/components/LocationSection";
import MantrasBanner from "@/components/MantrasBanner";
import EngagementSection from "@/components/EngagementSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <CredibilityStats />
      <ActivityCards />
      <FocusSection />
      <LocationSection />
      <MantrasBanner />
      <EngagementSection />
      <Footer />
    </main>
  );
}