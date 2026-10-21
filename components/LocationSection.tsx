import Image from "next/image";
import PresentationVideo from "@/components/PresentationVideo";
import { site } from "@/site.config";

const PHOTOS = [
  { src: "/images/lieu1.jpg", alt: "Façade du studio de yoga" },
  { src: "/images/lieu2.png", alt: "Salle de pratique avec tapis de yoga" },
  { src: "/images/lieu3.png", alt: "Salle de pratique avec coussins colorés" },
];

export default function LocationSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
      <h2 className="text-encre text-4xl">L&rsquo;espace {site.nom}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-encre/80">
        Découvrez un espace chaleureux et
        intimiste pour vos activités hebdomadaires, vos ateliers ou vos
        événements.
      </p>
      <PresentationVideo />

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {PHOTOS.map((p) => (
          <div
            key={p.src}
            className="relative h-56 w-full overflow-hidden rounded-xl sm:col-span-1"
          >
            <Image
              src={p.src}
              alt={p.alt}
              fill
              loading="lazy"
              sizes="(min-width: 1024px) 336px, (min-width: 640px) 33vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <p className="mt-8 text-sm text-encre/70">
        Une localisation des plus avantageuses — facilement accessible en
        train et en voiture.
      </p>
    </section>
  );
}