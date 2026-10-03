import Link from "next/link";
import { site } from "@/site.config";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      
      {/* Image */}
      <img
        src="/images/yoga-nature.png"
        alt="Personne en méditation dans un jardin luxuriant, ambiance lumineuse et paisible"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dégradé sombre pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/20 to-transparent" />

      {/* Contenu */}
      <div className="relative z-10 flex min-h-screen flex-col justify-end gap-4 p-5 sm:gap-6 sm:p-12">
        
        <h1 className="max-w-xl font-display text-3xl italic text-white drop-shadow-lg sm:text-6xl">
          {site.accroche}
        </h1>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          
          <p className="max-w-md text-white/90 drop-shadow-md">
            Cours de Kundalini et Tantra Yoga, en présentiel ou en ligne,
            où que vous soyez et quand vous le voulez.
          </p>

          <Link
            href="/yoga"
            className="btn-bounce shrink-0 self-start rounded-pill border-[1.5px] border-white bg-black/35 px-4 py-2.5 text-xs font-semibold text-white backdrop-blur-md hover:bg-black/50 sm:self-end sm:px-6 sm:py-3 sm:text-sm"
          >
            Trouver votre stage
          </Link>
        </div>
      </div>
    </section>
  );
}