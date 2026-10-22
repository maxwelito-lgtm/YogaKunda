import { site } from "@/site.config";
export type Cta = { label: string; href: string };

// Quelle section de tarifs afficher sur la page
export type TypeTarifs = "kundalini" | "ateliers" | "en-ligne" | "therapie";

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
  intro: { titre: string; paragraphes: string[]; cta: Cta; sousCta?: string };
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
  tarifs: TypeTarifs;
  infos: {
    lieu?: string; // facultatif : non affiché s'il est absent
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
  heroImage: "/images/kundalini.png",  
  heroAlt: "Ambiance paisible et lumineuse pour une pratique de yoga",
  ctaPrincipal: { label: "Séance collective", href: "#tarifs" },
  ctaSecondaire: {
    label: "Séance personnalisée",
    href: "/reserver?offre=perso",
  },
  intro: {
    titre: "Une science de l'énergie, accessible à tous",
    paragraphes: [
      "Le Kundalini Yoga associe respiration, mouvements, sons et méditation pour mettre en circulation l'énergie présente en chacun de nous. Chaque exercice, appelé kriya, a une intention précise : se détendre, se recentrer, se dynamiser ou s'apaiser.",
      "Nul besoin d'être souple ni d'avoir déjà pratiqué : chaque posture s'adapte à votre corps, et vous avancez à votre rythme, dans un cadre bienveillant et sans jugement.",
    ],
    cta: { label: "Voir les tarifs", href: "#tarifs" },
  },
  pratique: {
    titre: "Le souffle, le geste et le son",
    texte:
      "Ici, tout se pratique ensemble. La respiration guide le mouvement, le mouvement ouvre le corps, et les mantras, ces sons que l'on chante ou que l'on murmure, aident à apaiser le flot des pensées. Peu à peu, une sensation de calme et de clarté s'installe.",
    image: "/images/lieu2.png",
    imageAlt: "Salle de pratique lumineuse avec tapis de yoga",
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
    cta: { label: "Réserver votre place", href: "/reserver?offre=kundalini" },
  },
  bandeau: {
    image: "/images/yoga-nature.png",
    alt: "Lever de soleil sur la montagne",
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
  tarifs: "kundalini",
  infos: {
    lieu: "Le lundi à Géronce (salle municipale, centre bourg) et le mercredi à Oloron (Cèdre Bleu, 5 rue du Gouverneur Général Bordes), de 18 h 30 à 20 h.",
    contact: site.telephone,
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
  ctaPrincipal: { label: "Séance collective", href: "#tarifs" },
  ctaSecondaire: {
    label: "Séance individuelle",
    href: "/reserver?offre=perso",
  },
  intro: {
    titre: "Un yoga qui relie le corps, le cœur et l'esprit",
    paragraphes: [
      "Le Tantra Yoga est une approche globale : on ne cherche pas à dompter le corps ou le mental, mais à les écouter et à les mettre en harmonie. Postures, respiration, sons et méditation sont réunis dans une même pratique, pour vivre pleinement chaque sensation.",
      "C'est un yoga accessible, qui s'adresse aussi bien à celles et ceux qui découvrent qu'aux pratiquants réguliers. L'atelier se déroule à votre rythme, dans un cadre bienveillant, sans performance ni jugement.",
    ],
    cta: { label: "Voir les formules et tarifs", href: "#tarifs" },  },
  pratique: {
    titre: "Accueillir ce qui est, et le transformer en douceur",
    texte:
      "Dans le Tantra, rien n'est à rejeter : ni la fatigue, ni la tension, ni les émotions du moment. On les accueille, on respire avec elles, et la pratique aide peu à peu à les apaiser. Le lâcher-prise ne s'impose pas, il s'installe naturellement, séance après séance.",
    image: "/images/lieu3.png",
    imageAlt: "Groupe en méditation dans la salle de pratique",
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
    cta: { label: "Réserver votre place", href: "/reserver?offre=tantra" },
  },
  bandeau: {
    image: "/images/lieu2.png",
    alt: "La salle de pratique, lumineuse et chaleureuse",
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
  tarifs: "ateliers",
  infos: {
    lieu: site.adresse,
    contact: site.telephone,
  },
};

const nidra: ActivityPageData = {
  slug: "nidra",
  fond: "#F5F3E7",
  metaDescription:
    "Découvrez le Yoga Nidra, disponible uniquement en ligne : une relaxation guidée, allongé et sans effort, pour relâcher les tensions, apaiser le mental et vous ressourcer en profondeur.",
  titre: "Yoga Nidra",
  accroche:
    "Allongez-vous, laissez-vous guider et offrez à votre corps et à votre mental un vrai moment de repos, où que vous soyez, 100 % en ligne.",
  heroImage: "/images/yoga-n.png",
  heroAlt: "Ambiance douce et lumineuse pour un moment de relaxation",
  ctaPrincipal: { label: "Cours en ligne", href: "#tarifs" },
  ctaSecondaire: { label: "Essayer 7 jours gratuits", href: "/#abonnement" },
  intro: {
    titre: "Le repos profond, accessible à tous",
    paragraphes: [
      "Le Yoga Nidra, parfois appelé « sommeil yogique », est une pratique de relaxation guidée. Allongé, les yeux fermés, vous suivez la voix qui vous accompagne, entre l'état de veille et le sommeil, pendant que le corps se détend complètement.",
      "Il n'y a rien à réussir et aucune posture à tenir : il suffit de s'installer confortablement et de se laisser guider, à votre rythme, dans un cadre bienveillant et sans jugement.",
      "Le Yoga Nidra est proposé uniquement en ligne : vous le pratiquez depuis chez vous, quand vous le souhaitez, grâce aux relaxations guidées de votre espace personnel.",
    ],
    cta: { label: "Découvrir les abonnements", href: "#tarifs" },
    sousCta: "À votre rythme, sans pression",
  },
  pratique: {
    titre: "Un voyage guidé à l'intérieur de soi",
    texte:
      "La séance conduit l'attention de façon progressive : à travers le corps, le souffle, les sensations puis les images intérieures. Peu à peu, les tensions se relâchent, le mental ralentit et une sensation de calme profond s'installe, sans effort.",
    image: "/images/lieu3.png",
    imageAlt: "Groupe en méditation dans la salle de pratique",
  },
  deroule: {
    titre: "Le déroulé d'une séance",
    etapes: [
      {
        titre: "Installation",
        texte:
          "On s'allonge confortablement, couvert et bien soutenu, pour que le corps puisse se déposer complètement.",
      },
      {
        titre: "L'intention",
        texte:
          "Un temps pour choisir une intention simple, une phrase courte qui vous accompagne pendant la séance.",
      },
      {
        titre: "La rotation de conscience",
        texte:
          "La voix guide l'attention d'une partie du corps à l'autre, pour relâcher les tensions une à une.",
      },
      {
        titre: "Le souffle et les sensations",
        texte:
          "On observe la respiration et les sensations, sans rien chercher à changer, pour s'enfoncer dans le calme.",
      },
      {
        titre: "Les images intérieures",
        texte:
          "Un temps de visualisation guidée, pour laisser venir apaisement et ressourcement.",
      },
      {
        titre: "Le retour en douceur",
        texte:
          "On revient peu à peu au corps et à la pièce, pour repartir reposé et recentré.",
      },
    ],
    cta: { label: "Essayer 7 jours gratuits", href: "/#abonnement" },
  },
  bandeau: {
    image: "/images/replay.png",
    alt: "Pratiquer chez soi, en ligne",
  },
  pourQui:
    "Le Yoga Nidra est ouvert à toutes et à tous, quels que soient votre âge, votre condition physique ou votre expérience. Il se pratique allongé, sans effort ni souplesse, et aucune croyance n'est nécessaire : seulement l'envie de vous accorder une pause.",
  pourquoi: {
    intro: "Le Yoga Nidra peut vous aider à :",
    points: [
      "relâcher le stress et les tensions accumulées",
      "ralentir le mental et retrouver du calme",
      "favoriser un sommeil plus profond",
      "récupérer d'une période de fatigue",
      "mieux écouter votre corps",
      "vous accorder un vrai temps pour vous",
    ],
  },
  programme: [
    {
      titre: "La relaxation profonde",
      texte:
        "Une détente complète du corps, guidée pas à pas, pour relâcher les tensions sans effort.",
    },
    {
      titre: "La respiration",
      texte:
        "Observer le souffle et le laisser ralentir naturellement, pour apaiser le système nerveux.",
    },
    {
      titre: "La visualisation",
      texte:
        "Des images guidées pour se ressourcer et laisser venir un sentiment de sécurité et de calme.",
    },
    {
      titre: "L'intention",
      texte:
        "Choisir une intention simple et la poser en soi, pour que la pratique continue d'agir au quotidien.",
    },
  ],
  tarifs: "en-ligne",
  infos: {
    lieu: "En ligne, depuis votre espace personnel",
    contact: site.telephone,
  },
};

const therapie: ActivityPageData = {
  slug: "therapie-holistique",
  fond: "#F5F3E7",
  metaDescription:
    "Thérapie holistique : un accompagnement personnel qui prend en compte toutes les dimensions de l'être, physique, psychique et émotionnelle. Séance de 60 minutes sur rendez-vous.",
  titre: "Thérapie Holistique",
  accroche:
    "Un accompagnement personnel, pensé pour vous, qui prend en compte toutes les dimensions de l'être : physique, psychique et émotionnelle.",
  heroImage: "/images/therapie.png",
  heroAlt: "Moment d'écoute et d'accompagnement",
  ctaPrincipal: {
    label: "Réserver une séance",
    href: "/reserver?offre=therapie",
  },
  ctaSecondaire: { label: "Voir le tarif", href: "#tarifs" },
  intro: {
    titre: "Un accompagnement sur mesure",
    paragraphes: [
      "Dans un cadre bienveillant, chaque séance s'adapte à ce que vous traversez et à ce dont vous avez besoin.",
      "Découvrez comment cet accompagnement peut vous aider à avancer, à votre rythme.",
    ],
    cta: { label: "Réserver une séance", href: "/reserver?offre=therapie" },
  },
  pratique: {
    titre: "Une séance adaptée à vous",
    texte:
      "Chaque séance est adaptée à vous : à votre histoire, à votre rythme et à ce que vous souhaitez traverser. Que vous souhaitiez apaiser votre stress, mieux comprendre vos émotions, retrouver de l'énergie ou simplement prendre un temps pour vous, l'accompagnement s'ajuste à votre demande.",
    image: "/images/lieu1.jpg",
    imageAlt: "Chantal assise en tailleur dans la salle de pratique",
  },
  deroule: {
    titre: "Une approche globale",
    etapes: [
      {
        titre: "Le corps",
        texte:
          "L'écoute des tensions, de la fatigue et des signaux qu'il vous envoie.",
      },
      {
        titre: "Le mental",
        texte:
          "Prendre du recul sur les pensées qui tournent et retrouver de la clarté.",
      },
      {
        titre: "Les émotions",
        texte:
          "Les reconnaître, les accueillir et leur laisser de la place sans être submergé.",
      },
      {
        titre: "Un équilibre durable",
        texte:
          "Ces trois dimensions sont reliées : en prendre soin ensemble favorise un équilibre durable.",
      },
    ],
    cta: { label: "Prendre rendez-vous", href: "/reserver?offre=therapie" },
  },
  bandeau: {
    image: "/images/therapie.jpeg",
    alt: "Un temps d'écoute et d'échange",
  },
  pourQui:
    "Que vous souhaitiez apaiser votre stress, mieux comprendre vos émotions, retrouver de l'énergie ou simplement prendre un temps pour vous, l'accompagnement s'ajuste à votre demande. Un espace d'écoute sans jugement, où vous avancez à votre rythme.",
  pourquoi: {
    intro: "L'accompagnement peut vous aider à :",
    points: [
      "apaiser votre stress",
      "mieux comprendre vos émotions",
      "retrouver de l'énergie",
      "prendre du recul sur les pensées qui tournent",
      "retrouver de la clarté",
      "vous accorder un temps pour vous",
    ],
  },
  programme: [
    {
      titre: "Une séance adaptée à vous",
      texte:
        "À votre histoire, à votre rythme et à ce que vous souhaitez traverser.",
    },
    {
      titre: "Une approche globale",
      texte:
        "Le corps, le mental et les émotions sont pris en compte, sans les séparer.",
    },
    {
      titre: "Un espace d'écoute",
      texte: "Sans jugement, où vous avancez à votre rythme.",
    },
    {
      titre: "Un cadre bienveillant",
      texte:
        "Chaque séance s'adapte à ce que vous traversez et à ce dont vous avez besoin.",
    },
  ],
  tarifs: "therapie",
  infos: {
    contact: site.telephone,
  },
};

// Page de la thérapie holistique : affichée sur /therapie-holistique (et non dans /yoga/...).
export const therapiePage = therapie;

export const activityPages: Record<string, ActivityPageData> = {
  kundalini,
  tantra,
  nidra,
};