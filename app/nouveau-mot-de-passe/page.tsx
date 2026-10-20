import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NouveauMotDePasseForm from "@/components/NouveauMotDePasseForm";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Nouveau mot de passe — ${site.nom}`,
  robots: { index: false },
};

export default async function NouveauMotDePassePage() {
  // On arrive ici depuis le lien reçu par e-mail : la personne est alors connectée.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/mot-de-passe-oublie");

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <section className="relative min-h-[40vh] w-full overflow-hidden">
        <img
          src="/images/yoga-nature.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/30 to-encre/10" />

        <div className="relative z-10 flex min-h-[40vh] flex-col items-center justify-center gap-4 px-5 pb-20 pt-32 text-center sm:px-12">
          <h1 className="font-display text-4xl italic text-white drop-shadow-lg sm:text-6xl">
            Nouveau mot de passe
          </h1>
          <p className="max-w-xl text-base text-white/90 drop-shadow-md sm:text-lg">
            Choisissez un mot de passe d&apos;au moins 8 caractères.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-md px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
          <NouveauMotDePasseForm />
        </div>
      </section>

      <Footer />
    </main>
  );
}