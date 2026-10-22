// Petits outils pour le calendrier des cours. Les dates sont des textes « AAAA-MM-JJ »
// (pas de fuseau horaire à gérer) et les heures des textes « HH:MM ».

export type Cours = {
  id: string;
  lieu: string;
  jour: string; // AAAA-MM-JJ
  heure_debut: string; // HH:MM:SS
  heure_fin: string;
  statut: "prevu" | "annule" | "deplace";
  places: number | null;
  complet: boolean;
  note: string | null;
  jour_initial: string | null;
};

export const DATE_ISO = /^\d{4}-\d{2}-\d{2}$/;
export const MOIS_ISO = /^\d{4}-(0[1-9]|1[0-2])$/;
export const HEURE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const UUID = /^[0-9a-fA-F-]{36}$/;

function enDate(iso: string): Date {
  return new Date(`${iso}T12:00:00Z`);
}

// Aujourd'hui, à l'heure de Paris, au format AAAA-MM-JJ.
export function aujourdhui(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(new Date());
}

export function ajouterJours(iso: string, n: number): string {
  const d = enDate(iso);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

// 0 = lundi ... 6 = dimanche
export function jourSemaine(iso: string): number {
  return (enDate(iso).getUTCDay() + 6) % 7;
}

export function jourLong(iso: string): string {
  return enDate(iso).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function jourCourt(iso: string): string {
  return enDate(iso).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function nomMois(mois: string): string {
  const t = enDate(`${mois}-01`).toLocaleDateString("fr-FR", {
    timeZone: "UTC",
    month: "long",
    year: "numeric",
  });
  return t.charAt(0).toUpperCase() + t.slice(1);
}

export function moisDecale(mois: string, n: number): string {
  const [a, m] = mois.split("-").map(Number);
  const d = new Date(Date.UTC(a, m - 1 + n, 1, 12));
  return d.toISOString().slice(0, 7);
}

export function heureFr(h: string): string {
  const [hh, mm] = h.split(":");
  return mm === "00" ? `${Number(hh)} h` : `${Number(hh)} h ${mm}`;
}

export function heureCourte(h: string): string {
  return h.slice(0, 5);
}