import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { lireLieu } from "@/data/lieux";
import { UUID, heureCourte, jourLong, type Cours } from "@/lib/calendrier";
import { enregistrerCours, supprimerCours } from "../actions";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Modifier un cours — ${site.nom}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ erreur?: string }>;
};

const ERREURS: Record<string, string> = {
  date: "La date n’est pas valide.",
  heures: "L’heure de fin doit être après l’heure de début.",
  existe: "Il y a déjà un cours ce jour-là à cet endroit.",
  enregistrement: "L’enregistrement n’a pas fonctionné. Réessayez dans un instant.",
};

export default async function CoursPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = await searchParams;
  await exigerAdmin(`/admin/calendrier/${id}`);
  if (!UUID.test(id)) notFound();

  const { data } = await createAdminClient()
    .from("cours_calendrier")
    .select("id, lieu, jour, heure_debut, heure_fin, statut, places, complet, note, jour_initial")
    .eq("id", id)
    .maybeSingle();
  if (!data) notFound();
  const c = data as Cours;
  const lieu = lireLieu(c.lieu);

  const champ =
    "mt-1.5 block min-h-[48px] w-full rounded-2xl border-[1.5px] border-encre/20 px-3 text-[16px] font-normal";

  return (
    <main className="min-h-screen bg-[#F5F3E7] text-encre">
      <div className="mx-auto flex max-w-3xl flex-col gap-5 px-5 pb-12 pt-7 sm:px-6">
        <Link
          href={`/admin/calendrier?mois=${c.jour.slice(0, 7)}`}
          className="text-[15px] font-semibold text-[#75523F]"
        >
          ‹ Calendrier
        </Link>
        <div>
          <h1 className="font-display text-3xl italic leading-tight sm:text-4xl">
            {jourLong(c.jour).replace(/^./, (x) => x.toUpperCase())}
          </h1>
          <p className="mt-1 text-[15px] text-encre/70">
            Kundalini · {lieu.ville}, {lieu.salle}
          </p>
          {c.jour_initial && (
            <p className="mt-1 text-[13px] text-encre/60">
              Initialement prévu le {jourLong(c.jour_initial)}.
            </p>
          )}
        </div>

        {sp.erreur && ERREURS[sp.erreur] && (
          <p role="alert" className="rounded-2xl bg-white px-5 py-3 text-sm font-semibold text-alerte">
            {ERREURS[sp.erreur]}
          </p>
        )}

        <form action={enregistrerCours} className="flex flex-col gap-5 rounded-3xl bg-white p-5">
          <input type="hidden" name="id" value={c.id} />

          <fieldset>
            <legend className="mb-2 text-sm font-semibold">Ce cours a lieu ?</legend>
            <div className="flex gap-2">
              {(
                [
                  ["oui", "Oui"],
                  ["annule", "Annulé"],
                ] as const
              ).map(([valeur, libelle]) => (
                <label key={valeur} className="block flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="statut"
                    value={valeur}
                    defaultChecked={(c.statut === "annule") === (valeur === "annule")}
                    className="peer sr-only"
                  />
                  <span className="block rounded-2xl border-[1.5px] border-encre/20 py-3 text-center text-[15px] peer-checked:border-encre peer-checked:bg-encre peer-checked:font-semibold peer-checked:text-[#F5F3E7] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#75523F]">
                    {libelle}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <label className="text-sm font-semibold">
            Date
            <input type="date" name="jour" defaultValue={c.jour} required className={champ} />
            <span className="mt-1 block text-[13px] font-normal text-encre/65">
              Pour déplacer le cours, changez la date : il sera marqué « Déplacé ».
            </span>
          </label>

          <div className="flex gap-3">
            <label className="flex-1 text-sm font-semibold">
              Début
              <input
                type="time"
                name="debut"
                defaultValue={heureCourte(c.heure_debut)}
                required
                className={champ}
              />
            </label>
            <label className="flex-1 text-sm font-semibold">
              Fin
              <input
                type="time"
                name="fin"
                defaultValue={heureCourte(c.heure_fin)}
                required
                className={champ}
              />
            </label>
          </div>

          <div className="flex items-end gap-3">
            <label className="flex-1 text-sm font-semibold">
              Nombre de places
              <input
                type="number"
                name="places"
                min={1}
                max={200}
                inputMode="numeric"
                defaultValue={c.places ?? ""}
                placeholder="Facultatif"
                className={champ}
              />
            </label>
            <label className="flex min-h-[48px] flex-1 cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] border-encre/20 px-3 text-[15px] font-semibold">
              <input
                type="checkbox"
                name="complet"
                defaultChecked={c.complet}
                className="h-5 w-5 accent-[#75523F]"
              />
              Complet
            </label>
          </div>

          <label className="text-sm font-semibold">
            Note pour les élèves
            <input
              type="text"
              name="note"
              maxLength={200}
              defaultValue={c.note ?? ""}
              placeholder="Apportez un tapis"
              className={champ}
            />
          </label>

          <button
            type="submit"
            className="btn-bounce min-h-[52px] rounded-pill bg-[#75523F] px-6 py-3 text-base font-semibold text-white"
          >
            Enregistrer
          </button>
        </form>

        <details className="rounded-3xl bg-white p-5">
          <summary className="cursor-pointer text-[15px] font-semibold text-encre/70">
            Supprimer ce cours
          </summary>
          <p className="mt-3 text-[14px] text-encre/70">
            Le cours disparaît du calendrier. Pour prévenir les élèves d’un cours qui n’a pas lieu,
            choisissez plutôt « Annulé » : il reste affiché avec la mention.
          </p>
          <form action={supprimerCours} className="mt-3">
            <input type="hidden" name="id" value={c.id} />
            <button
              type="submit"
              className="min-h-[48px] rounded-pill border-[1.5px] border-alerte px-6 py-2.5 text-[15px] font-semibold text-alerte"
            >
              Oui, supprimer
            </button>
          </form>
        </details>
      </div>
    </main>
  );
}