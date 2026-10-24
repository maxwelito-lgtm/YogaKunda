// Style des liens d'action (boutons) des pages Kundalini, Nidra, Ateliers et Thérapie :
// texte en capitales espacées, souligné d'un fin trait (comme « Découvrir » de l'accueil).
// - sombre : sur fond clair (crème, blanc)
// - clair  : sur une photo ou un fond foncé
// La zone cliquable déborde un peu du texte (pseudo-élément) pour rester facile à toucher.
const base =
  "relative inline-block border-b border-current pb-1 text-xs font-semibold uppercase tracking-[0.14em] transition-opacity hover:opacity-70 after:absolute after:-inset-x-2 after:-inset-y-3 after:content-['']";

export const lienCta = {
  sombre: `${base} text-[#2B1F19]`,
  clair: `${base} text-white [text-shadow:0_1px_8px_rgba(0,0,0,0.45)]`,
};
