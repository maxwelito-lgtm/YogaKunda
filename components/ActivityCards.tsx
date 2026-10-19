"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Activity = {
  titre: string;
  sousTitre: string;
  texte: string;
  image: string;
  cta: string;
  href: string;
  niveau?: string;
  duree?: string;
  badge?: string;
};

const activites: Activity[] = [
  {
    titre: "Ateliers Tantra & Kundalini",
    sousTitre: "Prendre le temps d'approfondir",
    texte:
      "Des ateliers de 2 à 3 heures pour explorer davantage le Tantra Yoga et le Kundalini Yoga, ressentir plus profondément et enrichir votre pratique.",
    image: "/images/tantra.png",
    cta: "En savoir plus",
    href: "/yoga/tantra",
    niveau: "Niveau 1",
    duree: "2h à 3h",
  },
  {
    titre: "Cours de Kundalini Yoga",
    sousTitre: "Le Yoga pour l'éveil de l'énergie créatrice",
    texte:
      "Au-delà de l'équilibre entre le corps et l'esprit, ce yoga est une véritable science pour révéler son plein potentiel.",
    image: "/images/kundalini.png",
    cta: "En savoir plus",
    href: "/yoga/kundalini",
    niveau: "Niveau 2",
    duree: "60 min",
  },
  {
    titre: "Yoga Nidra",
    sousTitre: "Le repos profond, guidé",
    texte:
      "Une relaxation guidée, allongé et sans effort, pour relâcher les tensions et se ressourcer en profondeur.",
    image: "https://picsum.photos/seed/nidra-card/500/700",
    cta: "En savoir plus",
    href: "/yoga/nidra",
    niveau: "Tous niveaux",
  },
  {
    titre: "Thérapie Holistique",
    sousTitre: "Un accompagnement adapté à vous",
    texte:
      "Une thérapie qui prend en compte toutes les dimensions de l'être — physique, psychique et émotionnelle.",
    image: "/images/therapie.jpeg",
    cta: "En savoir plus",
    href: "/therapie-holistique",
    niveau: "Tous niveaux",
    duree: "60 min",
  },
  {
    titre: "Cours en ligne & relaxations audio",
    sousTitre: "Une façon de pratiquer en toute flexibilité",
    texte:
      "Retrouvez les cours de Kundalini Yoga et de Tantra Yoga en direct et/ou en replay, ainsi que les relaxations audio guidées.",
    image: "https://picsum.photos/seed/enligne/500/700",
    cta: "Contenus en ligne",
    href: "/mon-espace",
    niveau: "A votre rythme",
    duree: "30 min",
    badge: "Nouveau !",
  },
];

// Durée du défilement des flèches (PC / tablette), en millisecondes.
// Plus la valeur est grande, plus c'est lent. 450 = fluide sans être mou.
const DUREE_ANIMATION = 450;

