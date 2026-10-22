import type { Metadata } from "next";
import PageLegale from "@/components/PageLegale";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Mentions légales — ${site.nom}`,
  description: `Mentions légales du site ${site.nom} : éditeur, hébergeur, propriété intellectuelle.`,
};

export default function MentionsLegalesPage() {
  const a = site.association;
  return (
    <PageLegale titre="Mentions légales">
      <h2>Éditeur du site</h2>
      <p>
        <strong>{a.nom}</strong>, {a.forme}.
      </p>
      <ul>
        <li>Siège social : {a.siege}</li>
        <li>
          Numéro RNA : {a.rna} (déclaration en {a.prefecture}, le{" "}
          {a.declaration})
        </li>
        <li>
          E-mail : <a href={`mailto:${site.email}`}>{site.email}</a>
        </li>
        <li>Téléphone : {site.telephone}</li>
        {a.tva && <li>{a.tva}</li>}
      </ul>

      <h2>Responsable de la publication</h2>
      <p>{a.responsable}, représentante de l’association.</p>

      <h2>Hébergement</h2>
      <p>
        Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina,
        CA 91723, États-Unis (vercel.com).
      </p>

      <h2>Propriété intellectuelle</h2>
      <p>
        Les textes, photographies, vidéos, enregistrements audio, logos et
        l’ensemble des contenus du site sont la propriété de l’association ou
        de leurs auteurs, et sont protégés par le droit d’auteur. Toute
        reproduction, représentation ou diffusion, totale ou partielle, sans
        autorisation écrite préalable est interdite.
      </p>
      <p>
        Les contenus de l’espace en ligne (replays, relaxations audio, podcasts)
        sont réservés à un usage strictement personnel : ils ne peuvent être
        ni copiés, ni partagés, ni diffusés.
      </p>

      <h2>Responsabilité</h2>
      <p>
        L’association s’efforce de fournir des informations exactes et à jour,
        mais ne peut garantir l’absence d’erreur ou d’interruption du site. Le
        site peut contenir des liens vers d’autres sites dont l’association
        n’est pas responsable du contenu.
      </p>
      <p>
        Les pratiques proposées (yoga, relaxation, thérapie holistique) sont
        des activités de bien-être. Elles ne remplacent en aucun cas un avis,
        un diagnostic ou un traitement médical.
      </p>

      <h2>Données personnelles et cookies</h2>
      <p>
        Le traitement de vos données personnelles est détaillé dans notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>Droit applicable</h2>
      <p>
        Le site et ses mentions légales sont soumis au droit français. Pour
        toute question, vous pouvez nous écrire à{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </PageLegale>
  );
}