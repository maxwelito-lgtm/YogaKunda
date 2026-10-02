"use client";

import { useState } from "react";
import type { JSX } from "react";

type Practice = {
  titre: string;
  texte: string;
};

type FocusItem = {
  titre: string;
  souscription: string;
  icone: string;
  pratiques: Practice[];
  cta: string;
  href: string;
};

const focusItems: FocusItem[] = [
  {
    titre: "Stress & anxiété",
    souscription: "Quand le mental a besoin de redescendre.",
    icone: "stress",
    pratiques: [
      {
        titre: "Thérapie Holistique",
        texte:
          "Un accompagnement personnel qui prend en compte toutes les dimensions de l'être pour apaiser le mental.",
      },
      {
        titre: "Tantra Yoga",
        texte:
          "Cultive le lâcher-prise et pacifie le mental pour un apaisement émotionnel profond.",
      },
    ],
    cta: "Essayer 7 jours gratuits",
    href: "#activites",
  },
  {
    titre: "Sommeil",
    souscription: "Pour un repos plus profond et régénérant.",
    icone: "sommeil",
    pratiques: [
      {
        titre: "Cours en ligne & relaxations audio",
        texte:
          "Relaxations audio guidées, à écouter le soir pour préparer un sommeil réparateur.",
      },
    ],
    cta: "Essayer 7 jours gratuits",
    href: "/mon-espace",
  },
  {
    titre: "Énergie & vitalité",
    souscription: "Pour réveiller et faire circuler l'énergie.",
    icone: "energie",
    pratiques: [
      {
        titre: "Kundalini Yoga",
        texte:
          "Le yoga de l'éveil de l'énergie créatrice, pour révéler son plein potentiel.",
      },
    ],
    cta: "Essayer 7 jours gratuits",
    href: "#activites",
  },
  {
    titre: "Découverte / débutant",
    souscription: "Pour poser un premier pas, en douceur.",
    icone: "decouverte",
    pratiques: [
      {
        titre: "Tantra Yoga — Niveau 1",
        texte:
          "Le yoga holistique par excellence, accessible dès le premier cours, sans prérequis.",
      },
    ],
    cta: "Essayer 7 jours gratuits",
    href: "#activites",
  },
];

