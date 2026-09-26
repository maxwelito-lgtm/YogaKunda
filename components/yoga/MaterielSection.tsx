const materiel = [
  "Un tapis de yoga",
  "Une tenue confortable, de préférence claire",
  "Un coussin ou une couverture pour les phases de relaxation",
  "Une bouteille d'eau",
];

export default function MaterielSection() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-16 sm:px-6">
      <h2 className="mb-6 text-center text-3xl">
        Pour pratiquer, vous avez besoin de
      </h2>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {materiel.map((item) => (
          <li
            key={item}
            className="rounded-xl bg-white px-4 py-3 text-sm shadow-sm"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
