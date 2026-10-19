"use client";

import { useCallback, useEffect, useRef } from "react";

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
      "Une relaxation guidée, allongé et sans effort, pour relâcher les tensions et se ressourcer en profondeur. Proposé uniquement en ligne.",
    image: "/images/yoga-n.png",
    cta: "En savoir plus",
    href: "/yoga/nidra",
    niveau: "Tous niveaux",
    duree: "En ligne",
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

// ---------------------------------------------------------------
// RÉGLAGES DU CARROUSEL
// ---------------------------------------------------------------
// Vitesse du défilement continu, en pixels par seconde.
const VITESSE_PC = 50;
const VITESSE_MOBILE = 35;
// Vitesse sur PC quand la souris est au-dessus du carrousel.
// 0 = arrêt complet. Mettre la même valeur que VITESSE_PC = pas de ralentissement.
const VITESSE_PC_SURVOL = 12;
// Temps d'attente (ms) avant que le défilement reparte après une action.
const REPRISE_PC = 2000;
const REPRISE_MOBILE = 3000;
// Durée (ms) du glissement d'une carte quand on clique sur une flèche.
const DUREE_FLECHE = 500;
// Nombre de copies de la liste (pour la boucle infinie). 3 suffit.
const COPIES = 3;
// true = pas de défilement automatique si l'appareil a l'option
// "réduire les animations" activée (recommandé pour l'accessibilité).
const RESPECTER_REDUCTION_ANIMATIONS = true;