export default function FocusSection() {
  const [selected, setSelected] = useState<FocusItem | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <h2 className="mb-2 text-center font-display text-3xl italic text-encre sm:text-4xl">
        Explorez selon votre besoin
      </h2>
      <p className="mb-8 text-center text-sm text-encre/70">
        Une pratique adaptée à ce que vous traversez.
      </p>

      <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
        {focusItems.map((item) => (
          <button
            key={item.titre}
            onClick={() => setSelected(item)}
            className="group flex flex-col items-center gap-3 text-center"
          >
            <FocusPhotoTile type={item.icone} />
            <span className="text-sm font-semibold text-encre transition-colors group-hover:text-violet-dark">
              {item.titre}
            </span>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-encre/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              aria-label="Fermer"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-encre/20"
            >
              ✕
            </button>

            <FocusIcon type={selected.icone} />
            <h3 className="mt-4 font-display text-3xl italic text-violet-dark">
              {selected.titre}
            </h3>
            <p className="mt-1 text-sm text-encre/70">
              {selected.souscription}
            </p>

            <div className="mt-6 flex flex-col gap-5">
              {selected.pratiques.map((p) => (
                <div key={p.titre} className="flex gap-3">
                  <span className="mt-1 flex h-9 w-9 flex-none items-center justify-center rounded-full bg-violet-light">
                    <LotusIcon />
                  </span>
                  <div>
                    <p className="font-semibold text-encre">{p.titre}</p>
                    <p className="text-sm text-encre/70">{p.texte}</p>
                  </div>
                </div>
              ))}
            </div>

            <a href={selected.href} className="mt-8 flex min-h-[44px] w-full items-center justify-center rounded-pill bg-encre px-6 py-3 text-sm font-semibold text-white">
              {selected.cta}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}

function LotusIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="#6B46C1" aria-hidden="true">
      <path d="M12 2c1 3 1 6 0 9-1-3-1-6 0-9Zm-6 4c2 2 3.5 4.5 4 7-2.5-1-4.5-3-5-6 0 0 .5-.5 1-1Zm12 0c.5.5 1 1 1 1-.5 3-2.5 5-5 6 .5-2.5 2-5 4-7ZM4 12c2.5.5 4.5 2 6 4-2.5 0-4.5-1-6-2 0 0 0-1 0-2Zm16 0c0 1 0 2 0 2-1.5 1-3.5 2-6 2 1.5-2 3.5-3.5 6-4Zm-8 3c1.5 1.5 2.5 3.5 2 6-1.5-1-3-3-3-5 0 0 .5-.5 1-1Z" />
    </svg>
  );
}

// Fond pastel + couleur d'accent par catégorie
const iconStyles: Record<string, { bg: string; color: string }> = {
  stress: { bg: "#FAECE7", color: "#993C1D" },
  sommeil: { bg: "#EEEDFE", color: "#534AB7" },
  energie: { bg: "#FAEEDA", color: "#854F0B" },
  decouverte: { bg: "#E1F5EE", color: "#0F6E56" },
};

// Photo de fond par catégorie (placeholders — à remplacer par tes propres images)
const bgImages: Record<string, string> = {
  stress: "https://picsum.photos/seed/focus-stress/400/400",
  sommeil: "https://picsum.photos/seed/focus-sommeil/400/400",
  energie: "https://picsum.photos/seed/focus-energie/400/400",
  decouverte: "https://picsum.photos/seed/focus-decouverte/400/400",
};

function focusContent(color: string): Record<string, JSX.Element> {
  return {
    stress: (
      <span style={{ fontSize: 34, color, lineHeight: 1 }} aria-hidden="true">
        ॐ
      </span>
    ),
    sommeil: (
      <svg
        width={36}
        height={36}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 21c-4.5-1-7.5-4.2-7.5-8 3.2 1 5.3 3 7.5 6.2C14.2 15.8 16.3 13.8 19.5 13c0 3.8-3 7-7.5 8z" />
        <path d="M12 14c-2-3-2-7.5 0-11 2 3.5 2 8 0 11z" />
      </svg>
    ),
    energie: (
      <svg width={48} height={48} viewBox="0 0 24 24" aria-hidden="true">
        <path d="M13.2 5.1c1.9 1 3.3 2.9 3.4 5.4" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" />
        <path d="M16.6 10.5c.1 2.4-1.7 4.4-4.3 5.1" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" />
        <path d="M12.3 15.6c-1.9.5-3.6-.4-4-2.1-.3-1.3.5-2.5 1.8-2.7" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" />
        <path d="M10.1 10.8c.6.1 1 .5.9 1" fill="none" stroke={color} strokeWidth={1} strokeLinecap="round" />
        <path d="M12.8 3.4 15 4.6c.5.3.5.9 0 1.1l-2.3 1c-.5.2-1-.2-1-.7l.1-2c0-.5.5-.9 1-.6Z" fill={color} />
        <path d="M14.7 4.1l1.6-.5M14.7 4.1l1.3-1.1" stroke={color} strokeWidth={0.9} strokeLinecap="round" />
        <circle cx={6.1} cy={7} r={0.5} fill="#BA7517" />
        <circle cx={19} cy={9} r={0.4} fill="#BA7517" />
        <path d="M18 15.8a1.6 1.6 0 1 1 0-2.9 2 2 0 1 0 0 2.9z" fill="#BA7517" />
      </svg>
    ),
    decouverte: (
      <span style={{ fontSize: 34, color, lineHeight: 1 }} aria-hidden="true">
        अ
      </span>
    ),
  };
}

// Version "tuile photo" utilisée dans la grille cliquable
function FocusPhotoTile({ type }: { type: string }) {
  const { bg, color } = iconStyles[type];
  const content = focusContent(color);

  return (
    <span className="relative block h-28 w-28 overflow-hidden rounded-3xl shadow-md ring-1 ring-black/5 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl sm:h-32 sm:w-32">
      <img
        src={bgImages[type]}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-[2px] brightness-75 transition-transform duration-500 group-hover:scale-125"
      />
      <span
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${color}55, rgba(0,0,0,0.35))`,
        }}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-md sm:h-[72px] sm:w-[72px]"
          style={{ backgroundColor: `${bg}dd` }}
        >
          {content[type]}
        </span>
      </span>
    </span>
  );
}

// Version simple (sans photo) utilisée dans l'en-tête de la modale
function FocusIcon({ type }: { type: string }) {
  const { bg, color } = iconStyles[type];
  const content = focusContent(color);

  return (
    <span
      className="flex h-24 w-24 items-center justify-center rounded-2xl"
      style={{ backgroundColor: bg, border: "2px solid rgba(0,0,0,0.8)" }}
    >
      {content[type]}
    </span>
  );
}