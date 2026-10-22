import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin";
import { site } from "@/site.config";
import { ajouterContenu } from "../actions";

export const metadata: Metadata = {
  title: `Ajouter un contenu — ${site.nom}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Props = { searchParams: Promise<{ erreur?: string }> };

const MESSAGES: Record<string, string> = {
  titre: "Merci d’écrire un titre.",
  lien: "Ce lien YouTube n’est pas reconnu. Copiez-le depuis YouTube avec « Partager », puis « Copier le lien ».",
  enregistrement: "Le contenu n’a pas pu être enregistré. Merci de réessayer dans un instant.",
};

const champ =
  "w-full min-h-[50px] rounded-xl border border-encre/20 bg-white px-3.5 py-2.5 text-base focus:border-[#75523F] focus:outline-none focus:ring-1 focus:ring-[#75523F]";

export default async function NouveauContenuPage({ searchParams }: Props) {
  await exigerAdmin("/admin/contenus/nouveau");
  const { erreur } = await searchParams;

  return (
    <main className="min-h-screen bg-[#F5F3E7] text-encre">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-5 pb-14 pt-6 sm:px-6">
        <Link
          href="/admin/contenus"
          className="inline-flex items-center gap-1 text-[15px] font-semibold text-[#75523F]"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Retour
        </Link>

        <h1 className="font-display text-4xl italic leading-tight">Ajouter un contenu</h1>

        {erreur && MESSAGES[erreur] && (
          <p role="alert" className="rounded-2xl bg-white p-4 text-sm font-semibold text-alerte">
            {MESSAGES[erreur]}
          </p>
        )}

        <form action={ajouterContenu} className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-sm sm:p-6">
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Titre *
            <input name="titre" type="text" required maxLength={120} className={champ} />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Lien YouTube *
            <input
              name="lien"
              type="url"
              required
              inputMode="url"
              placeholder="https://youtu.be/…"
              className={champ}
            />
            <span className="text-[13px] font-normal text-encre/70">
              Dans YouTube, ouvrez la vidéo, touchez « Partager », puis « Copier le lien ». Collez-le ici. La
              vidéo doit être en mode <strong>Non répertoriée</strong> (et pas « Privée », sinon elle ne
              s’affichera pas).
            </span>
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Description (facultatif)
            <textarea name="description" rows={3} maxLength={600} className={champ} />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              C’est une…
              <select name="type" defaultValue="video" className={champ}>
                <option value="video">Vidéo</option>
                <option value="audio">Audio</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Durée en minutes (facultatif)
              <input name="duree" type="number" min={1} max={600} inputMode="numeric" className={champ} />
            </label>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Où le ranger ?
              <select name="categorie" defaultValue="replays" className={champ}>
                <option value="replays">Replays des cours</option>
                <option value="podcasts">Podcasts</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-semibold">
              Type de replay
              <select name="sous" defaultValue="divers" className={champ}>
                <option value="nidra">Yoga Nidra</option>
                <option value="kundalini">Kundalini Yoga</option>
                <option value="divers">Divers</option>
              </select>
              <span className="text-[13px] font-normal text-encre/70">Seulement pour les replays.</span>
            </label>
          </div>

          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" name="publier" defaultChecked className="mt-1 h-5 w-5 accent-[#75523F]" />
            <span>
              <strong>Publier tout de suite.</strong> Décochez pour l’enregistrer en brouillon et le publier plus tard.
            </span>
          </label>

          <button
            type="submit"
            className="btn-bounce inline-flex min-h-[54px] items-center justify-center rounded-pill bg-encre px-6 py-3 text-base font-semibold text-white"
          >
            Ajouter ce contenu
          </button>
        </form>
      </div>
    </main>
  );
}