"use client";

import { useState } from "react";

type Formule = "annuelle" | "mensuelle";

const formules: Record<
  Formule,
  {
    libelle: string;
    prix: string;
    detail: string;
    economie: string | null;
    href: string;
  }
> = {
  annuelle: {
    libelle: "Annuel",
    prix: "17",
    detail: "204 € par an, facturé annuellement",
    economie: "Vous économisez 36 € par an",
    href: "/mon-espace?formule=annuelle",
  },
  mensuelle: {
    libelle: "Mensuel",
    prix: "20",
    detail: "240 € par an, facturé mensuellement",
    economie: null,
    href: "/mon-espace?formule=mensuelle",
  },
};

const avantages = [
  "Des cours de Kundalini et de Tantra Yoga en direct",
  "Les replays, pour pratiquer quand vous voulez",
  "Des relaxations audio guidées, à écouter le soir pour préparer le sommeil",
  "Un espace à vous : pratiquez où que vous soyez, à votre rythme",
];

export default function PricingSection() {
  const [formule, setFormule] = useState<Formule>("annuelle");
  const f = formules[formule];

  return (
    <section
      id="abonnement"
      className="mx-auto max-w-5xl scroll-mt-20 px-4 py-16 sm:px-6"
    >
      <h2 className="mb-2 text-center font-display text-3xl italic text-encre sm:text-4xl">
        Essayez gratuitement pendant 7 jours
      </h2>
      <p className="mx-auto mb-10 max-w-xl text-center text-sm text-encre/70">
        Cours en direct, replays et relaxations audio : tout votre espace de
        pratique en ligne, à portée de main.
      </p>

      <div className="grid overflow-hidden rounded-3xl shadow-lg ring-1 ring-black/5 md:grid-cols-2">
        {/* Colonne gauche : ce que vous gagnez */}
        <div className="bg-[#2B1F19] p-8 text-[#F5F3E7] sm:p-10">
          <span className="inline-block rounded-pill bg-[#75523F] px-3 py-1 text-xs font-semibold text-white">
            7 jours offerts
          </span>
          <h3 className="mt-4 font-display text-3xl italic">
            Ce que vous gagnez
          </h3>

          <ul className="mt-6 flex flex-col gap-4">
            {avantages.map((a) => (
              <li key={a} className="flex items-start gap-3 text-[15px]">
                <CheckIcon />
                <span className="text-[#F5F3E7]/90">{a}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne droite : formule et prix */}
        <div className="flex flex-col items-center justify-center bg-white p-8 text-center sm:p-10">
          <div
            role="radiogroup"
            aria-label="Choisir la formule"
            className="inline-flex rounded-pill bg-[#F5F3E7] p-1"
          >
            {(Object.keys(formules) as Formule[]).map((cle) => {
              const actif = formule === cle;
              return (
                <button
                  key={cle}
                  type="button"
                  role="radio"
                  aria-checked={actif}
                  onClick={() => setFormule(cle)}
                  className={`min-h-[40px] rounded-pill px-5 py-2 text-sm font-semibold transition-colors ${
                    actif
                      ? "bg-[#75523F] text-white"
                      : "text-encre/70 hover:text-encre"
                  }`}
                >
                  {formules[cle].libelle}
                  {cle === "annuelle" && (
                    <span className="ml-1.5 text-xs font-medium opacity-90">
                      −15&nbsp;%
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-8" aria-live="polite">
            <p>
              <span className="font-display text-6xl italic text-encre">
                {f.prix}&nbsp;€
              </span>
              <span className="ml-1 text-encre/70">/mois</span>
            </p>
            <p className="mt-2 text-sm text-encre/70">{f.detail}</p>
            <p className="mt-2 h-6 text-sm font-semibold text-[#75523F]">
              {f.economie}
            </p>
          </div>

          <a
            href={f.href}
            className="btn-bounce mt-6 inline-flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-6 py-3 text-sm font-semibold text-white hover:bg-[#75523F] sm:w-auto sm:min-w-[260px]"
          >
            Essayer 7 jours gratuits
          </a>
          <p className="mt-3 text-xs text-encre/60">7 jours d&rsquo;essai gratuit</p>
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 flex-none"
    >
      <circle cx="12" cy="12" r="11" fill="#75523F" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="#F5F3E7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}