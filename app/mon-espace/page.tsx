import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
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

const STYLES: Record<
  CategorieId,
  { fond: string; texte: string; halo: string; bouton: string; fleche: string }
> = {
  direct: {
    fond: "#2B1F19",
    texte: "#F5F3E7",
    halo: "rgba(117,82,63,0.55)",
    bouton: "#F5F3E7",
    fleche: "#2B1F19",
  },
  replays: {
    fond: "#75523F",
    texte: "#FFFFFF",
    halo: "rgba(255,255,255,0.12)",
    bouton: "#FFFFFF",
    fleche: "#75523F",
  },
  podcasts: {
    fond: "#E3D5C4",
    texte: "#2B1F19",
    halo: "rgba(117,82,63,0.18)",
    bouton: "#2B1F19",
    fleche: "#F5F3E7",
  },
  nidra: {
    fond: "#D3BFA8",
    texte: "#2B1F19",
    halo: "rgba(255,255,255,0.3)",
    bouton: "#2B1F19",
    fleche: "#F5F3E7",
  },
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

  const abonne = estAbonne(abo);
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
              Que souhaitez-vous pratiquer aujourd&apos;hui&nbsp;?
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:items-end">
            <span
              className={`inline-flex rounded-pill px-4 py-2 text-[13px] font-semibold ${
                abonne
                  ? "bg-[#75523F] text-white"
                  : "bg-white text-encre ring-1 ring-black/10"
              }`}
            >
              {etiquette}
            </span>
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

        {/* Messages après le paiement */}
        {abonnement === "ok" && (
          <p
            role="status"
            className="mt-8 rounded-2xl bg-white px-5 py-4 text-sm text-encre ring-1 ring-black/10"
          >
            Merci ! Votre abonnement est en cours d&apos;activation. Si vos
            cours ne se débloquent pas dans quelques secondes, rechargez la
            page.
          </p>
        )}
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

        {/* Grandes tuiles */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {CATEGORIES.map((cat, i) => {
            const s = STYLES[cat.id];
            const n = nombres[cat.id] ?? 0;
            return (
              <Link
                key={cat.id}
                href={`/mon-espace/${cat.id}`}
                className="group relative flex min-h-[200px] flex-col justify-between overflow-hidden rounded-[28px] p-7 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#75523F] sm:min-h-[230px] sm:px-8"
                style={{ backgroundColor: s.fond, color: s.texte }}
              >
                <span
                  aria-hidden="true"
                  className="absolute -right-12 -top-12 h-60 w-60 rounded-full"
                  style={{ backgroundColor: s.halo }}
                />
                <span className="relative font-display text-xl italic opacity-75">
                  0{i + 1}
                </span>
                <span className="relative flex items-end justify-between gap-4">
                  <span className="flex flex-col gap-1.5">
                    <span className="font-display text-3xl italic leading-tight sm:text-4xl">
                      {cat.titre}
                    </span>
                    <span className="flex items-center gap-2 text-sm opacity-80">
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
                  <span
                    className="flex h-12 w-12 flex-none items-center justify-center rounded-full transition-transform group-hover:translate-x-1"
                    style={{ backgroundColor: s.bouton }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke={s.fleche}
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