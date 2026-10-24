// Données structurées pour Google. Le composant n'affiche rien à l'écran.
export default function JsonLd({ data }: { data: object }) {
  // "<" est échappé pour que le contenu ne puisse jamais refermer la balise script.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
