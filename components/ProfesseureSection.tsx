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
      className="scroll-mt-20 bg-[#E6DCC6] py-10 sm:py-14"
    >
      <div className="mx-auto grid max-w-5xl items-center gap-6 px-4 sm:px-6 md:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] md:gap-0 lg:px-8">
        {/* Photo : portrait entier, jamais coupé sur mobile */}
        <div className="relative mx-auto aspect-[4/5] w-full max-w-[340px] md:max-w-none">
          <Image
            src="/images/lieu1.jpg"
            alt="Chantal assise en tailleur dans la salle de pratique"
            fill
            loading="lazy"
            sizes="(min-width: 768px) 40vw, 340px"
            className="object-cover"
            style={{ objectPosition: "center 20%" }}
          />
        </div>

        {/* Fiche : compacte, chevauche légèrement la photo sur écran large */}
        <div className="relative z-10 bg-[#F5F3E7] p-5 text-encre sm:p-7 md:-ml-10 md:py-8 md:pl-10 md:pr-8 lg:p-9 lg:pl-12">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#75523F]">
            Votre professeure
          </span>
          <h2 className="mt-1.5 font-display text-4xl italic leading-none sm:text-5xl">
            Chantal Lassier
          </h2>
          <p className="mt-2 font-display text-lg italic text-encre/80">
            Professeure de yoga et thérapeute diplômée
          </p>

          <ol className="mt-5">
            {parcours.map((p, i) => (
              <li key={p.titre} className="relative pb-3.5 pl-7 last:pb-0">
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
                <span className="block font-display text-lg italic leading-tight sm:text-xl">
                  {p.texte}
                </span>
              </li>
            ))}
          </ol>

          <div className="mt-5 border-t border-encre/15 pt-4">
            <VideoDialog label="Voir la vidéo de présentation" />
          </div>
        </div>
      </div>
    </section>
  );
}
