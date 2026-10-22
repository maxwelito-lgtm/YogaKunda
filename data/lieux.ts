// Les lieux des cours de Kundalini. Chaque lieu a son jour de la semaine et ses horaires habituels.

export type LieuId = "geronce" | "oloron";

export type Lieu = {
  id: LieuId;
  ville: string;
  jourSemaine: 1 | 3; // 1 = lundi, 3 = mercredi
  jourNom: string;
  salle: string;
  adresse: string;
  debut: string; // HH:MM
  fin: string; // HH:MM
};

export const lieux: Lieu[] = [
  {
    id: "geronce",
    ville: "Géronce",
    jourSemaine: 1,
    jourNom: "lundi",
    salle: "Salle municipale",
    adresse: "Centre bourg, Géronce",
    debut: "18:30",
    fin: "20:00",
  },
  {
    id: "oloron",
    ville: "Oloron",
    jourSemaine: 3,
    jourNom: "mercredi",
    salle: "Cèdre Bleu",
    adresse: "5 rue du Gouverneur Général Bordes, Oloron-Sainte-Marie",
    debut: "18:30",
    fin: "20:00",
  },
];

export function lireLieu(valeur?: string | null): Lieu {
  return lieux.find((l) => l.id === valeur) ?? lieux[0];
}

export function lieuValide(valeur: unknown): valeur is LieuId {
  return lieux.some((l) => l.id === valeur);
}