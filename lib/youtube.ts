// Extrait l'identifiant d'une vidéo YouTube depuis n'importe quel lien classique
// (partage mobile, adresse du navigateur, lien court, intégration…).
export function extraireIdYoutube(lien: string): string | null {
  const texte = lien.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(texte)) return texte;

  let url: URL;
  try {
    url = new URL(texte);
  } catch {
    return null;
  }

  const hote = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  let id: string | null = null;

  if (hote === "youtu.be") {
    id = url.pathname.slice(1).split("/")[0] || null;
  } else if (hote === "youtube.com" || hote === "youtube-nocookie.com") {
    if (url.pathname === "/watch") {
      id = url.searchParams.get("v");
    } else {
      const m = url.pathname.match(/^\/(?:embed|live|shorts|v)\/([A-Za-z0-9_-]{11})/);
      id = m ? m[1] : null;
    }
  }

  return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
}