import type { ReactNode } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

type Props = {
  titre: string;
  misAJour?: string;
  children: ReactNode;
};

// Mise en page commune des pages légales : bandeau sombre (pour le menu), puis texte sur fond crème.
export default function PageLegale({ titre, misAJour, children }: Props) {
  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <section className="bg-[#2B1F19] px-5 pb-12 pt-32 text-center sm:pb-14 sm:pt-36">
        <h1 className="font-display text-3xl italic text-white sm:text-5xl">
          {titre}
        </h1>
        {misAJour && (
          <p className="mt-3 text-sm text-white/65">Version du {misAJour}</p>
        )}
      </section>

      <article className="mx-auto max-w-3xl px-5 pb-20 pt-6 text-[15px] leading-relaxed text-encre/85 sm:px-6 [&_a]:text-[#75523F] [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:italic [&_h2]:text-[#75523F] [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:font-semibold [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </article>

      <Footer />
    </main>
  );
}