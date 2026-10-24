import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { lieux, type LieuId } from "@/data/lieux";
import { lirePageLieu, pagesLieux } from "@/data/pages-lieux";
import TarifsActivite from "@/components/TarifsActivite";
import { lienCta } from "@/components/lien-cta";

const heure = (h: string) => h.replace(":", " h ").replace(/ h 00$/, " h");

function Info({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#75523F]">{titre}</p>
      <div className="mt-2 text-encre">{children}</div>
    </div>
  );
}

export default function LieuPage({ lieuId }: { lieuId: LieuId }) {
  const page = lirePageLieu(lieuId);
  const lieu = lieux.find((l) => l.id === lieuId)!;
  const autre = pagesLieux.find((p) => p.lieuId !== lieuId)!;
  const autreLieu = lieux.find((l) => l.id === autre.lieuId)!;
  const itineraire = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${lieu.salle}, ${lieu.adresse}`,
  )}`;

  return (
    <>
      {/* En-tête avec photo : même principe que les pages d'activité */}
      <section className="relative min-h-[80vh] w-full overflow-hidden">
        <Image
          src={page.heroImage}
          alt={page.heroAlt}
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/30 to-encre/10" />
        <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center gap-5 px-5 pb-12 pt-32 text-center sm:gap-6 sm:px-12">
          <h1 className="max-w-3xl font-display text-4xl italic text-white drop-shadow-lg sm:text-6xl">
            {page.titre}
          </h1>
          <p className="max-w-xl text-base text-white/90 drop-shadow-md sm:text-lg">{page.accroche}</p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link href="/reserver?offre=kundalini" className={lienCta.clair}>
              Réserver un cours
            </Link>
            <a href="#tarifs" className={lienCta.clair}>
              Voir les tarifs
            </a>
          </div>
        </div>
      </section>

      {/* Informations pratiques */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-display text-3xl italic text-encre sm:text-4xl">
          Les informations pratiques
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <Info titre="Quand">
            <p className="font-display text-2xl italic">Chaque {lieu.jourNom}</p>
            <p className="mt-1 text-sm text-encre/70">
              de {heure(lieu.debut)} à {heure(lieu.fin)}
            </p>
          </Info>
          <Info titre="Où">
            <p className="font-display text-2xl italic">{lieu.salle}</p>
            <p className="mt-1 text-sm text-encre/70">{lieu.adresse}</p>
          </Info>
          <Info titre="Comment venir">
            <a
              href={itineraire}
              target="_blank"
              rel="noopener noreferrer"
              className="relative inline-block border-b border-current pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-encre transition-opacity hover:opacity-70"
            >
              Voir l&rsquo;itinéraire
            </a>
          </Info>
        </div>
      </section>

      {/* Présentation */}
      <section className="mx-auto max-w-3xl px-4 pb-16 text-center sm:px-6">
        <h2 className="font-display text-3xl italic text-encre sm:text-4xl">{page.introTitre}</h2>
        {page.intro.map((p) => (
          <p key={p} className="mt-4 text-encre/80">
            {p}
          </p>
        ))}
        <p className="mt-6 text-sm text-encre/70">
          Pour en savoir plus sur la pratique et le déroulé d&rsquo;une séance, découvrez{" "}
          <Link href="/yoga/kundalini" className="underline underline-offset-4 hover:text-encre">
            le Kundalini Yoga
          </Link>
          .
        </p>
      </section>

      <TarifsActivite type="kundalini" />

      {/* Questions fréquentes */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-display text-3xl italic text-encre sm:text-4xl">
          Questions fréquentes
        </h2>
        <dl className="mt-10 flex flex-col gap-6">
          {page.questions.map((q) => (
            <div key={q.question}>
              <dt className="font-semibold text-encre">{q.question}</dt>
              <dd className="mt-1 text-sm text-encre/75">{q.reponse}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Autre lieu */}
      <section className="px-4 pb-20 text-center sm:px-6">
        <p className="text-encre/70">
          Vous préférez le {autreLieu.jourNom} ?{" "}
          <Link href={autre.chemin} className="font-semibold text-encre underline underline-offset-4">
            Cours de yoga à {autre.villeComplete}
          </Link>
        </p>
      </section>
    </>
  );
}
