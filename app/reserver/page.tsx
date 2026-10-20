import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReservationForm from "@/components/ReservationForm";
import { lireOffre, lireFormule, lireRythme } from "@/data/offres";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Dates & tarifs — ${site.nom}`,
  description:
    "Choisissez votre pratique et votre formule (au cours ou au trimestre), puis payez en ligne en toute sécurité.",
};

type Props = {
  searchParams: Promise<{ offre?: string; formule?: string; rythme?: string }>;
};

export default async function ReserverPage({ searchParams }: Props) {
  const p = await searchParams;

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <section className="relative min-h-[36vh] w-full overflow-hidden">
        <img
          src="/images/yoga-nature.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/30 to-encre/10" />

        <div className="relative z-10 flex min-h-[36vh] flex-col items-center justify-center gap-4 px-5 pb-16 pt-32 text-center sm:px-12">
          <h1 className="font-display text-4xl italic text-white drop-shadow-lg sm:text-6xl">
            Dates &amp; tarifs
          </h1>
          <p className="max-w-xl text-base text-white/90 drop-shadow-md sm:text-lg">
            Choisissez votre pratique et payez en ligne en toute sécurité.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-20 pt-12 sm:px-6">
        <ReservationForm
          offreInitiale={lireOffre(p.offre)}
          formuleInitiale={lireFormule(p.formule)}
          rythmeInitial={lireRythme(p.rythme)}
        />
      </section>

      <Footer />
    </main>
  );
}