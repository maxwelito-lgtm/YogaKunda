export type CategorieId = "direct" | "replays" | "podcasts" | "nidra";

export const CATEGORIES: { id: CategorieId; titre: string }[] = [
  { id: "direct", titre: "Cours en direct" },
  { id: "replays", titre: "Replays" },
  { id: "podcasts", titre: "Podcasts Enseignements" },
  { id: "nidra", titre: "Yoga Nidra" },
];

export type Cours = {
  id: string;
  categorie: CategorieId;
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