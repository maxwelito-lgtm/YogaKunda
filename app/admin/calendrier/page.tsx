import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { lieux, lireLieu } from "@/data/lieux";
import {
  MOIS_ISO,
  aujourdhui,
  heureFr,
  jourCourt,
  jourSemaine,
  moisDecale,
  nomMois,
  type Cours,
} from "@/lib/calendrier";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Calendrier des cours — ${site.nom}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = {
  searchParams: Promise<{
    mois?: string;
    enregistre?: string;
    ajoutes?: string;
    supprime?: string;
  }>;
};

const JOURS = ["L", "M", "M", "J", "V", "S", "D"];

export default async function CalendrierPage({ searchParams }: Props) {
  await exigerAdmin("/admin/calendrier");
  const sp = await searchParams;

  const aujourdHui = aujourdhui();
  const mois = sp.mois && MOIS_ISO.test(sp.mois) ? sp.mois : aujourdHui.slice(0, 7);
  const debut = `${mois}-01`;
  const fin = `${moisDecale(mois, 1)}-01`;

  const { data, error } = await createAdminClient()
    .from("cours_calendrier")
    .select("id, lieu, jour, heure_debut, heure_fin, statut, places, complet, note, jour_initial")
    .gte("jour", debut)
    .lt("jour", fin)
    .order("jour", { ascending: true });
  if (error) console.error("Admin : lecture du calendrier", error);
  const cours = (data ?? []) as Cours[];

  const parJour = new Map<string, Cours[]>();
  for (const c of cours) parJour.set(c.jour, [...(parJour.get(c.jour) ?? []), c]);

  // Cases du mois : des cases vides pour commencer le lundi, puis chaque jour.
  const [annee, m] = mois.split("-").map(Number);
  const nbJours = new Date(Date.UTC(annee, m, 0)).getUTCDate();
  const decalage = jourSemaine(debut);
  const cases: (string | null)[] = [
    ...Array.from({ length: decalage }, () => null),
    ...Array.from({ length: nbJours }, (_, i) => `${mois}-${String(i + 1).padStart(2, "0")}`),
  ];

  const message = sp.enregistre
    ? "Modification enregistrée."
    : sp.supprime
      ? "Cours supprimé."
      : sp.ajoutes !== undefined
        ? Number(sp.ajoutes) > 0
          ? `${sp.ajoutes} cours ajouté${Number(sp.ajoutes) > 1 ? "s" : ""}.`
          : "Ces cours existaient déjà."
        : null;

  return (
    <main className="min-h-screen bg-[#F5F3E7] text-encre">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 pb-12 pt-7 sm:px-6">
        <Link href="/admin" className="text-[15px] font-semibold text-[#75523F]">
          ‹ Accueil
        </Link>
        <h1 className="font-display text-4xl italic leading-tight sm:text-5xl">
          Calendrier des cours
        </h1>
        <p className="-mt-2 text-base text-encre/70">Cours de Kundalini, à Géronce et à Oloron.</p>

        {message && (
          <p role="status" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-[#3f6b4d]">
            {message}
          </p>
        )}

        <section className="rounded-3xl bg-white p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between">
            <Link
              href={`/admin/calendrier?mois=${moisDecale(mois, -1)}`}
              aria-label="Mois précédent"
              className="flex h-11 w-11 items-center justify-center text-2xl text-[#75523F]"
            >
              ‹
            </Link>
            <h2 className="text-lg font-semibold">{nomMois(mois)}</h2>
            <Link
              href={`/admin/calendrier?mois=${moisDecale(mois, 1)}`}
              aria-label="Mois suivant"
              className="flex h-11 w-11 items-center justify-center text-2xl text-[#75523F]"
            >
              ›
            </Link>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-encre/55">
            {JOURS.map((j, i) => (
              <span key={i}>{j}</span>
            ))}
          </div>
          <div className="mt-1 grid grid-cols-7 gap-1 text-center text-[14px]">
            {cases.map((iso, i) => {
              if (!iso) return <span key={`v${i}`} />;
              const num = Number(iso.slice(8));
              const duJour = parJour.get(iso);
              const ws = jourSemaine(iso);
              const lieuDuJour = lieux.find((l) => l.jourSemaine === ws + 1);

              if (duJour) {
                const annule = duJour.every((c) => c.statut === "annule");
                return (
                  <Link
                    key={iso}
                    href={`/admin/calendrier/${duJour[0].id}`}
                    className={`flex min-h-[40px] items-center justify-center rounded-xl text-[14px] font-semibold ${
                      annule
                        ? "border-[1.5px] border-[#75523F] text-[#75523F] line-through"
                        : "bg-[#75523F] text-white"
                    }`}
                  >
                    {num}
                  </Link>
                );
              }
              if (lieuDuJour && iso >= aujourdHui) {
                return (
                  <Link
                    key={iso}
                    href={`/admin/calendrier/ajouter?lieu=${lieuDuJour.id}&date=${iso}`}
                    aria-label={`Ajouter un cours le ${iso}`}
                    className="flex min-h-[40px] items-center justify-center rounded-xl border border-dashed border-encre/25 text-encre/60"
                  >
                    {num}
                  </Link>
                );
              }
              return (
                <span key={iso} className="flex min-h-[40px] items-center justify-center text-encre/60">
                  {num}
                </span>
              );
            })}
          </div>

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-encre/65">
            <span>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[3px] bg-[#75523F]" />
              Cours
            </span>
            <span>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[3px] border-[1.5px] border-[#75523F]" />
              Annulé
            </span>
            <span>
              <span className="mr-1.5 inline-block h-2.5 w-2.5 rounded-[3px] border border-dashed border-encre/40" />
              Jour de cours sans cours : touchez pour l’ajouter
            </span>
          </div>
        </section>

        <h2 className="mt-1 text-xs font-semibold uppercase tracking-wide text-encre/55">
          Les cours de {nomMois(mois).toLowerCase()}
        </h2>

        {cours.length === 0 ? (
          <p className="rounded-2xl bg-white px-5 py-4 text-[15px] text-encre/70">
            Aucun cours ce mois-ci.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {cours.map((c) => {
              const lieu = lireLieu(c.lieu);
              return (
                <li key={c.id}>
                  <Link
                    href={`/admin/calendrier/${c.id}`}
                    className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-[15px] font-semibold ${
                          c.statut === "annule" ? "text-encre/50 line-through" : ""
                        }`}
                      >
                        {jourCourt(c.jour)} · {lieu.ville}
                      </p>
                      <p className="text-[13px] text-encre/65">
                        {heureFr(c.heure_debut)} à {heureFr(c.heure_fin)}
                        {c.note ? ` · ${c.note}` : ""}
                      </p>
                    </div>
                    {c.statut === "annule" && <Pastille>Annulé</Pastille>}
                    {c.statut === "deplace" && <Pastille>Déplacé</Pastille>}
                    {c.complet && c.statut !== "annule" && <Pastille>Complet</Pastille>}
                    <span aria-hidden="true" className="text-xl text-[#75523F]">
                      ›
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}

        <Link
          href="/admin/calendrier/ajouter"
          className="btn-bounce inline-flex min-h-[52px] items-center justify-center rounded-pill bg-[#75523F] px-6 py-3 text-base font-semibold text-white"
        >
          Ajouter des cours
        </Link>
      </div>
    </main>
  );
}

function Pastille({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-pill bg-[#F3E3D6] px-2.5 py-0.5 text-xs font-semibold text-[#75523F]">
      {children}
    </span>
  );
}