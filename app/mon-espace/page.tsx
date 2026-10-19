import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Mon espace — Shantalam",
  robots: { index: false },
};

async function deconnexion() {
  "use server";
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}

export default async function MonEspacePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?next=/mon-espace");
  }

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <section className="mx-auto max-w-2xl px-5 pb-24 pt-40 text-center">
        <h1 className="font-display text-4xl italic text-encre sm:text-5xl">
          Bonjour
        </h1>
        <p className="mt-4 text-encre/70">
          Vous êtes connecté(e) avec {user.email}. Votre espace en ligne sera
          bientôt disponible ici.
        </p>

        <form action={deconnexion} className="mt-8">
          <button
            type="submit"
            className="btn-bounce inline-flex min-h-[44px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F]"
          >
            Se déconnecter
          </button>
        </form>
      </section>

      <Footer />
    </main>
  );
}