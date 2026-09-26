import Header from "@/components/Header";
import Hero from "@/components/Hero";
import ActivityCards from "@/components/ActivityCards";
import LocationSection from "@/components/LocationSection";
import MantrasBanner from "@/components/MantrasBanner";
import EngagementSection from "@/components/EngagementSection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main>
      <Header />
      <Hero />
      <ActivityCards />
      <LocationSection />
      <MantrasBanner />
      <EngagementSection />
      <Footer />
    </main>
  );
}