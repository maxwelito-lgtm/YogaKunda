type Activity = {
  titre: string;
  sousTitre: string;
  texte: string;
  image: string;
  cta: string;
  href: string;
  niveau: string;
  duree: string;
  badge?: string;
};

const activites: Activity[] = [
  {
    titre: "Cours de Tantra Yoga",
    sousTitre: "Le Yoga holistique par excellence",
    texte:
      "Un yoga complet pour cultiver le lâcher-prise, pacifier son mental et apporter un apaisement émotionnel profond.",
    image: "/images/Tantra.png",
    cta: "En savoir plus",
    href: "/yoga#tantra",
    niveau: "Niveau 1",
    duree: "60 min",
  },
  {
    titre: "Cours de Kundalini Yoga",
    sousTitre: "Le Yoga pour l'éveil de l'énergie créatrice",
    texte:
      "Au-delà de l'équilibre entre le corps et l'esprit, ce yoga est une véritable science pour révéler son plein potentiel.",
    image: "/images/Kundalini.png",
    cta: "En savoir plus",
    href: "/yoga#kundalini",
    niveau: "Niveau 2",
    duree: "60 min",
  },
  {
    titre: "Thérapie Holistique",
    sousTitre: "Un accompagnement adapté à vous",
    texte:
      "Une thérapie qui prend en compte toutes les dimensions de l'être — physique, psychique et émotionnelle.",
    image: "/images/therapie.jpeg",
    cta: "En savoir plus",
    href: "/therapie-holistique",
    niveau: "Tous niveaux",
    duree: "60 min",
  },
  {
    titre: "Cours en ligne & relaxations audio",
    sousTitre: "Une façon de pratiquer en toute flexibilité",
    texte:
      "Retrouvez les cours de Kundalini Yoga et de Tantra Yoga en direct et/ou en replay, ainsi que les relaxations audio guidées.",
    image: "https://picsum.photos/seed/enligne/500/700",
    cta: "Contenus en ligne",
    href: "/mon-espace",
    niveau: "A votre rythme",
    duree: "30 min",
    badge: "Nouveau !",
  },
];

export default function ActivityCards() {
  return (
    <section id="activites" className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16">
      <h2 className="mb-3 text-center font-display italic text-4xl text-encre">
        Activités
      </h2>
      <p className="mb-10 text-center font-display italic text-dark">
        Explorez votre bien être au travers de nos activités
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activites.map((a) => (
          <article
            key={a.titre}
            className="card-bounce relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-2xl text-left shadow-sm"
          >
            <img
              src={a.image}
              alt={a.titre}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />

            {a.badge && (
              <span className="absolute top-4 left-4 z-10 w-fit rounded-pill bg-violet px-3 py-1 text-xs font-semibold text-white">
                {a.badge}
              </span>
            )}

            <div className="relative z-10 p-5 pt-14">
              <h3 className="text-xl text-white drop-shadow-md">{a.titre}</h3>
              <p className="mt-1 font-display italic text-sm text-white/85 drop-shadow-md">
                {a.sousTitre}
              </p>
            </div>

            <div className="relative z-10 flex flex-col gap-4 p-5 pt-0">
              <p className="text-sm text-white/90 drop-shadow-md">{a.texte}</p>

              <a
                href={a.href}
                className="btn-bounce w-fit min-h-[44px] rounded-pill bg-white px-5 py-2.5 text-sm font-semibold text-encre"
              >
                {a.cta}
              </a>

              <div className="flex gap-2">
                <span className="flex items-center gap-1 rounded-pill bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                  <LevelIcon />
                  {a.niveau}
                </span>
                <span className="flex items-center rounded-pill bg-white/20 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-sm">
                  {a.duree}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LevelIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="14" width="4" height="7" rx="1" fill="currentColor" />
      <rect x="10" y="9" width="4" height="12" rx="1" fill="currentColor" />
      <rect x="17" y="4" width="4" height="17" rx="1" fill="currentColor" />
    </svg>
  );
}