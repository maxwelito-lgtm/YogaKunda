import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Page introuvable — ${site.nom}`,
  robots: { index: false },
};

export default function PageIntrouvable() {
  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-4 pb-20 pt-36 text-center sm:px-6">
        <p className="font-display text-7xl italic text-[#75523F] sm:text-8xl">404</p>
        <h1 className="mt-4 font-display text-3xl italic text-encre sm:text-4xl">
          Cette page n&rsquo;existe pas
        </h1>
        <p className="mt-3 text-[16px] leading-relaxed text-encre/75">
          Le lien est peut-être incorrect, ou la page a été déplacée.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="btn-bounce inline-flex min-h-[44px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F] px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F]/90"
          >
            Retour à l&rsquo;accueil
          </Link>
          <Link
            href="/nous-contacter"
            className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-encre/30 px-7 py-3 text-sm font-semibold text-encre hover:bg-white"
          >
            Nous contacter
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  );
}
