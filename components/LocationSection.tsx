import Image from "next/image";
import VideoDialog from "@/components/VideoDialog";

export default function LocationSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="relative flex min-h-[640px] flex-col items-start justify-between gap-10 overflow-hidden rounded-[40px] bg-[#2B1F19] p-8 text-[#F5F3E7] sm:p-12 lg:flex-row lg:items-center lg:p-16">
        {/* Fond : la salle */}
        <Image
          src="/images/lieu2.png"
          alt="Salle de pratique avec tapis de yoga"
          fill
          loading="lazy"
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#2B1F19]/85 via-[#2B1F19]/55 to-[#2B1F19]/40 lg:bg-gradient-to-r lg:from-[#2B1F19]/85 lg:via-[#2B1F19]/45 lg:to-[#2B1F19]/30"
        />

        {/* Texte */}
        <div className="relative flex max-w-[520px] flex-col gap-5">
          <span className="text-[13px] font-semibold uppercase tracking-[0.14em] opacity-85">
            Le lieu
          </span>
          <h2 className="font-display text-5xl italic leading-[1.02] sm:text-6xl lg:text-7xl">
            L&rsquo;espace Shantalam vous accueille
          </h2>
          <p className="text-[17px] leading-relaxed opacity-90">
            Un espace chaleureux et intimiste pour vos activités
            hebdomadaires, vos ateliers ou vos événements.
          </p>
          <div className="mt-2">
            <VideoDialog />
          </div>
          <p className="mt-2 text-sm opacity-80">
            Une localisation des plus avantageuses, facilement accessible en
            train et en voiture.
          </p>
        </div>

        {/* Photo de Chantal : cadre arrondi avec bordure noire */}
        <div className="relative aspect-[340/540] w-[min(72vw,340px)] self-center overflow-hidden rounded-[36px] border-[4px] border-[#141118] bg-[#D3BFA8] lg:self-auto">
          <Image
            src="/images/lieu1.jpg"
            alt="Chantal assise en tailleur dans la salle de pratique"
            fill
            loading="lazy"
            sizes="340px"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}