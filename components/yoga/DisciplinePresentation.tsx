type Discipline = {
  nom: string;
  accroche: string;
  texte: string;
  image: string;
  anchor: string;
};

const disciplines: Discipline[] = [
  {
    nom: "Kundalini Yoga",
    accroche: "Le yoga pour l'éveil de l'énergie créatrice",
    texte:
      "Au-delà de l'équilibre entre le corps et l'esprit, cette pratique agit comme une véritable science pour révéler votre plein potentiel et régule le système nerveux, vers une meilleure connaissance de soi. Accessible à toutes et tous.",
    image: "https://picsum.photos/seed/kundalini-detail/700/500",
    anchor: "kundalini",
  },
  {
    nom: "Tantra Yoga",
    accroche: "Le yoga holistique par excellence",
    texte:
      "Un yoga complet pour cultiver le lâcher-prise, pacifier le mental et apporter un apaisement émotionnel profond, dans la paix, la joie et l'ouverture du cœur. Accessible à toutes et tous.",
    image: "https://picsum.photos/seed/tantra-detail/700/500",
    anchor: "tantra",
  },
];

export default function DisciplinePresentation() {
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
      <h2 className="mb-8 text-center text-4xl">Les pratiques</h2>
      <div className="space-y-14">
        {disciplines.map((d, i) => (
          <article
            key={d.nom}
            id={d.anchor}
            className={`flex flex-col items-center gap-8 md:flex-row ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <img
              src={d.image}
              alt={d.nom}
              className="h-64 w-full rounded-2xl object-cover md:w-1/2"
            />
            <div className="md:w-1/2">
              <h3 className="text-2xl">{d.nom}</h3>
              <p className="mt-1 font-display italic text-violet-dark">
                {d.accroche}
              </p>
              <p className="mt-3 text-encre/80">{d.texte}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
