"use client";

import { useEffect } from "react";

// Affichée si une page plante pendant son chargement (au lieu d'un écran blanc).
export default function Erreur({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      style={{ backgroundColor: "#F5F3E7" }}
      className="flex min-h-screen flex-col items-center justify-center px-4 text-center"
    >
      <h1 className="font-display text-3xl italic text-[#2B1F19] sm:text-4xl">
        Un petit souci de notre côté
      </h1>
      <p className="mt-3 max-w-md text-[16px] leading-relaxed text-[#2B1F19]/75">
        La page n&rsquo;a pas pu s&rsquo;afficher. Vous pouvez réessayer, ou revenir à l&rsquo;accueil.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-[#75523F] px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F]/90"
        >
          Réessayer
        </button>
        <a
          href="/"
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-[#2B1F19]/30 px-7 py-3 text-sm font-semibold text-[#2B1F19] hover:bg-white"
        >
          Retour à l&rsquo;accueil
        </a>
      </div>
    </main>
  );
}
