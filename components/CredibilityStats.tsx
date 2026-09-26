export default function CredibilityStats() {
  const stats = [
    { chiffre: "5+", label: "ans d'expérience" },
    { chiffre: "80+", label: "élèves accompagnés" },
    { chiffre: "2", label: "disciplines enseignées" },
    { chiffre: "100%", label: "présentiel & en ligne" },
  ];

  return (
    <section className="bg-violet-light/40 px-4 py-10 sm:px-6">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 text-center sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <p className="font-display text-3xl italic text-violet-dark sm:text-4xl">
              {s.chiffre}
            </p>
            <p className="mt-1 text-xs text-encre/70 sm:text-sm">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}