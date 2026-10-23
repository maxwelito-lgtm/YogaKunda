import Image from "next/image";
import VideoDialog from "@/components/VideoDialog";

const parcours = [
  { titre: "Formation", texte: "Diplômée de l’École du Tantra" },
  { titre: "Thérapie", texte: "Thérapeute diplômée" },
  { titre: "Pratique", texte: "Une dizaine d’années de pratique" },
  { titre: "Transmission", texte: "Plus de 50 élèves accompagnés" },
  {
    titre: "Enseignement",
    texte: "Kundalini, Tantra, Yoga Nidra, thérapie holistique",
  },
];

export default function ProfesseureSection() {
  return (
    <section
      id="professeure"
      className="scroll-mt-20 bg-[#E6DCC6] py-10 sm:py-14 md:py-16 lg:relative lg:flex lg:min-h-[820px] lg:items-center lg:py-0"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-6 px-4 sm:px-6 md:grid-cols-[minmax(0,420px)_minmax(0,1fr)] md:gap-0 lg:contents">
        {/* Photo : portrait entier, jamais coupé sur mobile */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] md:aspect-[11/16] md:max-w-none lg:absolute lg:inset-y-0 lg:left-auto lg:right-0 lg:aspect-auto lg:w-[43%]">
          <Image
            src="/images/lieu1.jpg"
            alt="Chantal assise en tailleur dans la salle de pratique"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 43vw, (min-width: 768px) 420px, 340px"
            className="object-cover [object-position:center_20%] md:[object-position:center_58%]"
          />
        </div>

        {/* Fiche : compacte, chevauche légèrement la photo sur écran large */}
        <div className="relative z-10 mb-3.5 mr-3.5 sm:mb-6 sm:mr-6 md:-ml-16 lg:my-16 lg:ml-[7.5%] lg:w-[54%] lg:max-w-[780px]">
          {/* Bloc terracotta décalé derrière la fiche */}
          <div
            aria-hidden="true"
            className="absolute inset-0 translate-x-3.5 translate-y-3.5 bg-[#75523F] sm:translate-x-6 sm:translate-y-6"
          />
          <div className="relative bg-[#F5F3E7] p-5 text-encre sm:p-7 md:py-9 md:pl-12 md:pr-9 lg:p-12">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#75523F]">
            Votre professeure
          </span>
          <h2 className="mt-1.5 font-display text-4xl italic leading-none sm:text-5xl lg:text-[56px]">
            Chantal Lassier
          </h2>
          <p className="mt-2 font-display text-lg italic text-encre/80 lg:text-xl">
            Professeure de yoga et thérapeute diplômée
          </p>

          <ol className="mt-5 lg:mt-7">
            {parcours.map((p, i) => (
              <li key={p.titre} className="relative pb-3.5 pl-7 last:pb-0 lg:pb-5">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-1.5 h-3 w-3 rounded-full bg-[#75523F]"
                />
                {i < parcours.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-[5px] top-5 border-l border-[#75523F]/50"
                  />
                )}
                <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-[#75523F]">
                  {p.titre}
                </span>
                <span className="block font-display text-lg italic leading-tight sm:text-xl lg:text-2xl">
                  {p.texte}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-5 border-t border-encre/15 pt-4 lg:mt-7 lg:pt-6">
            <VideoDialog label="Voir la vidéo de présentation" />
          </div>
          </div>
        </div>
      </div>
    </section>
  );
}
