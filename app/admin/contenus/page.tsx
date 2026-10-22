import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/site.config";
import { basculerPublication, supprimerContenu } from "./actions";

export const metadata: Metadata = {
  title: `Replays et podcasts — ${site.nom}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Ligne = {
  id: string;
  titre: string;
  type: string;
  categorie: string;
  sous_categorie: string | null;
  duree_minutes: number | null;
  publie: boolean;
};

const SOUS: Record<string, string> = { nidra: "Yoga Nidra", kundalini: "Kundalini Yoga", divers: "Divers" };

type Props = { searchParams: Promise<{ ajoute?: string }> };

export default async function ContenusPage({ searchParams }: Props) {
  await exigerAdmin("/admin/contenus");
  const { ajoute } = await searchParams;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("cours")
    .select("id, titre, type, categorie, sous_categorie, duree_minutes, publie")
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) console.error("Admin : lecture des contenus", error);

  const { data: medias } = await admin.from("cours_medias").select("cours_id");
  const avecLien = new Set((medias ?? []).map((m: { cours_id: string }) => String(m.cours_id)));

  const lignes = (data ?? []) as Ligne[];

  return (
    <main className="min-h-screen bg-[#F5F3E7] text-encre">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-5 pb-14 pt-6 sm:px-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-[15px] font-semibold text-[#75523F]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Accueil
        </Link>

        <h1 className="font-display text-4xl italic leading-tight">Replays et podcasts</h1>

        {ajoute === "1" && (
          <p role="status" className="rounded-2xl bg-[#E6EFE8] p-4 text-sm font-semibold text-[#3f6b4d]">
            Le contenu a bien été ajouté.
          </p>
        )}

        <Link
          href="/admin/contenus/nouveau"
          className="btn-bounce inline-flex min-h-[54px] items-center justify-center gap-2 rounded-pill bg-encre px-6 py-3 text-base font-semibold text-white"
        >
          + Ajouter un contenu
        </Link>

        {error && (
          <p role="alert" className="rounded-2xl bg-white p-4 text-sm text-alerte">
            Impossible de lire la liste des contenus pour le moment.
          </p>
        )}

        {!error && lignes.length === 0 && (
          <p className="rounded-3xl bg-white p-6 text-center text-encre/70">
            Aucun contenu pour le moment. Ajoutez le premier avec le bouton ci-dessus.
          </p>
        )}

        {lignes.map((c) => {
          const id = String(c.id);
          return (
            <article key={id} className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold leading-snug">{c.titre}</h2>
                  <p className="mt-1 text-sm text-encre/70">
                    {c.type === "audio" ? "Audio" : "Vidéo"} ·{" "}
                    {c.categorie === "podcasts" ? "Podcasts" : `Replays${c.sous_categorie ? ` · ${SOUS[c.sous_categorie] ?? ""}` : ""}`}
                    {c.duree_minutes ? ` · ${c.duree_minutes} min` : ""}
                  </p>
                </div>
                <span
                  className={`whitespace-nowrap rounded-pill px-3 py-1 text-xs font-semibold ${
                    c.publie ? "bg-[#E6EFE8] text-[#3f6b4d]" : "bg-encre/10 text-encre/70"
                  }`}
                >
                  {c.publie ? "Publié" : "Brouillon"}
                </span>
              </div>

              {!avecLien.has(id) && (
                <p className="rounded-xl bg-[#F3E3D6] p-3 text-sm text-[#75523F]">
                  Aucun lien vidéo n’est enregistré pour ce contenu : les abonnés ne pourront pas le lire.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-3 border-t border-encre/10 pt-3">
                <form action={basculerPublication}>
                  <input type="hidden" name="id" value={id} />
                  <input type="hidden" name="publie" value={c.publie ? "false" : "true"} />
                  <button
                    type="submit"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-pill border-[1.5px] border-[#75523F] px-5 py-2 text-sm font-semibold text-[#75523F]"
                  >
                    {c.publie ? "Mettre en brouillon" : "Publier"}
                  </button>
                </form>

                <details className="group">
                  <summary className="inline-flex min-h-[44px] cursor-pointer list-none items-center rounded-pill px-4 py-2 text-sm font-semibold text-alerte">
                    Supprimer
                  </summary>
                  <form action={supprimerContenu} className="mt-2 flex flex-col gap-2 rounded-2xl bg-[#F5F3E7] p-3">
                    <input type="hidden" name="id" value={id} />
                    <p className="text-sm">Supprimer définitivement ce contenu ?</p>
                    <button
                      type="submit"
                      className="inline-flex min-h-[44px] items-center justify-center rounded-pill bg-alerte px-5 py-2 text-sm font-semibold text-white"
                    >
                      Oui, supprimer
                    </button>
                  </form>
                </details>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}