export default function ActivityCards() {
  const pisteRef = useRef<HTMLDivElement>(null);
  const regionRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number | null>(null);
  const posRef = useRef(0); // position exacte (décimale) du défilement
  const drag = useRef({ actif: false, startX: 0, startScroll: 0, deplace: false });

  const etat = useRef({
    survol: false,
    touche: false,
    focus: false,
    visible: true,
    anim: false,
    tactile: false,
    vitesse: 0, // vitesse actuelle (px/s), qui évolue en douceur
    reprise: 0, // pas de défilement auto avant cet instant
    derniereEcriture: 0, // dernière position écrite par le code (pas par la personne)
    idle: undefined as number | undefined,
  });

  // Distance entre le début de deux cartes consécutives (largeur + espace)
  const pas = useCallback(() => {
    const piste = pisteRef.current;
    if (!piste || piste.children.length < 2) return 0;
    return (
      (piste.children[1] as HTMLElement).offsetLeft -
      (piste.children[0] as HTMLElement).offsetLeft
    );
  }, []);

  // Largeur d'une copie complète de la liste
  const longueurCopie = useCallback(
    () => pas() * activites.length,
    [pas]
  );

  // Remet la position dans la copie du milieu : invisible, car le contenu est identique
  const normaliser = useCallback(() => {
    const piste = pisteRef.current;
    if (!piste) return;
    const L = longueurCopie();
    if (!L) return;
    let x = piste.scrollLeft;
    while (x < L) x += L;
    while (x >= 2 * L) x -= L;
    if (Math.abs(x - piste.scrollLeft) > 0.5) piste.scrollLeft = x;
    posRef.current = x;
    etat.current.derniereEcriture = piste.scrollLeft;
  }, [longueurCopie]);

  // Arrête une animation de flèche en cours
  const interrompre = useCallback(() => {
    if (animRef.current) {
      cancelAnimationFrame(animRef.current);
      animRef.current = null;
    }
    const piste = pisteRef.current;
    if (etat.current.anim && piste) {
      posRef.current = piste.scrollLeft;
      etat.current.derniereEcriture = piste.scrollLeft;
    }
    etat.current.anim = false;
  }, []);

  const delaiReprise = () =>
    etat.current.tactile ? REPRISE_MOBILE : REPRISE_PC;

  // Glissement animé d'un certain nombre de pixels (flèches)
  const deplacer = useCallback(
    (delta: number) => {
      const piste = pisteRef.current;
      if (!piste) return;
      const s = etat.current;
      interrompre();
      normaliser();
      s.reprise = Date.now() + delaiReprise();

      const debut = piste.scrollLeft;
      const reduit = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (reduit) {
        piste.scrollLeft = debut + delta;
        posRef.current = piste.scrollLeft;
        s.derniereEcriture = piste.scrollLeft;
        normaliser();
        return;
      }

      s.anim = true;
      const t0 = performance.now();
      const etape = (t: number) => {
        const p = Math.min(1, (t - t0) / DUREE_FLECHE);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        piste.scrollLeft = debut + delta * e;
        if (p < 1) {
          animRef.current = requestAnimationFrame(etape);
        } else {
          animRef.current = null;
          s.anim = false;
          posRef.current = piste.scrollLeft;
          s.derniereEcriture = piste.scrollLeft;
          normaliser();
        }
      };
      animRef.current = requestAnimationFrame(etape);
    },
    [interrompre, normaliser]
  );

  // Fin d'un glisser à la souris (écoutée sur toute la fenêtre pour ne jamais rester bloqué)
  const finirGlisser = useCallback(
    (e: PointerEvent) => {
      const piste = pisteRef.current;
      if (!drag.current.actif || !piste) return;
      drag.current.actif = false;
      if (piste.hasPointerCapture(e.pointerId)) {
        piste.releasePointerCapture(e.pointerId);
      }
      etat.current.reprise = Date.now() + REPRISE_PC;
      if (drag.current.deplace) normaliser();
    },
    [normaliser]
  );

  // ---------------------------------------------------------------
  // Défilement continu et infini
  // ---------------------------------------------------------------
  useEffect(() => {
    const piste = pisteRef.current;
    if (!piste) return;
    const s = etat.current;

    const reduit =
      RESPECTER_REDUCTION_ANIMATIONS &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const requeteTactile = window.matchMedia("(pointer: coarse)");
    s.tactile = requeteTactile.matches;

    // Position de départ : début de la copie du milieu
    let largeur = piste.clientWidth;
    const initialiser = () => {
      const L = longueurCopie();
      if (!L) return;
      piste.scrollLeft = L;
      posRef.current = L;
      s.derniereEcriture = piste.scrollLeft;
    };
    initialiser();

    // On ne réinitialise que si la largeur change (pas quand la barre d'adresse
    // du téléphone se masque, ce qui déclenche aussi un "resize")
    const surResize = () => {
      s.tactile = requeteTactile.matches;
      if (piste.clientWidth !== largeur) {
        largeur = piste.clientWidth;
        initialiser();
      }
    };
    window.addEventListener("resize", surResize);
    window.addEventListener("pointerup", finirGlisser);
    window.addEventListener("pointercancel", finirGlisser);

    // Pause quand le carrousel n'est plus à l'écran
    let observer: IntersectionObserver | undefined;
    if (regionRef.current && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entree]) => {
          s.visible = entree.isIntersecting;
        },
        { threshold: 0.1 }
      );
      observer.observe(regionRef.current);
    }

    // Boucle d'animation
    let raf = 0;
    let dernier = performance.now();
    const boucle = (t: number) => {
      const dt = Math.min(0.05, (t - dernier) / 1000);
      dernier = t;

      const pause =
        reduit ||
        document.hidden ||
        !s.visible ||
        s.touche ||
        s.focus ||
        drag.current.actif ||
        s.anim ||
        Date.now() < s.reprise;

      if (pause) {
        s.vitesse = 0; // on repartira en douceur
      } else {
        const base = s.tactile ? VITESSE_MOBILE : VITESSE_PC;
        const cible = !s.tactile && s.survol ? VITESSE_PC_SURVOL : base;
        // la vitesse rejoint la vitesse voulue progressivement
        s.vitesse += (cible - s.vitesse) * Math.min(1, dt * 6);

        const L = longueurCopie();
        if (L && s.vitesse > 0.3) {
          let x = posRef.current + s.vitesse * dt;
          if (x >= 2 * L) x -= L; // boucle infinie, sans saut visible
          posRef.current = x;
          piste.scrollLeft = x;
          s.derniereEcriture = piste.scrollLeft;
        }
      }
      raf = requestAnimationFrame(boucle);
    };
    raf = requestAnimationFrame(boucle);

    return () => {
      window.removeEventListener("resize", surResize);
      window.removeEventListener("pointerup", finirGlisser);
      window.removeEventListener("pointercancel", finirGlisser);
      observer?.disconnect();
      cancelAnimationFrame(raf);
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (s.idle) window.clearTimeout(s.idle);
    };
  }, [longueurCopie, finirGlisser]);

  // Défilement fait par la personne (doigt, inertie, trackpad, glisser)
  function surScroll() {
    const piste = pisteRef.current;
    const s = etat.current;
    if (!piste || s.anim) return;

    if (Math.abs(piste.scrollLeft - s.derniereEcriture) > 1.5) {
      posRef.current = piste.scrollLeft;
      s.reprise = Date.now() + delaiReprise();

      // Quand le défilement s'arrête, on recentre la position (invisible)
      if (s.idle) window.clearTimeout(s.idle);
      s.idle = window.setTimeout(() => {
        if (!s.touche && !drag.current.actif && !s.anim) normaliser();
      }, 150);
    }
  }

  // ---------------------------------------------------------------
  // Souris : glisser pour faire défiler (le tactile utilise le natif)
  // ---------------------------------------------------------------
  function surPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse" || e.button !== 0 || !pisteRef.current) return;
    interrompre();
    drag.current = {
      actif: true,
      startX: e.clientX,
      startScroll: pisteRef.current.scrollLeft,
      deplace: false,
    };
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

  // Après un glisser à la souris, on n'ouvre pas le lien sous le curseur
  function surClicCapture(e: React.MouseEvent<HTMLDivElement>) {
    if (drag.current.deplace) {
      e.preventDefault();
      e.stopPropagation();
      drag.current.deplace = false;
    }
  }

  // Liste répétée pour la boucle infinie
  const cartes = Array.from({ length: COPIES }).flatMap((_, copie) =>
    activites.map((a) => ({ a, copie }))
  );

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
        ref={regionRef}
        className="relative"
        role="region"
        aria-roledescription="carrousel"
        aria-label="Activités"
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") etat.current.survol = true;
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") {
            etat.current.survol = false;
            etat.current.reprise = Date.now() + REPRISE_PC;
          }
        }}
        onFocus={(e) => {
          // Seul le focus au clavier met en pause (pas un simple clic de souris)
          if ((e.target as HTMLElement).matches(":focus-visible")) {
            etat.current.focus = true;
          }
        }}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
            etat.current.focus = false;
            etat.current.reprise = Date.now() + delaiReprise();
          }
        }}
      >
        {/* Flèches : PC et tablette */}
        <button
          type="button"
          onClick={() => deplacer(-pas())}
          aria-label="Activités précédentes"
          className="absolute left-0 top-1/2 z-20 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-encre shadow-lg ring-1 ring-black/5 hover:bg-[#F5F3E7] sm:flex"
        >
          <Chevron sens="gauche" />
        </button>
        <button
          type="button"
          onClick={() => deplacer(pas())}
          aria-label="Activités suivantes"
          className="absolute right-0 top-1/2 z-20 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-white text-encre shadow-lg ring-1 ring-black/5 hover:bg-[#F5F3E7] sm:flex"
        >
          <Chevron sens="droite" />
        </button>

        {/* Piste de défilement */}
        <div
          ref={pisteRef}
          onScroll={surScroll}
          onTouchStart={() => {
            interrompre();
            etat.current.touche = true;
          }}
          onTouchEnd={() => {
            etat.current.touche = false;
            etat.current.reprise = Date.now() + REPRISE_MOBILE;
          }}
          onTouchCancel={() => {
            etat.current.touche = false;
            etat.current.reprise = Date.now() + REPRISE_MOBILE;
          }}
          onWheel={interrompre}
          onPointerDown={surPointerDown}
          onPointerMove={surPointerMove}
          onClickCapture={surClicCapture}
          onDragStart={(e) => e.preventDefault()}
          className="-mx-2 -my-4 flex gap-6 overflow-x-auto overscroll-x-contain px-2 py-4 select-none [scrollbar-width:none] sm:cursor-grab sm:active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        >
          {cartes.map(({ a, copie }) => (
            <article
              key={`${copie}-${a.titre}`}
              aria-hidden={copie > 0 ? true : undefined}
              className="card-bounce relative flex min-h-[440px] shrink-0 basis-[82%] flex-col justify-between overflow-hidden rounded-2xl text-left shadow-sm sm:basis-[calc((100%_-_24px)/2)] lg:basis-[calc((100%_-_72px)/4)]"
            >
              <img
                src={a.image}
                alt={copie > 0 ? "" : a.titre}
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
                  tabIndex={copie > 0 ? -1 : undefined}
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
      strokeWidth="1"
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