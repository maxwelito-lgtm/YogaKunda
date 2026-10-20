export type CategorieId = "replays" | "podcasts";
export type SousCategorieId = "nidra" | "kundalini" | "divers";

export const CATEGORIES: { id: CategorieId; titre: string }[] = [
  { id: "replays", titre: "Replays des cours" },
  { id: "podcasts", titre: "Podcasts" },
];

// Filtres des replays
export const SOUS_CATEGORIES: { id: SousCategorieId; titre: string }[] = [
  { id: "nidra", titre: "Yoga Nidra" },
  { id: "kundalini", titre: "Kundalini Yoga" },
  { id: "divers", titre: "Divers" },
];

export type Cours = {
  id: string;
  categorie: CategorieId;
  sous_categorie: SousCategorieId | null;
  titre: string;
  description: string | null;
  type: "video" | "audio";
  duree_minutes: number | null;
  extrait_ref: string | null;
};

// Un abonnement donne accès s'il est en essai ou actif, et pas échu.
export function estAbonne(
  abo: { statut: string; fin_periode: string | null } | null
): boolean {
  if (!abo) return false;
  if (abo.statut !== "essai" && abo.statut !== "actif") return false;
  return !abo.fin_periode || new Date(abo.fin_periode) > new Date();
}