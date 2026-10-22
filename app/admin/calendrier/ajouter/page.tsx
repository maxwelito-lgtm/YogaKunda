import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { lieux, lireLieu } from "@/data/lieux";
import { DATE_ISO, ajouterJours, aujourdhui, jourCourt, jourSemaine } from "@/lib/calendrier";
import { ajouterCours } from "../actions";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Ajouter des cours — ${site.nom}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ lieu?: string; date?: string; erreur?: string }> };

const ERREURS: Record<string, string> = {
  dates: "Cochez au moins une date.",
  heures: "L’heure de fin doit être après l’heure de début.",
  trop: "Vous avez coché trop de dates à la fois.",
  enregistrement: "L’enregistrement n’a pas fonctionné. Réessayez dans un instant.",
};

export default async function AjouterPage({ searchParams }: Props) {
  await exigerAdmin("/admin/calendrier/ajouter");
  const sp = await searchParams;

  const lieu = lireLieu(sp.lieu);
  const auj = aujourdhui();

  // Les prochaines semaines de ce jour de cours (lundi pour Géronce, mercredi pour Oloron).
  const decalage = (lieu.jourSemaine - 1 - jourSemaine(auj) + 7) % 7;
  const candidats: string[] = [];
  for (let i = 0; i < 26; i++) candidats.push(ajouterJours(auj, decalage + 7 * i));

  const prefill = sp.date && DATE_ISO.test(sp.date) ? sp.date : null;
  if (prefill && !candidats.includes(prefill) && jourSemaine(prefill) === lieu.jourSemaine - 1) {
    candidats.push(prefill);
    candidats.sort();
  }

  // On ne propose pas les cours qui existent déjà.
  const { data } = await createAdminClient()
    .from("cours_calendrier")
    .select("jour")
    .eq("lieu", lieu.id)
    .gte("jour", candidats[0])
    .lte("jour", candidats[candidats.length - 1]);
  const existants = new Set((data ?? []).map((r) => r.jour as string));
  const libres = candidats.filter((j) => !existants.has(j));

  const cochees = new Set(prefill ? [prefill] : libres.slice(0, 12));

  return (
    <main className="min-h-screen bg-[#F5F3E7] text-encre">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 pb-12 pt-7 sm:px-6">
        <Link href="/admin/calendrier" className="text-[15px] font-semibold text-[#75523F]">
          ‹ Calendrier
        </Link>
        <h1 className="font-display text-4xl italic leading-tight">Ajouter des cours</h1>

        {sp.erreur && ERREURS[sp.erreur] && (
          <p role="alert" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-alerte">
            {ERREURS[sp.erreur]}
          </p>
        )}

        <form action={ajouterCours} className="flex flex-col gap-5 rounded-3xl bg-white p-5">
          <input type="hidden" name="lieu" value={lieu.id} />

          <div>
            <p className="mb-2 text-sm font-semibold">Quel cours ?</p>
            <div className="flex gap-2">
              {lieux.map((l) => (
                <Link
                  key={l.id}
                  href={`/admin/calendrier/ajouter?lieu=${l.id}`}
                  className={`flex-1 rounded-2xl px-2 py-3 text-center text-[14px] font-semibold ${
                    l.id === lieu.id
                      ? "bg-encre text-[#F5F3E7]"
                      : "border-[1.5px] border-encre/20 text-encre"
                  }`}
                >
                  {l.jourNom.charAt(0).toUpperCase() + l.jourNom.slice(1)} · {l.ville}
                </Link>
              ))}
            </div>
            <p className="mt-2 text-[13px] text-encre/65">
              {lieu.salle}, {lieu.adresse}
            </p>
          </div>

          <div className="flex gap-3">
            <label className="flex-1 text-sm font-semibold">
              Début
              <input
                type="time"
                name="debut"
                defaultValue={lieu.debut}
                required
                className="mt-1.5 block min-h-[48px] w-full rounded-2xl border-[1.5px] border-encre/20 px-3 text-[16px] font-normal"
              />
            </label>
            <label className="flex-1 text-sm font-semibold">
              Fin
              <input
                type="time"
                name="fin"
                defaultValue={lieu.fin}
                required
                className="mt-1.5 block min-h-[48px] w-full rounded-2xl border-[1.5px] border-encre/20 px-3 text-[16px] font-normal"
              />
            </label>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">
              Cochez les {lieu.jourNom}s où il y a cours
            </legend>
            {libres.length === 0 ? (
              <p className="text-[14px] text-encre/65">Tous les prochains {lieu.jourNom}s sont déjà ajoutés.</p>
            ) : (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {libres.map((j) => (
                  <label key={j} className="block cursor-pointer">
                    <input
                      type="checkbox"
                      name="dates"
                      value={j}
                      defaultChecked={cochees.has(j)}
                      className="peer sr-only"
                    />
                    <span className="block rounded-xl border-[1.5px] border-encre/20 px-2 py-2.5 text-center text-[14px] text-encre/70 peer-checked:border-[#75523F] peer-checked:bg-[#75523F] peer-checked:font-semibold peer-checked:text-white peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#75523F]">
                      {jourCourt(j)}
                    </span>
                  </label>
                ))}
              </div>
            )}
            <p className="mt-2 text-[13px] text-encre/65">
              Pour une semaine de vacances, laissez la date décochée.
            </p>
          </fieldset>

          <label className="text-sm font-semibold">
            Un cours un autre jour ? (facultatif)
            <input
              type="date"
              name="autre"
              min={auj}
              className="mt-1.5 block min-h-[48px] w-full rounded-2xl border-[1.5px] border-encre/20 px-3 text-[16px] font-normal"
            />
          </label>

          <button
            type="submit"
            className="btn-bounce min-h-[52px] rounded-pill bg-[#75523F] px-6 py-3 text-base font-semibold text-white"
          >
            Ajouter les cours cochés
          </button>
        </form>
      </div>
    </main>
  );
}