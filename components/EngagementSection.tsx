const valeurs = [
  {
    titre: "Conscience",
    texte:
      "Chaque cours est pensé avec attention, pour rester à l'écoute de ce que vous vivez, ici et maintenant.",
  },
  {
    titre: "Liberté",
    texte:
      "Vous avancez à votre rythme, sans pression ni comparaison — chaque corps, chaque histoire est respectée.",
  },
  {
    titre: "Créativité",
    texte:
      "Les séances évoluent au fil du temps, pour que la pratique reste vivante et proche de ce dont vous avez besoin.",
  },
  {
    titre: "Amour",
    texte:
      "Vous êtes accueilli avec bienveillance, sans jugement — un espace pensé pour que vous puissiez simplement être vous-même.",
  },
  {
    titre: "Humilité",
    texte:
      "Le yoga se transmet avec sincérité et simplicité, sans grandes promesses — juste un accompagnement honnête, pas à pas.",
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
