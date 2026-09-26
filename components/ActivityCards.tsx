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
    image: "https://picsum.photos/seed/tantra/200/200",
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
    image: "https://picsum.photos/seed/kundalini/200/200",
    cta: "En savoir plus",
    href: "/yoga#kundalini",
    niveau: "Niveau 2",
    duree: "60 min",
  },
  {
    titre: "Cours en ligne & relaxations audio",
    sousTitre: "Une façon de pratiquer en toute flexibilité",
    texte:
      "Retrouvez les cours de Kundalini Yoga et de Tantra Yoga en direct et/ou en replay, ainsi que les relaxations audio guidées.",
    image: "https://picsum.photos/seed/enligne/200/200",
    cta: "Découvrir l'espace en ligne",
    href: "/mon-espace",
    niveau: "Tous niveaux",
    duree: "45 min",
    badge: "Nouveau !",
  },
  {
    titre: "Thérapie Holistique",
    sousTitre: "Un accompagnement personnel",
    texte:
      "Une thérapie qui prend en compte toutes les dimensions de l'être — physique, psychique et émotionnelle.",
    image: "https://picsum.photos/seed/therapie/200/200",
    cta: "En savoir plus",
    href: "/therapie-holistique",
    niveau: "Tous niveaux",
    duree: "60 min",
  },
];

export default function ActivityCards() {
  return (
    <section id="activites" className="mx-auto max-w-6xl px-4 pt-12 pb-16 sm:px-6 sm:pt-16">
      <h2 className="mb-3 text-center font-display italic text-4xl text-violet-dark">
        Activités
      </h2>
      <p className="mb-10 text-center font-display italic text-violet-dark">
        Reprise des cours le 08 septembre
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activites.map((a) => (
          <article
            key={a.titre}
            className="relative flex flex-col rounded-2xl bg-white p-6 text-center shadow-sm"
          >
            {a.badge && (
              <span className="absolute -top-3 left-4 rounded-pill bg-violet px-3 py-1 text-xs font-semibold text-white">
                {a.badge}
              </span>
            )}
            <img
              src={a.image}
              alt={a.titre}
              className="mx-auto mb-4 h-20 w-20 rounded-full object-cover"
            />
            <h3 className="text-xl">{a.titre}</h3>
            <p className="mt-1 font-display italic text-sm text-encre/70">
              {a.sousTitre}
            </p>
            <p className="mt-3 flex-1 text-sm text-encre/80">{a.texte}</p>
            <a href={a.href} className="mx-auto mt-5 min-h-[44px] rounded-pill bg-violet-light px-5 py-2.5 text-sm font-semibold text-violet-dark">
              {a.cta}
            </a>
            <div className="mx-auto mt-4 flex gap-2">
              <span className="flex items-center gap-1 rounded-pill bg-violet-light px-3 py-1.5 text-xs font-bold text-violet-dark">
                <LevelIcon />
                {a.niveau}
              </span>
              <span className="flex items-center rounded-pill bg-violet-light px-3 py-1.5 text-xs font-bold text-violet-dark">
                {a.duree}
              </span>
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