export default function ActivityCards() {
  const pisteRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const drag = useRef({ actif: false, startX: 0, startScroll: 0, deplace: false });

  const [index, setIndex] = useState(0);
  const [peutReculer, setPeutReculer] = useState(false);
  const [peutAvancer, setPeutAvancer] = useState(true);

  // Distance entre le début de deux cartes consécutives (largeur + espace)
  const pas = useCallback(() => {
    const piste = pisteRef.current;
    if (!piste) return 0;
    const cartes = piste.children;
    if (cartes.length < 2) return piste.clientWidth;
    return (
      (cartes[1] as HTMLElement).offsetLeft -
      (cartes[0] as HTMLElement).offsetLeft
    );
  }, []);

  // Met à jour flèches et petits points selon la position
  const maj = useCallback(() => {
    const piste = pisteRef.current;
    if (!piste) return;
    const p = pas() || 1;
    const max = piste.scrollWidth - piste.clientWidth;
    const finDeCourse = piste.scrollLeft >= max - 4;
    setPeutReculer(piste.scrollLeft > 4);
    setPeutAvancer(!finDeCourse);
    setIndex(
      finDeCourse
        ? activites.length - 1
        : Math.min(
            activites.length - 1,
            Math.max(0, Math.round(piste.scrollLeft / p))
          )
    );
  }, [pas]);

  useEffect(() => {
    maj();
    window.addEventListener("resize", maj);
    return () => {
      window.removeEventListener("resize", maj);
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [maj]);

  // Arrête une animation en cours et réactive l'aimantation des cartes
  const interrompre = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    if (pisteRef.current) pisteRef.current.style.scrollSnapType = "";
  }, []);

  // Défilement animé et fluide vers une position
  const animerVers = useCallback((cible: number) => {
    const piste = pisteRef.current;
    if (!piste) return;
    if (animRef.current) cancelAnimationFrame(animRef.current);

    const max = piste.scrollWidth - piste.clientWidth;
    const arrivee = Math.max(0, Math.min(max, cible));
    const debut = piste.scrollLeft;
    const delta = arrivee - debut;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (Math.abs(delta) < 1 || reduit) {
      piste.scrollLeft = arrivee;
      piste.style.scrollSnapType = "";
      return;
    }

    piste.style.scrollSnapType = "none";
    const t0 = performance.now();
    const etape = (t: number) => {
      const p = Math.min(1, (t - t0) / DUREE_ANIMATION);
      const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
      piste.scrollLeft = debut + delta * e;
      if (p < 1) {
        animRef.current = requestAnimationFrame(etape);
      } else {
        animRef.current = null;
        piste.style.scrollSnapType = "";
      }
    };
    animRef.current = requestAnimationFrame(etape);
  }, []);

  function aller(sens: 1 | -1) {
    const piste = pisteRef.current;
    if (!piste) return;
    const p = pas() || piste.clientWidth;
    const courant = Math.round(piste.scrollLeft / p);
    animerVers((courant + sens) * p);
  }

  // Glisser à la souris (PC) : le tactile utilise le défilement natif
  function surPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0 || !pisteRef.current) return;
    interrompre();
    drag.current = {
      actif: true,
      startX: e.clientX,
      startScroll: pisteRef.current.scrollLeft,
      deplace: false,
    };
    pisteRef.current.style.scrollSnapType = "none";
  }

  function surPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const piste = pisteRef.current;
    if (!drag.current.actif || !piste) return;
    const dx = e.clientX - drag.current.startX;
    if (!drag.current.deplace && Math.abs(dx) > 5) {
      drag.current.deplace = true;
      piste.setPointerCapture(e.pointerId);
    }
    if (drag.current.deplace) {
      piste.scrollLeft = drag.current.startScroll - dx;
    }
  }

  function surPointerFin(e: React.PointerEvent<HTMLDivElement>) {
    const piste = pisteRef.current;
    if (!drag.current.actif || !piste) return;
    drag.current.actif = false;
    if (piste.hasPointerCapture(e.pointerId)) {
      piste.releasePointerCapture(e.pointerId);
    }
    if (drag.current.deplace) {
      const p = pas() || 1;
      animerVers(Math.round(piste.scrollLeft / p) * p);
    } else {
      piste.style.scrollSnapType = "";
    }
  }

  // Après un glisser à la souris, on n'ouvre pas le lien sous le curseur
  function surClicCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.deplace) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.deplace = false;
    }
  }

  return (
    <section
      id="activites"
      className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16"
    >
      <h2 className="mb-3 text-center font-display italic text-4xl text-encre">
        Activités
      </h2>
      <p className="mb-10 text-center font-display italic text-dark">
        Explorez votre bien être au travers de nos activités
      </p>

      <div
        className="relative"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Activités"
      >
        {/* Flèches : PC et tablette */}
        <button
          type="button"
          onClick={() => aller(-1)}
          aria-label="Activités précédentes"
          className={`absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-encre shadow-lg ring-1 ring-black/5 transition-opacity hover:bg-[#F5F3E7] sm:flex ${
            peutReculer ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Chevron sens="gauche" />
        </button>
        <button
          type="button"
          onClick={() => aller(1)}
          aria-label="Activités suivantes"
          className={`absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-encre shadow-lg ring-1 ring-black/5 transition-opacity hover:bg-[#F5F3E7] sm:flex ${
            peutAvancer ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Chevron sens="droite" />
        </button>

        {/* Piste de défilement */}
        <div
          ref={pisteRef}
          onScroll={maj}
          onTouchStart={interrompre}
          onWheel={interrompre}
          onPointerDown={surPointerDown}
          onPointerMove={surPointerMove}
          onPointerUp={surPointerFin}
          onPointerCancel={surPointerFin}
          onClickCapture={surClicCapture}
          onDragStart={(e) => e.preventDefault()}
          className="-mx-2 -my-4 flex snap-x snap-mandatory scroll-pl-2 gap-6 overflow-x-auto overscroll-x-contain px-2 py-4 select-none [scrollbar-width:none] sm:cursor-grab sm:active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          {activites.map((a) => (
            <article
              key={a.titre}
              className="card-bounce relative flex min-h-[440px] shrink-0 basis-[82%] snap-start flex-col justify-between overflow-hidden rounded-2xl text-left shadow-sm sm:basis-[calc((100%_-_24px)/2)] lg:basis-[calc((100%_-_72px)/4)]"
            >
              <img
                src={a.image}
                alt={a.titre}
                draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

              {a.badge && (
                <span className="absolute top-4 left-4 z-10 w-fit rounded-pill bg-violet px-3 py-1 text-xs font-semibold text-white">
                  {a.badge}
                </span>
              )}

              <div className="relative z-10 p-5 pt-14">
                <h3 className="text-xl text-white drop-shadow-md">{a.titre}</h3>
                <p className="mt-1 font-display italic text-sm text-white/85 drop-shadow-md">
                  {a.sousTitre}
                </p>
              </div>

              <div className="relative z-10 flex flex-col gap-4 p-5 pt-0">
                <p className="text-sm text-white/90 drop-shadow-md">{a.texte}</p>

                <a
                  href={a.href}
                  draggable={false}
                  className="btn-bounce w-fit min-h-[44px] rounded-pill bg-white px-5 py-2.5 text-sm font-semibold text-encre"
                >
                  {a.cta}
                </a>

                {(a.niveau || a.duree) && (
                  <div className="flex gap-2">
                    {a.niveau && (
                      <span className="flex items-center gap-1 rounded-pill bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        <LevelIcon />
                        {a.niveau}
                      </span>
                    )}
                    {a.duree && (
                      <span className="flex items-center rounded-pill bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                        {a.duree}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Petits points : smartphone */}
      <div className="mt-6 flex items-center justify-center gap-2 sm:hidden">
        {activites.map((a, i) => (
          <button
            key={a.titre}
            type="button"
            onClick={() => animerVers(i * pas())}
            aria-label={`Aller à : ${a.titre}`}
            aria-current={i === index}
            className={`h-2.5 rounded-full transition-all ${
              i === index ? "w-6 bg-[#75523F]" : "w-2.5 bg-encre/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

function Chevron({ sens }: { sens: "gauche" | "droite" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={sens === "gauche" ? "m15 5-7 7 7 7" : "m9 5 7 7-7 7"} />
    </svg>
  );
}

function LevelIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="14" width="4" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="9" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor" />
    </svg>
  );
}