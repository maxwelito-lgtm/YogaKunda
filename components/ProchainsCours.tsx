import Link from "next/link";
import type { ReactNode } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import { lieux } from "@/data/lieux";
import { aujourdhui, heureFr, jourCourt, jourLong, nomMois, type Cours } from "@/lib/calendrier";
import { lienCta } from "@/components/lien-cta";

function Pastille({ children, sombre }: { children: ReactNode; sombre?: boolean }) {
  return (
    <span
      className={`whitespace-nowrap rounded-pill px-2.5 py-0.5 text-xs font-semibold ${
        sombre ? "bg-encre text-[#F5F3E7]" : "bg-[#F3E3D6] text-[#75523F]"
      }`}
    >
      {children}
    </span>
  );
}

function Ligne({ c }: { c: Cours }) {
  const annule = c.statut === "annule";
  return (
    <li
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-[#F5F3E7] px-3 py-2.5 ${
        annule ? "text-encre/55" : "text-encre"
      }`}
    >
      <span className={`min-w-[7.5rem] text-[15px] font-semibold ${annule ? "line-through" : ""}`}>
        {jourCourt(c.jour)}
      </span>
      <span className="flex-1 text-[13px] text-encre/70">
        {annule
          ? (c.note ?? "Pas de cours")
          : [`${heureFr(c.heure_debut)} à ${heureFr(c.heure_fin)}`, c.note].filter(Boolean).join(" · ")}
        {c.statut === "deplace" && c.jour_initial
          ? ` · déplacé depuis le ${jourLong(c.jour_initial)}`
          : ""}
      </span>
      {annule && <Pastille sombre>Annulé</Pastille>}
      {c.statut === "deplace" && <Pastille>Déplacé</Pastille>}
      {c.complet && !annule && <Pastille>Complet</Pastille>}
    </li>
  );
}

export default async function ProchainsCours() {
  const { data, error } = await createPublicClient()
    .from("cours_calendrier")
    .select("id, lieu, jour, heure_debut, heure_fin, statut, places, complet, note, jour_initial")
    .gte("jour", aujourdhui())
    .order("jour", { ascending: true })
    .limit(200);

  if (error) console.error("Calendrier public : lecture impossible", error);
  const cours = (data ?? []) as Cours[];
  if (cours.length === 0) return null;

  return (
    <section id="prochains-cours" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl italic text-encre sm:text-4xl">
          Prochains cours
        </h2>
        <p className="mx-auto mb-10 mt-3 max-w-xl text-center text-encre/70">
          Le lundi à Géronce et le mercredi à Oloron, de 18 h 30 à 20 h. Les cours s’arrêtent
          pendant les vacances : seules les dates ci-dessous ont lieu.
        </p>

        <div className="grid gap-5 md:grid-cols-2">
          {lieux.map((lieu) => {
            const liste = cours.filter((c) => c.lieu === lieu.id);
            if (liste.length === 0) return null;
            const visibles = liste.slice(0, 4);
            const suite = liste.slice(4);

            // Les dates suivantes, rangées par mois.
            const parMois = new Map<string, Cours[]>();
            for (const c of suite) {
              const m = c.jour.slice(0, 7);
              parMois.set(m, [...(parMois.get(m) ?? []), c]);
            }

            const itineraire = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${lieu.salle}, ${lieu.adresse}`
            )}`;

            return (
              <article key={lieu.id} className="rounded-3xl bg-white p-5 sm:p-6">
                <div className="mb-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-display text-2xl italic text-encre">
                      Le {lieu.jourNom} à {lieu.ville}
                    </h3>
                    <p className="mt-1 text-sm text-encre/70">
                      {lieu.salle}, {lieu.adresse}
                    </p>
                  </div>
                  <a
                    href={itineraire}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="whitespace-nowrap text-sm font-semibold text-[#75523F] hover:underline"
                  >
                    Itinéraire ↗
                  </a>
                </div>

                <ul className="flex flex-col gap-2">
                  {visibles.map((c) => (
                    <Ligne key={c.id} c={c} />
                  ))}
                </ul>

                {suite.length > 0 && (
                  <details className="mt-3">
                    <summary className="cursor-pointer text-sm font-semibold text-[#75523F]">
                      Voir toutes les dates ({suite.length} de plus)
                    </summary>
                    <div className="mt-3 flex flex-col gap-4">
                      {[...parMois.entries()].map(([mois, lignes]) => (
                        <div key={mois}>
                          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-encre/55">
                            {nomMois(mois)}
                          </h4>
                          <ul className="flex flex-col gap-2">
                            {lignes.map((c) => (
                              <Ligne key={c.id} c={c} />
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/reserver?offre=kundalini"
            className={lienCta.sombre}
          >
            Réserver mes cours
          </Link>
        </div>
      </div>
    </section>
  );
}