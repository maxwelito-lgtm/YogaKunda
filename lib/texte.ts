// Nettoie un nom saisi par une personne (prénom, nom) avant de l'afficher ou de l'écrire
// dans un e-mail : ces champs peuvent être modifiés directement par la personne.
// Retire les retours à la ligne et caractères de contrôle, replie les espaces, limite la longueur.
export function nettoyerNom(valeur: unknown, max = 60): string {
  if (typeof valeur !== "string") return "";
  return valeur
    .replace(/[\u0000-\u001F\u007F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

// Prénom + nom nettoyés, séparés par une espace.
export function nomComplet(meta: { prenom?: unknown; nom?: unknown } | null | undefined): string {
  return [nettoyerNom(meta?.prenom, 40), nettoyerNom(meta?.nom, 60)].filter(Boolean).join(" ");
}
