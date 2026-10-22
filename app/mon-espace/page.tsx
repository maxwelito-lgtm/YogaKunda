import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MessageAbonnement from "@/components/MessageAbonnement";
import { createClient } from "@/lib/supabase/server";
import { lienAdminVisible } from "@/lib/admin";
import { CATEGORIES, estAbonne, type CategorieId } from "@/lib/espace";

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

function dateFr(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// Image de chaque tuile (dans public/images) et couleur de secours si l'image manque.
const STYLES: Record<CategorieId, { image: string; fond: string }> = {
  replays: { image: "/images/replay.png", fond: "#2B1F19" },
  podcasts: { image: "/images/podcast.png", fond: "#75523F" },
};

const DETAILS: Record<CategorieId, string> = {
  replays: "Yoga Nidra, Kundalini Yoga et divers",
  podcasts: "Enseignements à écouter",
};

type Props = {
  searchParams: Promise<{ abonnement?: string }>;
};

export default async function MonEspacePage({ searchParams }: Props) {
  const { abonnement } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/connexion?next=/mon-espace");
  }

  const { data: abo } = await supabase
    .from("abonnements")
    .select("statut, formule, fin_periode, stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  // La propriétaire du site (Chantal) gère son site : pas de publicité d'abonnement
  // pour elle, et elle voit tous les contenus comme une abonnée.
  const gestionnaire = lienAdminVisible(user);

  const abonne = estAbonne(abo) || gestionnaire;
  const enEssai = abonne && abo?.statut === "essai";

  const { data: lignes } = await supabase
    .from("cours")
    .select("categorie")
    .eq("publie", true);

  const nombres: Record<string, number> = {};
  for (const l of lignes ?? []) {
    nombres[l.categorie] = (nombres[l.categorie] ?? 0) + 1;
  }

  const prenom =
    typeof user.user_metadata?.prenom === "string"
      ? user.user_metadata.prenom
      : "";

  const etiquette = abonne
    ? enEssai
      ? `Essai gratuit · jusqu'au ${dateFr(abo?.fin_periode)}`
      : `Abonné(e) · formule ${abo?.formule === "mensuelle" ? "mensuelle" : "annuelle"}`
    : "Compte gratuit · aucun abonnement";

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6">
        {/* En-tête */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-5xl italic leading-none text-encre sm:text-7xl">
              Bonjour{prenom ? ` ${prenom}` : ""}
            </h1>
            <p className="mt-3 text-[17px] text-encre/75">
              {gestionnaire
                ? "Voici votre espace."
                : "Que souhaitez-vous pratiquer aujourd'hui ?"}
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            {!gestionnaire && (
              <span
                className={`inline-flex rounded-pill px-4 py-2 text-[13px] font-semibold ${
                  abonne
                    ? "bg-[#75523F] text-white"
                    : "bg-white text-encre ring-1 ring-black/10"
                }`}
              >
                {etiquette}
              </span>
            )}
            <div className="flex items-center gap-4">
              {lienAdminVisible(user) && (
                <Link
                  href="/admin"
                  className="rounded-pill bg-[#75523F] px-4 py-2 text-[14px] font-semibold text-white"
                >
                  Gérer mon site
                </Link>
              )}
              <Link
                href="/mon-espace/historique"
                className="text-[13px] font-semibold text-[#75523F] hover:underline"
              >
                Mes achats
              </Link>
              {abo?.stripe_subscription_id && (
                <a
                  href="/api/portail"
                  className="text-[13px] font-semibold text-[#75523F] hover:underline"
                >
                  Gérer mon abonnement
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Messages après le paiement */}
        {abonnement === "ok" && <MessageAbonnement actif={abonne} />}
        {abonnement === "erreur" && (
          <p
            role="alert"
            className="mt-8 rounded-2xl bg-white px-5 py-4 text-sm text-alerte ring-1 ring-black/10"
          >
            Le paiement n&apos;a pas pu démarrer. Merci de réessayer dans un
            instant.
          </p>
        )}

        {/* Bandeau d'abonnement (non abonnés seulement) */}
        {!abonne && (
          <div className="mt-10 flex flex-col gap-6 rounded-3xl bg-[#2B1F19] p-7 text-[#F5F3E7] sm:flex-row sm:items-center sm:justify-between sm:p-9">
            <div className="max-w-xl">
              <span className="inline-block rounded-pill bg-[#75523F] px-3 py-1 text-xs font-semibold text-white">
                7 jours offerts
              </span>
              <h2 className="mt-3 font-display text-3xl italic">
                Débloquez tous les cours en ligne
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-[#F5F3E7]/85">
                Replays des cours, podcasts et Yoga Nidra : à votre rythme,
                sans pression.
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

        {/* Grandes tuiles avec photo */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CATEGORIES.map((cat, i) => {
            const s = STYLES[cat.id];
            const n = nombres[cat.id] ?? 0;
            return (
              <Link
                key={cat.id}
                href={`/mon-espace/${cat.id}`}
                className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-[28px] p-7 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75523F] sm:min-h-[280px] sm:px-8"
                style={{ backgroundColor: s.fond }}
              >
                <Image
                  src={s.image}
                  alt=""
                  aria-hidden="true"
                  fill
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 1152px) 576px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
                />
                {/* Voile sombre pour garder le texte lisible sur n'importe quelle photo */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-t from-encre/85 via-encre/40 to-encre/15"
                />

                <span className="relative font-display text-xl italic opacity-90">
                  0{i + 1}
                </span>
                <span className="relative flex items-end justify-between gap-4">
                  <span className="flex flex-col gap-1.5">
                    <span className="font-display text-3xl italic leading-tight drop-shadow-md sm:text-4xl">
                      {cat.titre}
                    </span>
                    <span className="text-sm text-white/90">{DETAILS[cat.id]}</span>
                    <span className="mt-1 flex items-center gap-2 text-sm text-white/90">
                      {!abonne && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden="true"
                        >
                          <rect x="5" y="11" width="14" height="9" rx="2" />
                          <path d="M8 11V8a4 4 0 0 1 8 0v3" />
                        </svg>
                      )}
                      {n === 0
                        ? "Bientôt disponible"
                        : `${n} contenu${n > 1 ? "s" : ""}`}
                    </span>
                  </span>
                  <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-white transition-transform group-hover:translate-x-1">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#2B1F19"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  </span>
                </span>
              </Link>
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