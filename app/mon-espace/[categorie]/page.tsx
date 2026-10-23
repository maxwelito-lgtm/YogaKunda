import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CarteCours from "@/components/CarteCours";
import { createClient } from "@/lib/supabase/server";
import { lienAdminVisible } from "@/lib/admin";
import {
  CATEGORIES,
  SOUS_CATEGORIES,
  estAbonne,
  type Cours,
  type SousCategorieId,
} from "@/lib/espace";

export const metadata: Metadata = {
  title: "Mon espace — Shantalam",
  robots: { index: false },
};

type Props = {
  params: Promise<{ categorie: string }>;
  searchParams: Promise<{ sous?: string }>;
};

// Un replay sans sous-catégorie est rangé dans « Divers ».
function sousDe(c: Cours): SousCategorieId {
  return c.sous_categorie ?? "divers";
}

export default async function CategoriePage({ params, searchParams }: Props) {
  const { categorie } = await params;
  const { sous } = await searchParams;

  const cat = CATEGORIES.find((c) => c.id === categorie);
  if (!cat) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/connexion?next=/mon-espace/${cat.id}`);
  }

  const { data: abo } = await supabase
    .from("abonnements")
    .select("statut, fin_periode")
    .eq("user_id", user.id)
    .maybeSingle();

  // Abonnement en cours, ou propriétaire du site (elle voit tout).
  const abonne = estAbonne(abo) || lienAdminVisible(user);

  const { data: lignes } = await supabase
    .from("cours")
    .select(
      "id, categorie, sous_categorie, titre, description, type, duree_minutes, extrait_ref"
    )
    .eq("publie", true)
    .eq("categorie", cat.id)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  const tout = (lignes ?? []) as Cours[];

  // Les filtres n'existent que pour les replays.
  const avecFiltres = cat.id === "replays";
  const sousActive = avecFiltres
    ? SOUS_CATEGORIES.find((s) => s.id === sous)
    : undefined;
  const liste = sousActive ? tout.filter((c) => sousDe(c) === sousActive.id) : tout;

  const base = `/mon-espace/${cat.id}`;
  const filtres = [
    { id: "tout", titre: "Tous", href: base, nb: tout.length },
    ...SOUS_CATEGORIES.map((s) => ({
      id: s.id as string,
      titre: s.titre,
      href: `${base}?sous=${s.id}`,
      nb: tout.filter((c) => sousDe(c) === s.id).length,
    })),
  ];
  const filtreActif = sousActive?.id ?? "tout";

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-32 sm:px-6">
        <Link
          href="/mon-espace"
          className="inline-flex min-h-[44px] items-center gap-2 text-[13px] font-semibold text-[#75523F] hover:underline"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          Mon espace
        </Link>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-display text-4xl italic text-encre sm:text-6xl">
            {cat.titre}
          </h1>
          {liste.length > 0 && (
            <p className="text-sm text-encre/70">
              {liste.length} contenu{liste.length > 1 ? "s" : ""}
            </p>
          )}
        </div>

        {avecFiltres && (
          <nav
            aria-label="Filtrer les replays"
            className="mt-6 flex flex-wrap gap-2"
          >
            {filtres.map((f) => {
              const actif = f.id === filtreActif;
              return (
                <Link
                  key={f.id}
                  href={f.href}
                  aria-current={actif ? "page" : undefined}
                  className={`inline-flex min-h-[44px] items-center gap-2 rounded-pill px-5 py-2 text-sm font-semibold transition-colors ${
                    actif
                      ? "bg-[#2B1F19] text-[#F5F3E7]"
                      : "bg-white text-encre ring-1 ring-black/10 hover:ring-black/30"
                  }`}
                >
                  {f.titre}
                  <span className="text-xs opacity-60">{f.nb}</span>
                </Link>
              );
            })}
          </nav>
        )}

        {!abonne && (
          <div className="mt-8 flex flex-col gap-4 rounded-3xl bg-[#2B1F19] p-6 text-[#F5F3E7] sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <p className="max-w-xl text-[15px] leading-relaxed">
              Les contenus sont réservés aux abonnés. Pour y accéder,
              démarrez vos 7 jours offerts.
            </p>
            <a
              href="/#abonnement"
              className="btn-bounce inline-flex min-h-[44px] flex-none items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F] px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F]/90"
            >
              Suivre les cours maintenant
            </a>
          </div>
        )}

        <div className="mt-10">
          {liste.length === 0 ? (
            <p className="rounded-2xl bg-white/60 px-5 py-6 text-sm text-encre/70 ring-1 ring-black/5">
              {sousActive
                ? "Aucun contenu dans cette catégorie pour l'instant."
                : "Les premiers contenus arrivent bientôt."}
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {liste.map((c, i) => (
                <CarteCours key={c.id} cours={c} index={i} verrouille={!abonne} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}