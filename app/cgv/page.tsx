import type { Metadata } from "next";
import PageLegale from "@/components/PageLegale";
import { site } from "@/site.config";
import {
  offres,
  euros,
  ABONNEMENT,
  SEMAINES_TRIMESTRE,
  REDUCTION_TRIMESTRE,
} from "@/data/offres";

export const metadata: Metadata = {
  title: `Conditions générales de vente — ${site.nom}`,
  description: `Conditions générales de vente de ${site.nom} : prix, paiement, annulation, abonnement.`,
};

export default function CgvPage() {
  const a = site.association;
  const reduction = Math.round(REDUCTION_TRIMESTRE * 100);

  return (
    <PageLegale titre="Conditions générales de vente" misAJour="22 octobre 2026">
      <h2>1. Qui vend ?</h2>
      <p>
        Les présentes conditions régissent les ventes réalisées sur ce site par{" "}
        <strong>{a.nom}</strong>, {a.forme}, dont le siège social est situé {a.siege}{" "}
        (numéro RNA {a.rna}), joignable à{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> ou au {site.telephone}.
        Elles s’appliquent à toute commande passée sur le site. En cochant la
        case « J’ai lu et j’accepte les conditions générales de vente », vous
        les acceptez sans réserve.
      </p>

      <h2>2. Les prestations et leurs prix</h2>
      <p>Les prix sont indiqués en euros, par séance, et affichés avant le paiement :</p>
      <ul>
        {offres.map((o) => (
          <li key={o.id}>
            <strong>{o.nom}</strong> — {o.sous} : {euros(o.prixUnitaire)} par{" "}
            {o.unite}
            {o.trimestre &&
              ` ; forfait trimestre de ${SEMAINES_TRIMESTRE} semaines avec ${reduction} % de réduction`}
            .
          </li>
        ))}
        <li>
          <strong>Abonnement à l’espace en ligne</strong> (replays, relaxations
          audio, Yoga Nidra) : {euros(ABONNEMENT.mensuel)} par mois ou{" "}
          {euros(ABONNEMENT.annuel)} par an, avec {ABONNEMENT.essaiJours} jours
          d’essai gratuit à la première souscription.
        </li>
      </ul>
      {a.tva && <p>{a.tva}.</p>}
      <p>
        L’association se réserve le droit de modifier ses tarifs à tout moment.
        Le prix applicable est celui affiché au moment de la commande.
      </p>

      <h2>3. Commander</h2>
      <p>
        Pour payer, un compte gratuit est nécessaire. La commande est définitive
        après le paiement. Vous recevez alors un e-mail de confirmation, et la
        réservation apparaît dans votre espace (« Mes achats »).
      </p>

      <h2>4. Paiement</h2>
      <p>
        Le paiement s’effectue en ligne par carte bancaire, au moment de la
        commande, via notre prestataire sécurisé Stripe. L’association n’a
        jamais accès à vos numéros de carte. Le forfait trimestre se règle en
        un seul paiement, sans renouvellement automatique.
      </p>

      <h2>5. Déroulement des séances</h2>
      <ul>
        <li>
          <strong>Cours collectifs</strong> : ils ont lieu aux jours et horaires
          indiqués sur le site.
        </li>
        <li>
          <strong>Ateliers, séances personnalisées et thérapie holistique</strong> :
          après votre paiement, Chantal vous contacte par téléphone pour fixer
          la date avec vous. Pensez à renseigner un numéro joignable lors du
          paiement.
        </li>
        <li>
          Pour les séances personnalisées, le déplacement est inclus dans le
          prix, dans la zone indiquée par Chantal au moment de la prise de
          rendez-vous.
        </li>
      </ul>

      <h2>6. Annulation et report</h2>
      <p>
        <strong>À votre initiative.</strong> Vous pouvez annuler ou reporter une
        séance réservée en prévenant Chantal (téléphone ou e-mail) au moins{" "}
        <strong>48 heures</strong> avant l’heure prévue : la séance est alors
        reportée à une autre date ou remboursée, selon votre choix. Passé ce
        délai, ou en cas d’absence, la séance est due et n’est pas remboursée.
      </p>
      <p>
        <strong>Forfait trimestre.</strong> Une séance manquée n’est pas
        remboursée. Elle peut être rattrapée sur un autre créneau du même
        trimestre, dans la limite des places disponibles, si vous avez prévenu
        à l’avance.
      </p>
      <p>
        <strong>À l’initiative de l’association.</strong> Si une séance doit
        être annulée (indisponibilité de Chantal, nombre de participants
        insuffisant, cas de force majeure), elle est reportée à une date qui
        vous convient ou, à votre choix, remboursée.
      </p>

      <h2>7. Droit de rétractation</h2>
      <p>
        Les cours, ateliers et forfaits réservés pour des dates ou une période
        précises, ainsi que les prestations de loisirs de ce type, ne bénéficient
        pas du droit de rétractation (article L221-28 du Code de la
        consommation). Pour l’abonnement en ligne et les séances sur rendez-vous
        dont la date n’a pas eu lieu, vous disposez de 14 jours pour vous
        rétracter. Les modalités et un modèle de formulaire sont disponibles
        sur la page <a href="/retractation">Droit de rétractation</a>.
      </p>

      <h2>8. Abonnement à l’espace en ligne</h2>
      <ul>
        <li>
          L’essai gratuit de {ABONNEMENT.essaiJours} jours est offert une seule
          fois par personne. Si vous ne résiliez pas avant la fin de l’essai,
          l’abonnement payant démarre automatiquement.
        </li>
        <li>
          L’abonnement est renouvelé automatiquement chaque mois ou chaque
          année, selon la formule choisie, jusqu’à sa résiliation.
        </li>
        <li>
          Vous pouvez résilier à tout moment depuis votre espace (« Gérer mon
          abonnement »). La résiliation prend effet à la fin de la période déjà
          payée, pendant laquelle l’accès est conservé. La période en cours
          n’est pas remboursée.
        </li>
        <li>
          Les contenus sont réservés à votre usage personnel et ne peuvent être
          ni copiés ni partagés.
        </li>
        <li>
          En cas d’échec du prélèvement, l’accès peut être suspendu jusqu’à
          régularisation.
        </li>
      </ul>

      <h2>9. Santé et responsabilité</h2>
      <p>
        Le yoga, la relaxation et la thérapie holistique sont des pratiques de
        bien-être qui ne remplacent pas un suivi médical. En vous inscrivant,
        vous déclarez ne pas connaître de contre-indication à ces pratiques ;
        en cas de doute, demandez l’avis de votre médecin et signalez à Chantal
        toute situation particulière (grossesse, douleur, pathologie).
        L’association est responsable dans les limites prévues par la loi.
      </p>

      <h2>10. Données personnelles</h2>
      <p>
        Vos données sont traitées conformément à notre{" "}
        <a href="/confidentialite">politique de confidentialité</a>.
      </p>

      <h2>11. Réclamations et médiation</h2>
      <p>
        Pour toute réclamation, écrivez-nous à{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a> ; nous nous engageons à
        vous répondre rapidement. À défaut de solution amiable, vous pouvez
        recourir gratuitement à un médiateur de la consommation.
      </p>
      {a.mediateur && <p>Médiateur : {a.mediateur}</p>}
      <p>
        Vous pouvez aussi utiliser la plateforme européenne de règlement des
        litiges en ligne : ec.europa.eu/consumers/odr.
      </p>

      <h2>12. Droit applicable</h2>
      <p>
        Les présentes conditions sont soumises au droit français. En cas de
        litige, les tribunaux compétents sont ceux déterminés par les règles
        légales applicables aux consommateurs.
      </p>
    </PageLegale>
  );
}