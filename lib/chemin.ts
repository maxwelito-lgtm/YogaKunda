// Ne laisse passer que des chemins internes au site (« /mon-espace », « /reserver?offre=... »).
// Refuse les adresses externes, « // », « /\ » (que les navigateurs lisent comme « // »),
// les antislash et les caractères de contrôle.
export function cheminInterne(valeur: string | null | undefined, defaut = "/mon-espace"): string {
  if (!valeur) return defaut;
  if (!valeur.startsWith("/")) return defaut;
  if (valeur.startsWith("//") || valeur.startsWith("/\\")) return defaut;
  if (/[\\\u0000-\u001F\u007F]/.test(valeur)) return defaut;
  return valeur;
}
