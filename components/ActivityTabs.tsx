"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { ActivityPageData } from "@/data/activity-pages";

const onglets = ["Pour qui ?", "Pourquoi ?", "Programme", "Infos pratiques"];

export default function ActivityTabs({ data }: { data: ActivityPageData }) {
  const [actif, setActif] = useState(0);

  // Tout lien vers #infos (hero, présentation, déroulé) ouvre l'onglet "Infos pratiques",
  // même si l'adresse contient déjà #infos.
  useEffect(() => {
    const ouvrirInfos = () => setActif(3);
    const verifierHash = () => {
      if (window.location.hash === "#infos") ouvrirInfos();
    };
    const surClic = (e: MouseEvent) => {
      const cible = e.target as HTMLElement | null;
      if (cible?.closest('a[href="#infos"]')) ouvrirInfos();
    };

    verifierHash();
    window.addEventListener("hashchange", verifierHash);
    document.addEventListener("click", surClic);
    return () => {
      window.removeEventListener("hashchange", verifierHash);
      document.removeEventListener("click", surClic);
    };
  }, []);

  return (
    <div>
      <div
        role="tablist"
        aria-label="Informations sur l'activité"
        className="flex flex-wrap justify-center gap-2"
      >
        {onglets.map((label, i) => (
          <button
            key={label}
            role="tab"
            id={`onglet-${i}`}
            aria-selected={actif === i}
            aria-controls={`panneau-${i}`}
            onClick={() => setActif(i)}
            className={`min-h-[44px] rounded-pill border px-5 py-2 text-sm font-semibold transition-colors ${
              actif === i
                ? "border-encre bg-encre text-white"
                : "border-encre/20 bg-white text-encre hover:border-encre/50"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div
        role="tabpanel"
        id={`panneau-${actif}`}
        aria-labelledby={`onglet-${actif}`}
        className="mt-8"
      >
        {actif === 0 && (
          <p className="mx-auto max-w-2xl text-center text-encre/80">
            {data.pourQui}
          </p>
        )}

        {actif === 1 && (
          <div className="mx-auto max-w-2xl">
            <p className="text-center text-encre/80">{data.pourquoi.intro}</p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {data.pourquoi.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-encre/80">
                  <CheckIcon />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {actif === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            {data.programme.map((t) => (
              <div
                key={t.titre}
                className="rounded-2xl bg-white p-5 shadow-sm"
              >
                <h3 className="text-lg">{t.titre}</h3>
                <p className="mt-2 text-sm text-encre/70">{t.texte}</p>
              </div>
            ))}
          </div>
        )}

        {actif === 3 && (
          <div>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.infos.formats.map((f) => (
                <div
                  key={f.titre}
                  className="flex flex-col rounded-2xl bg-white p-6 shadow-sm"
                >
                  <h3 className="text-xl">{f.titre}</h3>
                  <p className="mt-2 flex-1 text-sm text-encre/70">{f.texte}</p>
                  <p className="mt-4 text-sm text-encre/70">
                    Durée : {f.duree}
                    <br />
                    Tarif : {f.tarif}
                  </p>
                  <Link
                    href={f.cta.href}
                    className="btn-bounce mt-5 inline-flex min-h-[44px] w-fit items-center rounded-pill bg-encre px-6 py-3 text-sm font-semibold text-white"
                  >
                    {f.cta.label}
                  </Link>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-encre/70">
              Lieu : {data.infos.lieu} · Contact : {data.infos.contact}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 flex-none text-sauge"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}