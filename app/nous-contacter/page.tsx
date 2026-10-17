import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ContactChoice from "@/components/ContactChoice";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Nous contacter — ${site.nom}`,
  description:
    "Appelez ou écrivez directement à Chantal pour toute question sur les cours, les ateliers ou la thérapie holistique.",
};

export default function NousContacterPage() {
  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      {/* Hero : même principe que les pages Kundalini / Tantra */}
      <section className="relative min-h-[50vh] w-full overflow-hidden">
        <img
          src="/images/yoga-nature.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/30 to-encre/10" />

        <div className="relative z-10 flex min-h-[50vh] flex-col items-center justify-center gap-4 px-5 pb-20 pt-32 text-center sm:gap-5 sm:px-12">
          <h1 className="font-display text-4xl italic text-white drop-shadow-lg sm:text-6xl">
            Nous contacter
          </h1>
          <p className="max-w-xl text-base text-white/90 drop-shadow-md sm:text-lg">
            Une question, une envie de commencer ? Choisissez la façon qui vous
            convient le mieux.
          </p>
        </div>
      </section>

      {/* Les cartes chevauchent légèrement le hero */}
      <section className="relative z-10 mx-auto -mt-14 max-w-3xl px-4 pb-20 sm:px-6">
        <ContactChoice telephone={site.telephone} email={site.email} />
      </section>

      <Footer />
    </main>
  );
}