import type { Cours } from "@/lib/espace";

function Cadenas({ taille = 20 }: { taille?: number }) {
  return (
    <svg
      width={taille}
      height={taille}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#75523F"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function Lecture({ taille = 20 }: { taille?: number }) {
  return (
    <svg width={taille} height={taille} viewBox="0 0 24 24" fill="#75523F" aria-hidden="true">
      <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
    </svg>
  );
}

const teintes = ["#E3D5C4", "#D8C3AE", "#CDB59C", "#E7DFCC"];

export default function CarteCours({
  cours,
  index,
  verrouille,
}: {
  cours: Cours;
  index: number;
  verrouille: boolean;
}) {
  const meta = [
    cours.type === "video" ? "Vidéo" : "Audio",
    cours.duree_minutes ? `${cours.duree_minutes} min` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <div
        className="relative h-28 overflow-hidden"
        style={{ backgroundColor: teintes[index % teintes.length] }}
      >
        {verrouille && (
          <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#75523F]/45 blur-[14px]" />
        )}

        {verrouille && cours.extrait_ref && (
          <span className="absolute bottom-2.5 left-2.5 inline-flex items-center gap-1.5 rounded-pill bg-encre/80 px-2.5 py-1 text-[11px] font-semibold text-[#F5F3E7]">
            <Lecture taille={11} />
            Extrait gratuit · 20 s
          </span>
        )}

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90">
            {verrouille ? <Cadenas /> : <Lecture />}
          </span>
        </div>
      </div>

      <div className="px-4 pb-4 pt-3">
        <p className="text-[15px] font-semibold text-encre">{cours.titre}</p>
        <p className="mt-0.5 text-[13px] text-encre/70">{meta}</p>
      </div>
    </div>
  );
}