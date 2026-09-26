type Seance = {
  discipline: string;
  duree: string;
  phases: string[];
  note?: string;
};

const seances: Seance[] = [
  {
    discipline: "Kundalini Yoga",
    duree: "1h15",
    phases: [
      "Un temps d'accueil et de mise en conscience du souffle",
      "Un kriya : série de postures dynamiques ciblées",
      "Une relaxation profonde",
      "Une méditation de clôture",
    ],
  },
  {
    discipline: "Tantra Yoga",
    duree: "1h15",
    phases: [
      "Un kriya court : série de postures",
      "Une phase de « danse » méditative",
      "Une relaxation",
      "Une méditation active",
      "Une méditation silencieuse",
    ],
    note: "Chaque séance se pratique avec un même mantra pour la danse méditative, la relaxation et la méditation, et aborde une thématique différente.",
  },
];

export default function DerouleSeance() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <h2 className="mb-8 text-center text-4xl">Déroulé de la séance</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {seances.map((s) => (
          <div key={s.discipline} className="rounded-2xl bg-white p-6 shadow-sm">
            <h3 className="text-xl text-violet-dark">{s.discipline}</h3>
            <p className="mt-1 text-sm text-encre/60">Durée : {s.duree}</p>
            <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-encre/80">
              {s.phases.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ol>
            {s.note && (
              <p className="mt-4 text-xs italic text-encre/60">{s.note}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
