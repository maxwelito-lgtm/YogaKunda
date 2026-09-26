type Creneau = {
  jour: string;
  horaires: { heure: string; cours: string; type: "presentiel" | "en_ligne" }[];
};

const planning: Creneau[] = [
  {
    jour: "Mardi",
    horaires: [
      { heure: "10h00 – 11h15", cours: "Kundalini Yoga", type: "presentiel" },
      { heure: "18h00 – 19h15", cours: "Tantra Yoga", type: "presentiel" },
      { heure: "19h30 – 20h45", cours: "Kundalini Yoga", type: "presentiel" },
    ],
  },
  {
    jour: "Mercredi",
    horaires: [
      { heure: "09h00 – 10h15", cours: "Kundalini Yoga", type: "en_ligne" },
      { heure: "11h00 – 12h15", cours: "Tantra Yoga", type: "en_ligne" },
    ],
  },
  {
    jour: "Jeudi",
    horaires: [
      { heure: "18h00 – 19h15", cours: "Kundalini Yoga", type: "presentiel" },
      { heure: "19h30 – 20h45", cours: "Kundalini Yoga", type: "presentiel" },
    ],
  },
];

export default function PlanningSection() {
  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 sm:px-6">
      <p className="mb-2 text-center text-sm text-encre/70">
        Saison 2026–2027 · du 08 septembre au 15 juillet
      </p>
      <p className="mx-auto mb-8 max-w-xl text-center text-sm text-encre/70">
        Afin de préserver une atmosphère chaleureuse et à taille humaine, le
        nombre de participants par cours est limité.
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {planning.map((jour) => (
          <div key={jour.jour} className="rounded-2xl bg-white p-5 shadow-sm">
            <h3 className="mb-3 text-lg text-violet-dark">{jour.jour}</h3>
            <ul className="space-y-2 text-sm">
              {jour.horaires.map((h) => (
                <li key={h.heure} className="flex flex-col">
                  <span className="font-medium">{h.heure}</span>
                  <span className="text-encre/70">
                    {h.cours}
                    {h.type === "en_ligne" && (
                      <span className="ml-1 text-xs text-sauge">(en ligne)</span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-encre/70">
        Les cours ont lieu à Espace [Nom du lieu], 40 Boulevard René
        Chabasse, 16000 Angoulême.
      </p>
    </section>
  );
}
