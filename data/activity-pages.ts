import { site } from "@/site.config";
export type Cta = { label: string; href: string };

export type ActivityPageData = {
  slug: string;
  fond?: string;
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
  fond: "#F5F3E7",
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
    lieu: site.adresse,
    contact: `${site.telephone} · ${site.email}`,
  },
};

const tantra: ActivityPageData = {
  slug: "tantra",
  fond: "#F5F3E7",
  metaDescription:
    "Ateliers Tantra & Kundalini en présentiel : des ateliers de 2 à 3 heures pour lâcher prise, apaiser le mental et explorer plus profondément votre pratique, en groupe ou en séance personnalisée.",
  titre: "Ateliers Tantra & Kundalini",
  accroche:
    "Prenez le temps d'explorer : lâchez prise, apaisez votre mental et approfondissez votre pratique lors d'ateliers de 2 à 3 heures.",
  heroImage: "/images/tantra.png",
  heroAlt: "Salle de pratique chaleureuse pour un atelier de Tantra et Kundalini Yoga",
  ctaPrincipal: { label: "Réserver un atelier", href: "#infos" },
  ctaSecondaire: { label: "Nous poser une question", href: "/nous-contacter" },
  intro: {
    titre: "Un yoga qui relie le corps, le cœur et l'esprit",
    paragraphes: [
      "Le Tantra Yoga est une approche globale : on ne cherche pas à dompter le corps ou le mental, mais à les écouter et à les mettre en harmonie. Postures, respiration, sons et méditation sont réunis dans une même pratique, pour vivre pleinement chaque sensation.",
      "C'est un yoga accessible, qui s'adresse aussi bien à celles et ceux qui découvrent qu'aux pratiquants réguliers. L'atelier se déroule à votre rythme, dans un cadre bienveillant, sans performance ni jugement.",
    ],
    cta: { label: "Voir les infos pratiques", href: "#infos" },
  },
  pratique: {
    titre: "Accueillir ce qui est, et le transformer en douceur",
    texte:
      "Dans le Tantra, rien n'est à rejeter : ni la fatigue, ni la tension, ni les émotions du moment. On les accueille, on respire avec elles, et la pratique aide peu à peu à les apaiser. Le lâcher-prise ne s'impose pas, il s'installe naturellement, séance après séance.",
    image: "https://picsum.photos/seed/tantra-pratique/800/600",
    imageAlt: "Personnes en pratique de yoga dans un espace chaleureux",
  },
  deroule: {
    titre: "Le déroulé d'un atelier",
    etapes: [
      {
        titre: "Accueil et ancrage",
        texte:
          "On arrive, on dépose la journée et on se relie à son souffle.",
      },
      {
        titre: "Éveil du corps",
        texte:
          "Des mouvements et des postures simples pour relâcher les tensions et réveiller les sensations.",
      },
      {
        titre: "Respiration et énergie",
        texte:
          "Des respirations guidées pour calmer le mental et faire circuler l'énergie.",
      },
      {
        titre: "Relaxation profonde",
        texte:
          "Allongé, on laisse le corps et le mental se poser pour intégrer la pratique.",
      },
      {
        titre: "Méditation et clôture",
        texte:
          "Un temps de calme intérieur, puis un retour en douceur pour repartir apaisé.",
      },
    ],
    cta: { label: "Réserver votre place", href: "#infos" },
  },
  bandeau: {
    image: "https://picsum.photos/seed/tantra-bandeau/1600/600",
    alt: "Ambiance apaisante",
  },
  pourQui:
    "Les ateliers s'adressent à toute personne désireuse de ralentir, de mieux se connaître et de traverser les moments chargés avec plus de sérénité. Aucun prérequis n'est nécessaire : ni souplesse, ni expérience, ni croyance particulière. L'atelier accueille les débutants, tout en restant riche pour les pratiquants plus avancés.",
  pourquoi: {
    intro: "Les ateliers peuvent vous accompagner pour :",
    points: [
      "relâcher le stress et les tensions accumulées",
      "pacifier un mental trop agité",
      "accueillir vos émotions avec plus de douceur",
      "retrouver une sensation de calme profond",
      "mieux vous écouter et vous reconnecter à votre corps",
      "cultiver la confiance et l'ouverture",
    ],
  },
  programme: [
    {
      titre: "Les postures",
      texte:
        "Des enchaînements doux, accessibles à tous, pour assouplir le corps et favoriser le lâcher-prise.",
    },
    {
      titre: "La respiration",
      texte:
        "Des techniques simples pour apaiser le système nerveux et se recentrer rapidement.",
    },
    {
      titre: "La relaxation",
      texte:
        "Des temps de détente guidée pour déposer les tensions et intégrer la pratique.",
    },
    {
      titre: "La méditation",
      texte:
        "Des méditations accessibles pour cultiver la présence et la clarté intérieure.",
    },
  ],
  infos: {
    formats: [
      {
        titre: "Atelier en groupe",
        texte:
          "En présentiel, en petit groupe : un temps de 2 à 3 heures pour explorer davantage, pratiquer et partager ensemble.",
        duree: "2h à 3h",
        tarif: "[à compléter]",
        cta: { label: "Voir les dates", href: "/nous-contacter" },
      },
      {
        titre: "Atelier personnalisé",
        texte:
          "Un atelier individuel de 2 à 3 heures, rien que pour vous, dont le contenu s'adapte à vos besoins du moment.",
        duree: "2h à 3h",
        tarif: "[à compléter]",
        cta: { label: "Prendre rendez-vous", href: "/nous-contacter" },
      },
    ],
    lieu: site.adresse,
    contact: `${site.telephone} · ${site.email}`,
  },
};

export const activityPages: Record<string, ActivityPageData> = {
  kundalini,
  tantra,
};