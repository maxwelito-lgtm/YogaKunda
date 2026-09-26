const valeurs = [
  {
    titre: "Conscience",
    texte:
      "Mettre de la lumière et de la clarté dans ses actions, dans sa parole, afin d'être témoin et d'accepter ce qui est, sans jugement.",
  },
  {
    titre: "Liberté",
    texte: "Être libre d'exister tel que l'on est, en toutes circonstances.",
  },
  {
    titre: "Créativité",
    texte:
      "Laisser sa créativité s'exprimer, laisser son enfant intérieur jouer avec ce qui est pour transformer la négativité.",
  },
  {
    titre: "Amour",
    texte: "Ouvrir toujours plus grand son cœur pour que l'amour devienne la boussole à suivre.",
  },
  {
    titre: "Humilité",
    texte:
      "Se rappeler que le plus grand des miracles est de ne pas chercher à en accomplir. L'extraordinaire est de rester ordinaire.",
  },
];

export default function EngagementSection() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h2 className="mb-10 text-4xl">Mon engagement</h2>
      <ul className="space-y-8 border-l-2 border-violet-light pl-6">
        {valeurs.map((v) => (
          <li key={v.titre}>
            <h3 className="text-lg text-violet-dark">{v.titre}</h3>
            <p className="mt-1 text-sm text-encre/80">{v.texte}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
