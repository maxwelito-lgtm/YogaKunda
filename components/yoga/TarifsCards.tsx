type Formule = {
  label: string;
  unCours: string;
  deuxCours: string;
};

const anneeFormules: Formule[] = [
  { label: "Tarif normal", unCours: "350 €", deuxCours: "520 €" },
  { label: "Tarif réduit *", unCours: "300 €", deuxCours: "450 €" },
];

const trimestreFormules: Formule[] = [
  { label: "Tarif normal", unCours: "130 €", deuxCours: "190 €" },
  { label: "Tarif réduit *", unCours: "110 €", deuxCours: "160 €" },
];

function FormuleBlock({ titre, formules }: { titre: string; formules: Formule[] }) {
  return (
    <div className="rounded-2xl border-2 border-violet-light bg-violet-light/40 p-6">
      <h3 className="text-xl text-violet-dark">{titre}</h3>
      <div className="mt-4 space-y-4">
        {formules.map((f) => (
          <div key={f.label}>
            <p className="font-medium text-violet-dark">{f.label}</p>
            <div className="mt-1 flex flex-col gap-1 text-sm sm:flex-row sm:gap-6">
              <span>1 cours / semaine — <strong>{f.unCours}</strong></span>
              <span>2 cours / semaine — <strong>{f.deuxCours}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TarifsCards() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h2 className="mb-6 text-center text-4xl">Tarifs &amp; planning</h2>

      {/* Bandeau d'alerte — rouge, réservé aux annonces importantes */}
      <div className="mb-8 rounded-xl bg-alerte px-4 py-3 text-center text-sm font-semibold text-white sm:px-6">
        Nouveau ! Les chèques vacances sont acceptés
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <FormuleBlock titre="À l'année" formules={anneeFormules} />
        <FormuleBlock titre="Au trimestre" formules={trimestreFormules} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
          <p className="text-lg">Carte 10 cours</p>
          <p className="mt-1 text-2xl text-violet-dark">160 €</p>
        </div>
        <div className="rounded-2xl bg-sauge/20 p-6 text-center shadow-sm">
          <p className="font-display text-lg italic text-sauge">
            1er cours d&rsquo;essai gratuit
          </p>
        </div>
      </div>

      <p className="mt-4 text-xs text-encre/60">
        * Tarif réduit : étudiants, situations précaires, groupes.
      </p>
    </section>
  );
}
