import Link from "next/link";
import Image from "next/image";
import { site } from "@/site.config";
import { lienCta } from "@/components/lien-cta";

export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      
      {/* Image */}
      <Image
        src="/images/yoga-nature.png"
        alt="Silhouette en posture de l'arbre sur un rocher, face à des montagnes au coucher du soleil"
        fill
        loading="eager"
        sizes="100vw"
        className="object-cover object-[10%_center] md:object-center"
      />

      {/* Dégradé sombre pour améliorer la lisibilité du texte */}
      <div className="absolute inset-0 bg-gradient-to-t from-encre/80 via-encre/20 to-transparent" />

      {/* Contenu centré */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center gap-5 p-5 text-center sm:gap-7 sm:p-12">

        {/* Logo centré au-dessus du titre : apparition douce puis respiration lente */}
        <Image
          src="/images/logo-shantalam.png"
          alt=""
          aria-hidden="true"
          width={120}
          height={120}
          loading="eager"
          className="hero-logo h-24 w-24 object-contain sm:h-[120px] sm:w-[120px]"
        />
        
        <h1 className="hero-t1 max-w-2xl font-display text-3xl italic text-white drop-shadow-lg sm:text-6xl">
          {site.accroche}
        </h1>

        <p className="hero-t2 max-w-md text-white/90 drop-shadow-md">
          Cours de Kundalini et Tantra Yoga, en présentiel ou en ligne,
          où que vous soyez et quand vous le voulez.
        </p>

        <div className="hero-t3 mt-1 flex items-center justify-center gap-7 sm:gap-10">
          {/* Lien principal : défile vers la section Activités */}
          <a href="#activites" className={lienCta.clair}>
            Trouver votre séance
          </a>

          {/* Lien secondaire : visible à partir de la taille tablette, masqué sur mobile */}
          <Link href="/#abonnement" className={`${lienCta.clair} max-sm:hidden`}>
            Cours en ligne
          </Link>
        </div>
      </div>
    </section>
  );
}