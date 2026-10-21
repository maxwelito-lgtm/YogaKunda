import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import type { ActivityPageData } from "@/data/activity-pages";
import ActivityTabs from "@/components/ActivityTabs";
import TarifsActivite from "@/components/TarifsActivite";

function CtaLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function ActivityPage({ data }: { data: ActivityPageData }) {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[80vh] w-full overflow-hidden">
        <Image
          src={data.heroImage}
          alt={data.heroAlt}
          fill
          loading="eager"
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/30 to-encre/10" />

        <div className="relative z-10 flex min-h-[80vh] flex-col items-center justify-center gap-5 px-5 pb-12 pt-32 text-center sm:gap-6 sm:px-12">
          <h1 className="max-w-3xl font-display text-4xl italic text-white drop-shadow-lg sm:text-6xl">
            {data.titre}
          </h1>
          <p className="max-w-xl text-base text-white/90 drop-shadow-md sm:text-lg">
            {data.accroche}
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <CtaLink
              href={data.ctaPrincipal.href}
              className="btn-bounce rounded-pill border-[1.5px] border-white bg-black/35 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/50 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              {data.ctaPrincipal.label}
            </CtaLink>
            <CtaLink
              href={data.ctaSecondaire.href}
              className="btn-bounce rounded-pill border-[1.5px] border-white/70 px-5 py-2.5 text-xs font-semibold text-white hover:bg-white/10 sm:px-7 sm:py-3.5 sm:text-sm"
            >
              {data.ctaSecondaire.label}
            </CtaLink>
          </div>
        </div>
      </section>

        {/* Présentation */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-display text-3xl italic text-encre sm:text-4xl">
          {data.intro.titre}
        </h2>
        {data.intro.paragraphes.map((p) => (
          <p key={p} className="mt-4 text-encre/80">
            {p}
          </p>
        ))}
        <CtaLink
          href={data.intro.cta.href}
          className="btn-bounce mt-8 inline-flex min-h-[44px] items-center rounded-pill bg-encre px-6 py-3 text-sm font-semibold text-white"
        >
          {data.intro.cta.label}
        </CtaLink>
        {data.intro.sousCta && (
          <p className="mt-3 text-sm italic text-encre/60">
            {data.intro.sousCta}
          </p>
        )}
      </section>
      {/* Texte à gauche, photo à droite */}
      <section className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-12">
        <div>
          <h2 className="font-display text-3xl italic text-encre sm:text-4xl">
            {data.pratique.titre}
          </h2>
          <p className="mt-4 text-encre/80">{data.pratique.texte}</p>
        </div>
        <img
          src={data.pratique.image}
          alt={data.pratique.imageAlt}
          loading="lazy"
          decoding="async"
          className="h-64 w-full rounded-2xl object-cover sm:h-80"
        />
      </section>

      {/* Déroulé d'une séance */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <h2 className="text-center font-display text-3xl italic text-encre sm:text-4xl">
          {data.deroule.titre}
        </h2>
        <ol className="mt-10 flex flex-col gap-6">
          {data.deroule.etapes.map((e, i) => (
            <li key={e.titre} className="flex gap-4">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-encre/30 bg-white text-sm font-semibold text-encre">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-encre">{e.titre}</p>
                <p className="mt-1 text-sm text-encre/70">{e.texte}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <CtaLink
            href={data.deroule.cta.href}
            className="btn-bounce inline-flex min-h-[44px] items-center rounded-pill bg-encre px-6 py-3 text-sm font-semibold text-white"
          >
            {data.deroule.cta.label}
          </CtaLink>
        </div>
      </section>

      {/* Les tarifs, au centre de la page */}
      <TarifsActivite type={data.tarifs} />

      {/* Bandeau photo pleine largeur */}
      <img
        src={data.bandeau.image}
        alt={data.bandeau.alt}
        loading="lazy"
        decoding="async"
        className="h-48 w-full object-cover sm:h-80"
      />

      {/* Onglets : pour qui, pourquoi, programme, infos pratiques */}
      <section
        id="infos"
        className="mx-auto max-w-4xl scroll-mt-8 px-4 py-16 sm:px-6"
      >
        <ActivityTabs data={data} />
      </section>
    </>
  );
}