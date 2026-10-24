// Pages « Cours de yoga à Oloron » et « à Géronce ».
// Les horaires, salles et adresses viennent de data/lieux.ts ; ici, seulement les textes de la page.
// Les textes sont provisoires : à remplacer par ceux de Chantal (mêmes champs, même mise en page).
import type { LieuId } from "@/data/lieux";

export type Question = { question: string; reponse: string };

export type PageLieu = {
  lieuId: LieuId;
  chemin: string;
  villeComplete: string; // nom de la commune pour le titre et Google
  metaTitre: string;
  metaDescription: string;
  titre: string;
  accroche: string;
  heroImage: string; // photo de la salle : à remplacer quand les vraies photos seront prêtes
  heroAlt: string;
  introTitre: string;
  intro: string[];
  questions: Question[];
};

const questionsCommunes = (jour: string): Question[] => [
  {
    question: "Faut-il avoir déjà pratiqué le yoga ?",
    reponse:
      "Non. Nul besoin d'être souple ni d'avoir déjà pratiqué : chaque posture s'adapte à votre corps, et vous avancez à votre rythme, dans un cadre bienveillant et sans jugement.",
  },
  {
    question: "Quand a lieu le cours ?",
    reponse: `Chaque ${jour}, de 18 h 30 à 20 h, pendant l'année scolaire.`,
  },
  {
    question: "Comment réserver ?",
    reponse:
      "Sur la page Dates & tarifs : vous choisissez votre formule (au cours, au trimestre ou à l'année) et vous payez en ligne en toute sécurité.",
  },
  {
    question: "Puis-je poser une question avant de venir ?",
    reponse:
      "Oui. Chantal répond volontiers par téléphone ou par message : la page Nous contacter donne ses coordonnées.",
  },
];

export const pagesLieux: PageLieu[] = [
  {
    lieuId: "oloron",
    chemin: "/cours-yoga-oloron",
    villeComplete: "Oloron-Sainte-Marie",
    metaTitre: "Cours de yoga Kundalini à Oloron-Sainte-Marie — Shantalam",
    metaDescription:
      "Cours collectif de Kundalini Yoga chaque mercredi de 18 h 30 à 20 h au Cèdre Bleu, à Oloron-Sainte-Marie, avec Chantal Lassier. Ouvert à tous, sans expérience.",
    titre: "Yoga Kundalini à Oloron-Sainte-Marie",
    accroche: "Un cours collectif chaque mercredi soir, de 18 h 30 à 20 h, au Cèdre Bleu.",
    heroImage: "/images/kundalini.webp",
    heroAlt: "Ambiance paisible et lumineuse pour une pratique de yoga",
    introTitre: "Votre cours de Kundalini Yoga à Oloron",
    intro: [
      "Chaque mercredi, de 18 h 30 à 20 h, Chantal Lassier vous accueille au Cèdre Bleu, au 5 rue du Gouverneur Général Bordes, pour un cours collectif de Kundalini Yoga.",
      "Respiration, mouvements, sons et méditation : chaque séance s'adapte à votre corps. Nul besoin d'être souple ni d'avoir déjà pratiqué.",
    ],
    questions: [
      ...questionsCommunes("mercredi"),
      {
        question: "Où se déroule le cours à Oloron ?",
        reponse: "Au Cèdre Bleu, 5 rue du Gouverneur Général Bordes, à Oloron-Sainte-Marie.",
      },
    ],
  },
  {
    lieuId: "geronce",
    chemin: "/cours-yoga-geronce",
    villeComplete: "Géronce",
    metaTitre: "Cours de yoga Kundalini à Géronce — Shantalam",
    metaDescription:
      "Cours collectif de Kundalini Yoga chaque lundi de 18 h 30 à 20 h à la salle municipale de Géronce, avec Chantal Lassier. Ouvert à tous, sans expérience.",
    titre: "Yoga Kundalini à Géronce",
    accroche: "Un cours collectif chaque lundi soir, de 18 h 30 à 20 h, à la salle municipale.",
    heroImage: "/images/kundalini.webp",
    heroAlt: "Ambiance paisible et lumineuse pour une pratique de yoga",
    introTitre: "Votre cours de Kundalini Yoga à Géronce",
    intro: [
      "Chaque lundi, de 18 h 30 à 20 h, Chantal Lassier vous accueille à la salle municipale, au centre du bourg de Géronce, pour un cours collectif de Kundalini Yoga.",
      "Respiration, mouvements, sons et méditation : chaque séance s'adapte à votre corps. Nul besoin d'être souple ni d'avoir déjà pratiqué.",
    ],
    questions: [
      ...questionsCommunes("lundi"),
      {
        question: "Où se déroule le cours à Géronce ?",
        reponse: "À la salle municipale, au centre du bourg de Géronce.",
      },
    ],
  },
];

export function lirePageLieu(lieuId: LieuId): PageLieu {
  return pagesLieux.find((p) => p.lieuId === lieuId)!;
}
