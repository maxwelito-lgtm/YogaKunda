import Image from "next/image";
import VideoDialog from "@/components/VideoDialog";
import { lieux } from "@/data/lieux";

export default function LocationSection() {
  return (
    <section
      id="espace"
      className="relative scroll-mt-20 bg-[#2B1F19] pb-12 text-encre lg:min-h-[700px] lg:pb-0"
    >
      {/* Photo de la salle : colle au bord gauche de l'écran */}
      <div className="relative h-56 sm:h-72 lg:absolute lg:left-0 lg:top-0 lg:h-[560px] lg:w-[60%]">
        <Image
          src="/images/lieu2.png"
          alt="Salle de pratique avec tapis de yoga"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          style={{ objectPosition: "center 55%" }}
        />
      </div>

      {/* Bloc crème par-dessus la photo */}
      <div className="relative z-10 mx-4 -mt-10 bg-[#F5F3E7] p-6 sm:mx-8 sm:p-10 lg:my-0 lg:ml-[48.6%] lg:mr-[7%] lg:mt-20 lg:p-12">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#75523F]">
          Le lieu
        </span>
        <h2 className="mt-2 font-display text-4xl italic leading-[1.04] xl:text-5xl">
          L&rsquo;espace Shantalam vous accueille
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-encre/80">
          Un espace chaleureux et intimiste pour vos activités hebdomadaires,
          vos ateliers ou vos événements.
        </p>
        <div className="mt-4">
          <VideoDialog />
        </div>

        <ul className="mt-5 flex flex-col gap-4 border-t border-encre/20 pt-4 sm:flex-row sm:gap-8">
          {lieux.map((l) => (
            <li key={l.id} className="sm:flex-1">
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
    </section>
  );
}