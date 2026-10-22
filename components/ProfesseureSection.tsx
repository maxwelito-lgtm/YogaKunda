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
      className="relative scroll-mt-20 bg-[#E6DCC6] pb-12 lg:min-h-[760px] lg:pb-0"
    >
      {/* Photo : colle au bord gauche de l'écran */}
      <div className="relative h-80 w-[88%] sm:h-[420px] lg:absolute lg:inset-y-0 lg:left-0 lg:h-auto lg:w-[36%]">
        <Image
          src="/images/lieu1.jpg"
          alt="Chantal assise en tailleur dans la salle de pratique"
          fill
          loading="lazy"
          sizes="(min-width: 1024px) 36vw, 88vw"
          className="object-cover"
          style={{ objectPosition: "center 20%" }}
        />
      </div>

      {/* Carte crème : chevauche la photo */}
      <div className="relative z-10 -mt-10 ml-auto mr-4 w-[92%] bg-[#F5F3E7] p-6 text-encre sm:mr-8 sm:p-10 lg:my-[50px] lg:ml-[32%] lg:mr-[5.5%] lg:w-auto lg:p-14">
        <span className="text-xs font-semibold uppercase tracking-[0.22em] text-[#75523F]">
          Votre professeure
        </span>
        <h2 className="mt-2 font-display text-5xl italic leading-none sm:text-6xl">
          Chantal Lassier
        </h2>
        <p className="mt-3 font-display text-xl italic text-encre/80">
          Professeure de yoga et thérapeute diplômée
        </p>

        <ol className="mt-8">
          {parcours.map((p, i) => (
            <li key={p.titre} className="relative pb-6 pl-9 last:pb-0">
              <span
                aria-hidden="true"
                className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-[#75523F]"
              />
              {i < parcours.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 left-[6px] top-6 border-l border-[#75523F]/50"
                />
              )}
              <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-[#75523F]">
                {p.titre}
              </span>
              <span className="mt-0.5 block font-display text-2xl italic leading-tight">
                {p.texte}
              </span>
            </li>
          ))}
        </ol>

        {/* Vidéo de présentation : en bas de la fiche */}
        <div className="mt-8 border-t border-encre/15 pt-6">
          <VideoDialog label="Voir la vidéo de présentation" />
        </div>
      </div>
    </section>
  );
}