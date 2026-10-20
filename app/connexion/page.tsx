import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConnexionForm from "@/components/ConnexionForm";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Connexion — ${site.nom}`,
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ next?: string; erreur?: string }>;
};

export default async function ConnexionPage({ searchParams }: Props) {
  const { next, erreur } = await searchParams;

  // On n'accepte que des chemins internes au site.
  const suivant =
    next && next.startsWith("/") && !next.startsWith("//")
      ? next
      : "/mon-espace";

  // Déjà connecté : inutile de se reconnecter.
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) redirect(suivant);

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
            Connexion
          </h1>
          <p className="max-w-xl text-base text-white/90 drop-shadow-md sm:text-lg">
            Retrouvez vos cours en ligne et vos relaxations audio.
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-md px-4 pb-20 sm:px-6">
        <div className="rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8">
          <ConnexionForm suivant={suivant} erreurLien={erreur === "lien"} />
        </div>
      </section>

      <Footer />
    </main>
  );
}