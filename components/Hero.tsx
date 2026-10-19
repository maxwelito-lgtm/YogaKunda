import Link from "next/link";
import { site } from "@/site.config";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      
      {/* Image */}
      <img
        src="/images/yoga-nature.png"
        alt="Silhouette en posture de l'arbre sur un rocher, face à des montagnes au coucher du soleil"
        className="absolute inset-0 h-full w-full object-cover object-[10%_center] md:object-center"
      />

      {/* Dégradé sombre pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/20 to-transparent" />

      {/* Contenu centré */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5 p-5 text-center sm:gap-7 sm:p-12">

        {/* Logo centré au-dessus du titre : apparition douce puis respiration lente */}
        <img
          src="/images/logo-shantalam.png"
          alt=""
          aria-hidden="true"
          className="hero-logo h-24 w-24 object-contain sm:h-[120px] sm:w-[120px]"
        />
        
        <h1 className="hero-t1 max-w-2xl font-display text-3xl italic text-white drop-shadow-lg sm:text-6xl">
          {site.accroche}
        </h1>

        <p className="hero-t2 max-w-md text-white/90 drop-shadow-md">
          Cours de Kundalini et Tantra Yoga, en présentiel ou en ligne,
          où que vous soyez et quand vous le voulez.
        </p>

        <div className="hero-t3 mt-1 flex items-center justify-center gap-3 sm:gap-4">
          {/* Bouton principal : défile vers la section Activités */}
          <a
            href="#activites"
            className="btn-bounce inline-flex min-h-[44px] min-w-[210px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-7 py-3 text-sm font-semibold text-white backdrop-blur-md hover:bg-[#75523F]"
          >
            Trouver votre séance
          </a>

          {/* Bouton secondaire : visible à partir de la taille tablette, masqué sur mobile */}
          <Link
            href="/mon-espace"
            className="btn-bounce hidden min-h-[44px] min-w-[210px] items-center justify-center rounded-pill border-[1.5px] border-white/80 px-7 py-3 text-sm font-semibold text-white backdrop-blur-sm hover:bg-white/15 sm:inline-flex"
          >
            Cours en ligne
          </Link>
        </div>
      </div>
    </section>
  );
}