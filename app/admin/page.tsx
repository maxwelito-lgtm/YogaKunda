import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Mon espace — ${site.nom}`,
  robots: { index: false, follow: false },
};

// Toujours à jour : on ne garde rien en mémoire.
export const dynamic = "force-dynamic";

export default async function AdminAccueil() {
  const { prenom } = await exigerAdmin("/admin");

  const admin = createAdminClient();

  // Nombre de personnes qui ont payé et qu'il reste à rappeler.
  const { count, error } = await admin
    .from("commandes")
    .select("id", { count: "exact", head: true })
    .eq("statut", "payee")
    .is("rappelee_le", null);
  if (error) console.error("Admin : comptage des réservations", error);
  const aRappeler = error ? null : (count ?? 0);

  // Nombre d'abonnés en cours (essai gratuit ou abonnement actif).
  const { count: nbAbonnes } = await admin
    .from("abonnements")
    .select("user_id", { count: "exact", head: true })
    .in("statut", ["essai", "actif"]);

  return (
    <main className="min-h-screen bg-[#F5F3E7] text-encre">
      <div className="mx-auto flex max-w-3xl flex-col gap-6 px-5 pb-12 pt-7 sm:px-6">
        <div className="flex items-center justify-between">
          <span className="font-display text-2xl italic text-[#75523F]">{site.nom}</span>
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#75523F] font-semibold text-white"
          >
            {(prenom || "C").charAt(0).toUpperCase()}
          </span>
        </div>

        <div>
          <h1 className="font-display text-4xl italic leading-tight sm:text-5xl">
            Bonjour{prenom ? ` ${prenom}` : ""}
          </h1>
          <p className="mt-2 text-base text-encre/70">Voici ce qui vous attend aujourd’hui.</p>
        </div>

        {/* Carte principale : les personnes à rappeler */}
        <section className="rounded-3xl bg-encre p-5 text-white sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 flex-none items-center justify-center rounded-full bg-[#75523F]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
                  stroke="#fff"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <p className="text-xl font-semibold">
                {aRappeler === null
                  ? "Réservations"
                  : aRappeler === 0
                    ? "Personne à rappeler"
                    : aRappeler === 1
                      ? "1 personne à rappeler"
                      : `${aRappeler} personnes à rappeler`}
              </p>
              <p className="mt-0.5 text-sm text-white/75">
                {aRappeler === null
                  ? "Le suivi des appels n’est pas encore activé."
                  : aRappeler === 0
                    ? "Tout est à jour, bravo."
                    : "Elles ont payé et attendent une date."}
              </p>
            </div>
          </div>
          <Link
            href="/admin/reservations"
            className="btn-bounce mt-5 inline-flex min-h-[48px] w-full items-center justify-center rounded-pill bg-white px-6 py-3 text-base font-semibold text-encre"
          >
            Voir la liste
          </Link>
        </section>

        {/* Les autres rubriques */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Tuile titre="Replays et podcasts" aide="Ajouter un contenu" href="/admin/contenus">
            <path d="M8 5v14l11-7L8 5Z" />
          </Tuile>
          <Tuile titre="Mes abonnés" aide={`${nbAbonnes ?? 0} en cours`} href="/admin/abonnes">
            <circle cx="9" cy="9" r="3.2" />
            <path d="M3.5 19c.6-3 3-4.5 5.5-4.5s4.9 1.5 5.5 4.5" />
            <path d="M16 7.5a3 3 0 0 1 0 5.5M18 15c1.6.6 2.6 1.9 3 4" />
          </Tuile>
          <Tuile titre="Textes et photos" aide="Modifier mon site" bientot>
            <rect x="3" y="4" width="18" height="16" rx="3" />
            <circle cx="9" cy="10" r="1.6" />
            <path d="m4 17 5-4 4 3 3-2 4 3" />
          </Tuile>
        </div>

        <Link
          href="/"
          className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-pill border-[1.5px] border-[#75523F] px-6 py-3 text-[15px] font-semibold text-[#75523F]"
        >
          Voir mon site
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M7 17 17 7M9 7h8v8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </main>
  );
}

function Tuile({
  titre,
  aide,
  bientot,
  href,
  children,
}: {
  titre: string;
  aide: string;
  bientot?: boolean;
  href?: string;
  children: ReactNode;
}) {
  const contenu = (
    <>
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#75523F"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {children}
      </svg>
      <div>
        <p className="text-base font-semibold leading-snug">{titre}</p>
        <p className="mt-1 text-[13px] text-encre/65">{aide}</p>
      </div>
      {bientot && (
        <span className="mt-auto w-fit rounded-pill bg-[#F3E3D6] px-2.5 py-0.5 text-xs font-semibold text-[#75523F]">
          Bientôt
        </span>
      )}
    </>
  );

  const base = "flex min-h-[132px] flex-col gap-3 rounded-3xl bg-white p-4 shadow-sm";

  if (href && !bientot) {
    return (
      <Link href={href} className={`${base} transition-shadow hover:shadow-md`}>
        {contenu}
      </Link>
    );
  }

  return (
    <div aria-disabled={bientot ? "true" : undefined} className={`${base} ${bientot ? "opacity-70" : ""}`}>
      {contenu}
    </div>
  );
}