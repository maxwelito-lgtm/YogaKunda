import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { lienAdminVisible } from "@/lib/admin";
import { CATEGORIES, estAbonne, type Cours } from "@/lib/espace";

export const metadata: Metadata = {
  title: "Mon espace — Shantalam",
  robots: { index: false },
};

type Props = {
  params: Promise<{ categorie: string; id: string }>;
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ID_YOUTUBE = /^[A-Za-z0-9_-]{11}$/;

// Lecteur YouTube sans publicité ciblée ni suggestions d'autres chaînes.
function Lecteur({
  videoId,
  titre,
  extrait = false,
}: {
  videoId: string;
  titre: string;
  extrait?: boolean;
}) {
  const options = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
  });
  if (extrait) options.set("end", "20");

  return (
    <div className="overflow-hidden rounded-3xl bg-encre shadow-lg ring-1 ring-black/5">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${videoId}?${options.toString()}`}
        title={titre}
        className="aspect-video w-full"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}

export default async function LecturePage({ params }: Props) {
  const { categorie, id } = await params;

  const cat = CATEGORIES.find((c) => c.id === categorie);
  if (!cat || !UUID.test(id)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect(`/connexion?next=${encodeURIComponent(`/mon-espace/${cat.id}/${id}`)}`);
  }

  // Le contenu doit exister, être publié et appartenir à cette catégorie.
  const { data: ligne } = await supabase
    .from("cours")
    .select(
      "id, categorie, sous_categorie, titre, description, type, duree_minutes, extrait_ref"
    )
    .eq("id", id)
    .eq("categorie", cat.id)
    .eq("publie", true)
    .maybeSingle();
  if (!ligne) notFound();
  const cours = ligne as Cours;

  // L'accès est décidé ici, côté serveur : abonnement en cours, ou propriétaire du site.
  const { data: abo } = await supabase
    .from("abonnements")
    .select("statut, fin_periode")
    .eq("user_id", user.id)
    .maybeSingle();
  const abonne = estAbonne(abo) || lienAdminVisible(user);

  // Le lien de la vidéo est dans une table fermée : seul le serveur peut le lire,
  // et seulement pour une personne abonnée.
  let videoId: string | null = null;
  if (abonne) {
    const { data: media, error } = await createAdminClient()
      .from("cours_medias")
      .select("video_id")
      .eq("cours_id", cours.id)
      .maybeSingle();
    if (error) console.error("Lecture : lien vidéo introuvable", error);
    const brut = media?.video_id;
    videoId = typeof brut === "string" && ID_YOUTUBE.test(brut) ? brut : null;
  }

  const extrait =
    !abonne && cours.extrait_ref && ID_YOUTUBE.test(cours.extrait_ref)
      ? cours.extrait_ref
      : null;

  const meta = [
    cours.type === "video" ? "Vidéo" : "Audio",
    cours.duree_minutes ? `${cours.duree_minutes} min` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-32 sm:px-6">
        <Link
          href={`/mon-espace/${cat.id}`}
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
          {cat.titre}
        </Link>

        <h1 className="mt-2 font-display text-3xl italic leading-tight text-encre sm:text-5xl">
          {cours.titre}
        </h1>
        <p className="mt-2 text-sm text-encre/70">{meta}</p>

        <div className="mt-6">
          {abonne ? (
            videoId ? (
              <Lecteur videoId={videoId} titre={cours.titre} />
            ) : (
              <p
                role="status"
                className="rounded-2xl bg-white px-5 py-6 text-sm text-encre/75 ring-1 ring-black/5"
              >
                Ce contenu n&rsquo;est pas disponible pour le moment. Merci de
                réessayer un peu plus tard, ou de nous écrire si cela dure.
              </p>
            )
          ) : (
            <div className="flex flex-col gap-5">
              {extrait && (
                <div>
                  <Lecteur videoId={extrait} titre={`Extrait : ${cours.titre}`} extrait />
                  <p className="mt-2 text-[13px] text-encre/70">
                    Extrait gratuit de 20 secondes.
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-4 rounded-3xl bg-[#2B1F19] p-6 text-[#F5F3E7] sm:flex-row sm:items-center sm:justify-between sm:p-7">
                <p className="max-w-xl text-[15px] leading-relaxed">
                  Ce contenu est réservé aux abonnés. Démarrez vos 7 jours
                  offerts pour le suivre en entier.
                </p>
                <a
                  href="/#abonnement"
                  className="btn-bounce inline-flex min-h-[44px] flex-none items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F] px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F]/90"
                >
                  Suivre les cours maintenant
                </a>
              </div>
            </div>
          )}
        </div>

        {cours.description && (
          <p className="mt-8 max-w-2xl whitespace-pre-line text-[16px] leading-relaxed text-encre/85">
            {cours.description}
          </p>
        )}
      </div>

      <Footer />
    </main>
  );
}
