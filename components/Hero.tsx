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
          <p className="max-w-md text-white/90 drop-shadow-md">
            Cours de Kundalini et Tantra Yoga, en présentiel à {site.ville} ou en
            ligne, où que vous soyez et quand vous le voulez.
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Link
              href="/inscription"
              className="rounded-pill border-2 border-violet-dark bg-violet-light px-4 py-2 text-xs font-semibold text-violet-dark hover:bg-white sm:px-6 sm:py-3 sm:text-sm"
            >
              Créer mon compte
            </Link>
            <Link
              href="/yoga"
              className="rounded-pill border-2 border-white px-4 py-2 text-xs font-semibold text-white hover:bg-white hover:text-encre sm:px-6 sm:py-3 sm:text-sm"
            >
              Découvrir les formules
            </Link>
          </div>
        </div>
      </div>

      {/* Bandeau essai gratuit */}
      <div className="bg-sauge/20 px-4 py-3 text-center text-sm sm:px-6">
        <strong className="font-semibold">7 jours d&rsquo;essai gratuit</strong>
        {" "}sur les cours en ligne — renouvellement automatique sauf résiliation
        avant échéance.
      </div>
    </section>
  );
}