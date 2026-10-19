import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarteCours from "@/components/CarteCours";
import { createClient } from "@/lib/supabase/server";
import { CATEGORIES, estAbonne, type Cours } from "@/lib/espace";

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

  const { data: abo } = await supabase
    .from("abonnements")
    .select("statut, formule, fin_periode")
    .eq("user_id", user.id)
    .maybeSingle();

  const abonne = estAbonne(abo);

  const { data: lignes } = await supabase
    .from("cours")
    .select("id, categorie, titre, description, type, duree_minutes, extrait_ref")
    .eq("publie", true)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  const cours = (lignes ?? []) as Cours[];

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6">
        {/* En-tête */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-4xl italic text-encre sm:text-5xl">
              Bonjour
            </h1>
            <p className="mt-1 text-sm text-encre/70">{user.email}</p>
          </div>
          <span
            className={`inline-flex self-start rounded-pill px-4 py-2 text-[13px] font-semibold sm:self-auto ${
              abonne
                ? "bg-[#75523F] text-white"
                : "bg-white text-encre ring-1 ring-black/10"
            }`}
          >
            {abonne
              ? `Abonné(e) · formule ${abo?.formule === "mensuelle" ? "mensuelle" : "annuelle"}`
              : "Compte gratuit · aucun abonnement"}
          </span>
        </div>

        {/* Bandeau d'abonnement (non abonnés seulement) */}
        {!abonne && (
          <div className="mt-8 flex flex-col gap-6 rounded-3xl bg-[#2B1F19] p-7 text-[#F5F3E7] sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="max-w-xl">
              <span className="inline-block rounded-pill bg-[#75523F] px-3 py-1 text-xs font-semibold text-white">
                7 jours offerts
              </span>
              <h2 className="mt-3 font-display text-3xl italic">
                Débloquez tous les cours en ligne
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#F5F3E7]/85">
                Cours en direct, replays, podcasts et Yoga Nidra : à votre
                rythme, sans pression.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 sm:items-center">
              <a
                href="/#abonnement"
                className="btn-bounce inline-flex min-h-[44px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F] px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F]/90"
              >
                Suivre les cours maintenant
              </a>
              <span className="text-[13px] text-[#F5F3E7]/80">
                À partir de 17&nbsp;€ par mois
              </span>
            </div>
          </div>
        )}

        {/* Catégories */}
        <div className="mt-10 flex flex-col gap-10">
          {CATEGORIES.map((cat) => {
            const liste = cours.filter((c) => c.categorie === cat.id);
            return (
              <section key={cat.id}>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-2xl italic text-encre">
                      {cat.titre}
                    </h3>
                    {!abonne && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#75523F]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#75523F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <rect x="5" y="11" width="14" height="9" rx="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                        Réservé aux abonnés
                      </span>
                    )}
                  </div>
                  {!abonne && (
                    <a
                      href="/#abonnement"
                      className="text-[13px] font-semibold text-[#75523F] hover:underline"
                    >
                      Suivre les cours maintenant →
                    </a>
                  )}
                </div>

                {liste.length === 0 ? (
                  <p className="rounded-2xl bg-white/60 px-5 py-6 text-sm text-encre/70 ring-1 ring-black/5">
                    Les premiers contenus arrivent bientôt.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {liste.map((c, i) => (
                      <CarteCours key={c.id} cours={c} index={i} verrouille={!abonne} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>

        <form action={deconnexion} className="mt-14 text-center">
          <button
            type="submit"
            className="inline-flex min-h-[44px] items-center justify-center rounded-pill border border-encre/30 px-6 py-2.5 text-sm font-semibold text-encre hover:bg-white"
          >
            Se déconnecter
          </button>
        </form>
      </div>

      <Footer />
    </main>
  );
}