import Image from "next/image";
import VideoDialog from "@/components/VideoDialog";
import { lieux } from "@/data/lieux";

export default function LocationSection() {
  return (
    <section
      id="espace"
      className="scroll-mt-20 bg-[#2B1F19] text-encre lg:grid lg:min-h-[640px] lg:grid-cols-[minmax(0,1fr)_31%]"
    >
      {/* Colonne de gauche : la salle en haut, le bloc crème par-dessus */}
      <div className="relative lg:py-[110px]">
        <div className="relative h-56 sm:h-72 lg:absolute lg:left-0 lg:top-0 lg:h-[430px] lg:w-[56%]">
          <Image
            src="/images/lieu2.png"
            alt="Salle de pratique avec tapis de yoga"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 55%" }}
          />
        </div>

        <div className="relative z-10 mx-4 -mt-10 bg-[#F5F3E7] p-6 sm:mx-8 sm:p-10 lg:mx-0 lg:ml-[44%] lg:mt-0 lg:p-10 xl:p-12">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#75523F]">
            Le lieu
          </span>
          <h2 className="mt-2 font-display text-4xl italic leading-[1.04] xl:text-5xl">
            L&rsquo;espace Shantalam vous accueille
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed text-encre/80">
            Un espace chaleureux et intimiste pour vos activités
            hebdomadaires, vos ateliers ou vos événements.
          </p>
          <div className="mt-4">
            <VideoDialog />
          </div>

          <ul className="mt-5 flex flex-col gap-3 border-t border-encre/20 pt-4">
            {lieux.map((l) => (
              <li key={l.id}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${l.salle}, ${l.adresse}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block text-[13px] leading-snug"
                >
                  <span className="font-display text-xl italic">{l.ville}</span>
                  <span className="text-[#75523F]"> · le {l.jourNom}</span>
                  <span className="mt-0.5 block text-encre/80 group-hover:underline">
                    {l.salle}, {l.adresse}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Colonne de droite : Chantal, pleine hauteur */}
      <div className="relative mt-10 h-[420px] sm:h-[520px] lg:mt-0 lg:h-auto lg:border-l-[6px] lg:border-[#2B1F19]">
        <Image
          src="/images/lieu1.jpg"
          alt="Chantal assise en tailleur dans la salle de pratique"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 31vw, 100vw"
          className="object-cover"
          style={{ objectPosition: "center 18%" }}
        />
      </div>
    </section>
  );
}