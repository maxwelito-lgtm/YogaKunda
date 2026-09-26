export default function CredibilityStats() {
  const stats = [
    { chiffre: "8+", label: "ans d'expérience" },
    { chiffre: "80+", label: "élèves accompagnés" },
    { chiffre: "5", label: "disciplines enseignées" },
    { chiffre: "100%", label: "présentiel & en ligne" },
  ];

  return (
    <section className="bg-violet-light/40 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col items-center">
            <div className="mb-1 flex items-center gap-1.5">
              <CheckBadge />
              <p className="font-display text-3xl italic text-encre sm:text-4xl">
                {s.chiffre}
              </p>
            </div>
            <p className="text-xs text-encre/70 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function CheckBadge() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-sauge"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.15" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}