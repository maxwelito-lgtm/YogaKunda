export type Cta = { label: string; href: string };

export type ActivityPageData = {
  slug: string;
  metaDescription: string;
  titre: string;
  accroche: string;
  heroImage: string;
  heroAlt: string;
  ctaPrincipal: Cta;
  ctaSecondaire: Cta;
  intro: { titre: string; paragraphes: string[]; cta: Cta };
  pratique: { titre: string; texte: string; image: string; imageAlt: string };
  deroule: {
    titre: string;
    etapes: { titre: string; texte: string }[];
    cta: Cta;
  };
  bandeau: { image: string; alt: string };
  pourQui: string;
  pourquoi: { intro: string; points: string[] };
  programme: { titre: string; texte: string }[];
  infos: {
    formats: {
      titre: string;
      texte: string;
      duree: string;
      tarif: string;
      cta: Cta;
    }[];
    lieu: string;
    contact: string;
  };
};

const kundalini: ActivityPageData = {
  slug: "kundalini",
  metaDescription:
    "Découvrez le Kundalini Yoga : stages en groupe et séances personnalisées pour réveiller votre énergie, apaiser votre mental et vous recentrer.",
  titre: "Kundalini Yoga",
  accroche:
    "Réveillez votre énergie, apaisez votre mental et retrouvez votre élan intérieur.",
  heroImage: "https://picsum.photos/seed/kundalini-hero/1600/900",
  heroAlt: "Ambiance paisible et lumineuse pour une pratique de yoga",
  ctaPrincipal: { label: "Trouver votre stage", href: "#infos" },
  ctaSecondaire: { label: "Séance personnalisée", href: "#infos" },
  intro: {
    titre: "Une science de l'énergie, accessible à tous",
    paragraphes: [
      "Le Kundalini Yoga associe respiration, mouvements, sons et méditation pour mettre en circulation l'énergie présente en chacun de nous. Chaque exercice, appelé kriya, a une intention précise : se détendre, se recentrer, se dynamiser ou s'apaiser.",
      "Nul besoin d'être souple ni d'avoir déjà pratiqué : chaque posture s'adapte à votre corps, et vous avancez à votre rythme, dans un cadre bienveillant et sans jugement.",
    ],
    cta: { label: "Voir les prochains stages", href: "#infos" },
  },
  pratique: {
    titre: "Le souffle, le geste et le son",
    texte:
      "Ici, tout se pratique ensemble. La respiration guide le mouvement, le mouvement ouvre le corps, et les mantras, ces sons que l'on chante ou que l'on murmure, aident à apaiser le flot des pensées. Peu à peu, une sensation de calme et de clarté s'installe.",
    image: "https://picsum.photos/seed/kundalini-pratique/800/600",
    imageAlt: "Personne en pratique de yoga dans un espace calme",
  },
  deroule: {
    titre: "Le déroulé d'une séance",
    etapes: [
      {
        titre: "Accueil et mantra d'ouverture",
        texte:
          "On se pose, on se relie à son souffle et on choisit son intention pour la séance.",
      },
      {
        titre: "Échauffement et respiration",
        texte:
          "Des mouvements doux et des respirations pour réveiller le corps et faire de la place à l'intérieur.",
      },
      {
        titre: "Le kriya",
        texte:
          "Une série d'exercices, statiques ou dynamiques, synchronisés avec le souffle pour mobiliser l'énergie.",
      },
      {
        titre: "La relaxation profonde",
        texte:
          "Allongé, les yeux fermés, on laisse le corps et le mental intégrer la pratique.",
      },
      {
        titre: "La méditation et la clôture",
        texte:
          "Un temps de méditation guidée, puis un mantra de clôture pour repartir calme et recentré.",
      },
    ],
    cta: { label: "Réserver votre place", href: "#infos" },
  },
  bandeau: {
    image: "https://picsum.photos/seed/kundalini-bandeau/1600/600",
    alt: "Paysage apaisant",
  },
  pourQui:
    "Le Kundalini Yoga est ouvert à toutes et à tous, quels que soient votre âge, votre condition physique ou votre expérience. Les exercices s'adaptent à chacun, et aucune croyance ni appartenance n'est nécessaire : seulement l'envie d'essayer.",
  pourquoi: {
    intro: "Le Kundalini Yoga peut vous aider à :",
    points: [
      "traverser le stress du quotidien avec plus de sérénité",
      "retrouver de l'énergie et de la vitalité",
      "favoriser un sommeil plus profond",
      "vous recentrer et mieux vous écouter",
      "apprivoiser vos émotions",
      "cultiver la confiance, la joie et l'ouverture du cœur",
    ],
  },
  programme: [
    {
      titre: "La méditation",
      texte:
        "Méditations dynamiques, chantées ou silencieuses, pour apaiser le mental et s'ancrer dans l'instant présent.",
    },
    {
      titre: "La respiration",
      texte:
        "Un apprentissage progressif des pranayamas, pour se recharger ou se détendre en profondeur.",
    },
    {
      titre: "Le son et les mantras",
      texte:
        "Découvrir la vibration des mantras, à chanter ou à écouter, pour se relier à soi et aux autres.",
    },
    {
      titre: "Les centres d'énergie",
      texte:
        "Explorer les chakras par des exercices simples, pour mieux sentir et faire circuler son énergie.",
    },
  ],
  infos: {
    formats: [
      {
        titre: "Stage en groupe",
        texte:
          "En présentiel, en petit groupe : un temps pour pratiquer, partager et approfondir ensemble.",
        duree: "[à compléter]",
        tarif: "[à compléter]",
        cta: { label: "Voir les dates", href: "/nous-contacter" },
      },
      {
        titre: "Séance personnalisée",
        texte:
          "Un accompagnement individuel, rien que pour vous, dont le contenu s'adapte à vos besoins du moment.",
        duree: "[à compléter]",
        tarif: "[à compléter]",
        cta: { label: "Prendre rendez-vous", href: "/nous-contacter" },
      },
    ],
    lieu: "[adresse du studio]",
    contact: "[téléphone] · [e-mail]",
  },
};

export const activityPages: Record<string, ActivityPageData> = {
  kundalini,
};