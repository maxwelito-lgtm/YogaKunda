import Link from "next/link";
import { site } from "@/site.config";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative aspect-[3/4] w-full overflow-hidden sm:aspect-[21/9]">
        {/* Remplacer par une vraie photo (paysage, posture, lieu) */}
        <img
          src="/images/yoga-nature.png"
          alt="Personne en méditation dans un jardin luxuriant, ambiance lumineuse et paisible"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/20 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end gap-4 p-5 sm:gap-6 sm:p-12">
          <h1 className="max-w-xl font-display text-3xl italic text-white drop-shadow-lg sm:text-6xl">
            {site.accroche}
          </h1>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
            <p className="max-w-md text-white/90 drop-shadow-md">
              Cours de Kundalini et Tantra Yoga, en présentiel ou en
              ligne, où que vous soyez et quand vous le voulez.
            </p>
            <Link
              href="/yoga"
              className="shrink-0 self-start rounded-pill border-2 border-white px-4 py-2 text-xs font-semibold text-white hover:bg-white hover:text-encre sm:self-end sm:px-6 sm:py-3 sm:text-sm"
            >
              Essayer 7 jours gratuits
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}