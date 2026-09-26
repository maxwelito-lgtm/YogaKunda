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
      <h2 className="mb-2 text-center font-display text-3xl italic text-violet-dark sm:text-4xl">
        Explorez selon votre besoin
      </h2>
      <p className="mb-8 text-center text-sm text-encre/70">
        Une pratique adaptée à ce que vous traversez.
      </p>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {focusItems.map((item) => (
          <button
            key={item.titre}
            onClick={() => setSelected(item)}
            className="flex flex-col items-center gap-3 rounded-2xl border border-violet-light bg-violet-light/20 p-6 text-center transition hover:bg-violet-light/40"
          >
            <FocusIcon type={item.icone} />
            <span className="text-sm font-semibold text-encre">
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

function FocusIcon({ type }: { type: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "#ffffff",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  const icons: Record<string, JSX.Element> = {
    stress: (
      <svg {...common} aria-hidden="true">
        <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    sommeil: (
      <svg {...common} aria-hidden="true">
        <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
      </svg>
    ),
    energie: (
      <svg {...common} aria-hidden="true">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" />
      </svg>
    ),
    decouverte: (
      <svg {...common} aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4l3 2" />
      </svg>
    ),
  };

  return (
    <span className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-dark">
      {icons[type]}
    </span>
  );
}