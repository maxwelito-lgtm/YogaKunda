import type { Metadata } from "next";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotDePasseOublieForm from "@/components/MotDePasseOublieForm";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Mot de passe oublié — ${site.nom}`,
  robots: { index: false },
};

export default function MotDePasseOubliePage() {
  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <section className="relative min-h-[40vh] w-full overflow-hidden">
        <Image
          src="/images/yoga-nature.png"
          alt=""
          aria-hidden="true"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/30 to-encre/10" />

        <div className="relative z-10 flex min-h-[40vh] flex-col items-center justify-center gap-4 px-5 pb-20 pt-32 text-center sm:px-12">
          <h1 className="font-display text-4xl italic text-white drop-shadow-lg sm:text-6xl">
            Mot de passe oublié
          </h1>
          <p className="max-w-xl text-base text-white/90 drop-shadow-md sm:text-lg">
            Pas de souci, nous vous envoyons un lien pour en choisir un nouveau.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-md px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
          <MotDePasseOublieForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}