// Tarifs et formules de Shantalam : seule source de vérité.
// Pour changer un prix, la durée d'un trimestre ou la réduction, c'est ici et nulle part ailleurs.

export const SEMAINES_TRIMESTRE = 12;
export const SEMAINES_ANNEE = 31; // année scolaire : septembre à juin (calendrier de Chantal)
export const REDUCTION_TRIMESTRE = 0.1; // 10 % (ateliers : forfait calculé)

export type OffreId = "kundalini" | "tantra" | "atelier" | "perso" | "therapie";
export type Formule = "cours" | "trim" | "annee";
export type Rythme = 1 | 2;

export type Offre = {
  id: OffreId;
  nom: string;
  sous: string;
  prixUnitaire: number; // en euros
  rythmeChoisi: boolean; // la personne peut choisir 1 ou 2 cours par semaine
  trimestre: boolean; // une formule trimestre existe
  annee: boolean; // une formule « année scolaire » existe
  // Prix fixes des forfaits (en euros), selon le nombre de cours par semaine.
  // Sans cette table, le forfait trimestre est calculé (prix × semaines − réduction).
  forfaits?: Partial<Record<"trim" | "annee", Record<Rythme, number>>>;
  unite: string; // "cours" ou "séance"
};

export const offres: Offre[] = [
  {
    id: "kundalini",
    nom: "Cours de Kundalini",
    sous: "En groupe · lundi à Géronce, mercredi à Oloron, de 18 h 30 à 20 h",
    prixUnitaire: 15,
    rythmeChoisi: true,
    trimestre: true,
    annee: true,
    forfaits: {
      trim: { 1: 110, 2: 165 },
      annee: { 1: 305, 2: 450 },
    },
    unite: "cours",
  },
  {
    id: "tantra",
    nom: "Atelier Tantra",
    sous: "En groupe · le lundi · 2 h",
    prixUnitaire: 20,
    rythmeChoisi: false,
    trimestre: true,
    annee: false,
    unite: "séance",
  },
  {
    id: "atelier",
    nom: "Atelier Kundalini",
    sous: "En groupe · le samedi · 3 h",
    prixUnitaire: 30,
    rythmeChoisi: false,
    trimestre: true,
    annee: false,
    unite: "séance",
  },
  {
    id: "perso",
    nom: "Séance personnalisée",
    sous: "Sur rendez-vous · déplacement compris",
    prixUnitaire: 60,
    rythmeChoisi: false,
    trimestre: false,
    annee: false,
    unite: "séance",
  },
  {
    id: "therapie",
    nom: "Thérapie holistique",
    sous: "Sur rendez-vous",
    prixUnitaire: 60,
    rythmeChoisi: false,
    trimestre: false,
    annee: false,
    unite: "séance",
  },
];

export function getOffre(id: OffreId): Offre {
  return offres.find((o) => o.id === id) ?? offres[0];
}

// Lecture sécurisée des valeurs reçues dans l'adresse de la page.
export function lireOffre(valeur?: string): OffreId {
  return offres.some((o) => o.id === valeur) ? (valeur as OffreId) : "kundalini";
}
export function lireFormule(valeur?: string): Formule {
  return valeur === "trim" || valeur === "annee" ? valeur : "cours";
}
export function lireRythme(valeur?: string): Rythme {
  return valeur === "2" ? 2 : 1;
}

export type Calcul = {
  total: number; // montant à payer, en euros
  plein: number; // montant sans réduction
  economie: number;
  seances: number;
  parSeance: number;
};

// Le même calcul sert à l'affichage et, plus tard, au paiement (côté serveur).
export function calculer(offre: Offre, formule: Formule, rythme: Rythme): Calcul {
  const n = offre.rythmeChoisi ? rythme : 1;

  // Forfait à prix fixe (trimestre ou année) : le prix est dans la table de l'offre.
  const forfait = formule === "cours" ? undefined : offre.forfaits?.[formule];
  if (forfait) {
    const seances = (formule === "annee" ? SEMAINES_ANNEE : SEMAINES_TRIMESTRE) * n;
    const total = forfait[n === 2 ? 2 : 1];
    const plein = offre.prixUnitaire * seances;
    return {
      total,
      plein,
      economie: Math.round((plein - total) * 100) / 100,
      seances,
      parSeance: total / seances,
    };
  }

  const trim = formule === "trim" && offre.trimestre;

  if (trim) {
    const seances = SEMAINES_TRIMESTRE * n;
    const plein = offre.prixUnitaire * seances;
    const total = Math.round(plein * (1 - REDUCTION_TRIMESTRE) * 100) / 100;
    return {
      total,
      plein,
      economie: Math.round((plein - total) * 100) / 100,
      seances,
      parSeance: total / seances,
    };
  }

  const total = offre.prixUnitaire * n;
  return { total, plein: total, economie: 0, seances: n, parSeance: offre.prixUnitaire };
}

// Pourcentage d'économie d'un forfait (pour les étiquettes « −39 % »).
export function pourcentEconomie(c: Calcul): number {
  return c.plein > 0 ? Math.round((c.economie / c.plein) * 100) : 0;
}

export function euros(montant: number): string {
  const r = Math.round(montant * 100) / 100;
  return (Number.isInteger(r) ? String(r) : r.toFixed(2).replace(".", ",")) + "\u00A0€";
}

export function enCentimes(montant: number): number {
  return Math.round(montant * 100);
}
// Abonnement en ligne (cours en direct, replays, relaxations audio, Yoga Nidra)
export const ABONNEMENT = {
  mensuel: 20, // € par mois
  annuel: 204, // € par an
  essaiJours: 7,
};