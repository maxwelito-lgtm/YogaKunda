import type { Metadata } from "next";
import PageLegale from "@/components/PageLegale";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Politique de confidentialité — ${site.nom}`,
  description: `Comment ${site.nom} utilise et protège vos données personnelles.`,
};

export default function ConfidentialitePage() {
  const a = site.association;
  return (
    <PageLegale titre="Politique de confidentialité" misAJour="22 octobre 2026">
      <p>
        Cette page explique quelles données personnelles nous collectons sur ce
        site, pourquoi, et quels sont vos droits.
      </p>

      <h2>Qui est responsable de vos données ?</h2>
      <p>
        <strong>{a.nom}</strong>, {a.forme}, {a.siege} (RNA {a.rna}). Contact :{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>

      <h2>Les données que nous collectons</h2>
      <ul>
        <li>
          <strong>Votre compte</strong> : prénom, nom, adresse e-mail et mot de
          passe (conservé sous forme chiffrée), date d’acceptation des
          conditions de vente.
        </li>
        <li>
          <strong>Vos réservations et paiements</strong> : prestation choisie,
          montant, date, numéro de téléphone que vous indiquez au moment du
          paiement. Les données de carte bancaire sont saisies directement chez
          Stripe : nous n’y avons jamais accès.
        </li>
        <li>
          <strong>Votre abonnement</strong> : formule, statut et dates de période.
        </li>
        <li>
          <strong>Vos messages</strong> : ce que vous nous écrivez via le
          formulaire de contact.
        </li>
        <li>
          <strong>La newsletter</strong> : votre adresse e-mail, si vous vous y
          inscrivez.
        </li>
      </ul>

      <h2>Pourquoi, et sur quelle base légale ?</h2>
      <ul>
        <li>
          Créer et gérer votre compte, traiter vos réservations et votre
          abonnement, vous envoyer les e-mails de confirmation et vous rappeler
          pour fixer la date de votre séance : <em>exécution du contrat</em>.
        </li>
        <li>
          Conserver les justificatifs de vente et respecter nos obligations
          comptables : <em>obligation légale</em>.
        </li>
        <li>
          Répondre à vos messages : <em>intérêt légitime</em>.
        </li>
        <li>
          Vous envoyer la newsletter : <em>votre consentement</em>, que vous
          pouvez retirer à tout moment.
        </li>
      </ul>

      <h2>Qui reçoit vos données ?</h2>
      <p>
        Seule l’association y accède pour son activité. Nous faisons appel à des
        prestataires techniques, qui traitent les données uniquement pour notre
        compte :
      </p>
      <ul>
        <li>Vercel : hébergement du site ;</li>
        <li>Supabase : base de données et authentification des comptes ;</li>
        <li>Stripe : paiement sécurisé et gestion des abonnements ;</li>
        <li>Resend : envoi des e-mails du site.</li>
      </ul>
      <p>
        Certains de ces prestataires peuvent traiter des données en dehors de
        l’Union européenne. Ils s’engagent alors à offrir des garanties
        appropriées, comme les clauses contractuelles types de la Commission
        européenne. Nous ne vendons ni ne louons vos données.
      </p>

      <h2>Combien de temps les conservons-nous ?</h2>
      <ul>
        <li>
          Compte et abonnement : tant que votre compte est actif, puis jusqu’à
          3 ans après votre dernière activité, ou jusqu’à votre demande de
          suppression.
        </li>
        <li>
          Justificatifs de paiement et données comptables : 10 ans (obligation
          légale).
        </li>
        <li>Messages du formulaire de contact : 3 ans après le dernier échange.</li>
        <li>Newsletter : jusqu’à votre désinscription.</li>
      </ul>

      <h2>Vos droits</h2>
      <p>
        Vous pouvez à tout moment demander l’accès à vos données, leur
        rectification, leur effacement, la limitation ou l’opposition à leur
        traitement, ainsi que leur portabilité. Écrivez-nous à{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> : nous répondons dans
        un délai d’un mois. Si vous estimez que vos droits ne sont pas
        respectés, vous pouvez saisir la CNIL (cnil.fr).
      </p>

      <h2>Cookies</h2>
      <p>
        À ce jour, le site n’utilise que les cookies nécessaires à son
        fonctionnement, notamment pour vous garder connecté(e) à votre espace.
        Il n’utilise ni cookie publicitaire ni outil de suivi d’audience. Ces
        cookies techniques ne nécessitent pas votre consentement.
      </p>

      <h2>Modifications</h2>
      <p>
        Nous pouvons mettre à jour cette politique ; la date de la version
        figure en haut de la page.
      </p>
    </PageLegale>
  );
}