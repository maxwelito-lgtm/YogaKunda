import Image from "next/image";
import Link from "next/link";

type Bande = {
  titre: string;
  sousTitre: string;
  texte: string;
  image: string;
  position: string; // cadrage de la photo (object-position)
  href: string;
  niveau?: string;
  duree?: string;
  couleur: string; // couleurs du bloc
};

const bandes: Bande[] = [
  {
    titre: "Cours de Kundalini Yoga",
    sousTitre: "Le Yoga pour l'éveil de l'énergie créatrice",
    texte:
      "Au-delà de l'équilibre entre le corps et l'esprit, ce yoga est une véritable science pour révéler son plein potentiel. Chaque lundi à Géronce et chaque mercredi à Oloron.",
    image: "/images/kundalini.png",
    position: "center 30%",
    href: "/yoga/kundalini",
    niveau: "Niveau 2",
    duree: "1 h 30",
    couleur: "bg-[#E6DCC6] text-encre",
  },
  {
    titre: "Ateliers Tantra & Kundalini",
    sousTitre: "Prendre le temps d'approfondir",
    texte:
      "Des ateliers de 2 à 3 heures pour explorer davantage le Tantra Yoga et le Kundalini Yoga, ressentir plus profondément et enrichir votre pratique.",
    image: "/images/tantra.png",
    position: "center 40%",
    href: "/yoga/tantra",
    niveau: "Niveau 1",
    duree: "2 h à 3 h",
    couleur: "bg-[#75523F] text-[#F5F3E7]",
  },
  {
    titre: "Yoga Nidra",
    sousTitre: "Le repos profond, guidé",
    texte:
      "Une relaxation guidée, allongé et sans effort, pour relâcher les tensions et se ressourcer en profondeur. Proposé uniquement en ligne.",
    image: "/images/yoga-n.png",
    position: "center 40%",
    href: "/yoga/nidra",
    niveau: "Tous niveaux",
    duree: "En ligne",
    couleur: "bg-[#2B1F19] text-[#F5F3E7]",
  },
  {
    titre: "Thérapie Holistique",
    sousTitre: "Un accompagnement adapté à vous",
    texte:
      "Une thérapie qui prend en compte toutes les dimensions de l'être — physique, psychique et émotionnelle.",
    image: "/images/therapie.jpeg",
    position: "center 40%",
    href: "/therapie-holistique",
    niveau: "Tous niveaux",
    duree: "60 min",
    couleur: "bg-white text-encre",
  },
];

export default function ActivityBands() {
  return (
    <section id="activites" className="scroll-mt-20 pb-16 pt-12 sm:pt-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-4xl italic text-encre sm:text-5xl">
          Au programme
        </h2>
        <p className="mt-3 font-display italic text-encre/80">
          Explorez votre bien-être au travers de nos activités
        </p>
      </div>

      <div className="mt-12 flex flex-col gap-12 lg:mt-16 lg:gap-0">
        {bandes.map((b, i) => {
          // Une bande sur deux : photo à gauche, puis photo à droite.
          const photoAGauche = i % 2 === 0;

          return (
            <article
              key={b.titre}
              className={`relative grid grid-cols-1 lg:grid-cols-12 ${
                i > 0 ? "lg:-mt-8" : ""
              }`}
            >
              {/* Photo : colle au bord de l'écran */}
              <div
                className={`relative h-64 w-[88%] sm:h-80 lg:h-[420px] lg:w-full lg:justify-self-stretch ${
                  photoAGauche
                    ? "justify-self-start lg:col-start-1 lg:col-end-8"
                    : "justify-self-end lg:col-start-6 lg:col-end-13"
                } lg:row-start-1`}
              >
                <Image
                  src={b.image}
                  alt=""
                  fill
                  loading={i === 0 ? "eager" : "lazy"}
                  sizes="(min-width: 1024px) 60vw, 88vw"
                  className="object-cover"
                  style={{ objectPosition: b.position }}
                />
              </div>

              {/* Bloc de couleur : chevauche la photo */}
              <div
                className={`relative z-10 -mt-12 flex flex-col justify-center px-6 py-8 sm:px-10 sm:py-10 ${b.couleur} ${
                  photoAGauche
                    ? "mr-6 sm:mr-14 lg:mr-0 lg:col-start-6 lg:col-end-13 lg:pl-[calc(28.57%_+_2rem)] lg:pr-[max(3.5rem,calc((100vw_-_72rem)/2))]"
                    : "ml-6 sm:ml-14 lg:ml-0 lg:col-start-1 lg:col-end-8 lg:pl-[max(3.5rem,calc((100vw_-_72rem)/2))] lg:pr-[calc(28.57%_+_2rem)]"
                } lg:row-start-1 lg:mt-0 lg:min-h-[300px] lg:self-center lg:py-12`}
              >
                <span className="font-display text-2xl italic opacity-80">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-1 font-display text-3xl italic leading-tight sm:text-4xl">
                  {b.titre}
                </h3>
                <p className="mt-2 font-display italic opacity-85">
                  {b.sousTitre}
                </p>
                <p className="mt-4 max-w-md text-[15px] leading-relaxed opacity-90">
                  {b.texte}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
                  <Link
                    href={b.href}
                    aria-label={`Découvrir : ${b.titre}`}
                    className="inline-block border-b border-current pb-1 text-xs font-semibold uppercase tracking-[0.14em]"
                  >
                    Découvrir
                  </Link>
                  {(b.niveau || b.duree) && (
                    <span className="text-xs opacity-75">
                      {[b.niveau, b.duree].filter(Boolean).join(" · ")}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}