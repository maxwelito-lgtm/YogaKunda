import type { Metadata } from "next";
import PageLegale from "@/components/PageLegale";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Droit de rétractation — ${site.nom}`,
  description: `Informations sur le droit de rétractation et modèle de formulaire de rétractation de ${site.nom}.`,
};

export default function RetractationPage() {
  const a = site.association;
  return (
    <PageLegale titre="Droit de rétractation" misAJour="22 octobre 2026">
      <h2>Qui peut se rétracter ?</h2>
      <p>
        Pour un achat fait à distance (sur ce site), vous disposez en principe
        d’un délai de <strong>14 jours</strong> pour vous rétracter, sans
        avoir à vous justifier. Ce droit s’applique dans les cas suivants :
      </p>
      <ul>
        <li>
          l’<strong>abonnement à l’espace en ligne</strong> (le délai court à
          partir de la souscription) ;
        </li>
        <li>
          les <strong>séances sur rendez-vous</strong> (séance personnalisée,
          thérapie holistique) dont la date n’a pas encore eu lieu.
        </li>
      </ul>
      <p>
        Si vous demandez que la prestation commence avant la fin du délai de
        14 jours, vous ne payez que la part correspondant à ce qui a déjà été
        réalisé au moment de votre rétractation.
      </p>

      <h2>Quand le droit de rétractation ne s’applique pas</h2>
      <p>
        Conformément à l’article L221-28 du Code de la consommation, il ne
        s’applique pas aux prestations de loisirs fournies à une date ou selon
        une périodicité déterminée : les <strong>cours</strong>, les{" "}
        <strong>ateliers</strong> et les <strong>forfaits trimestriels</strong>{" "}
        réservés pour des dates précises. Les règles d’annulation de ces
        prestations figurent dans nos{" "}
        <a href="/cgv">conditions générales de vente</a>.
      </p>

      <h2>Comment se rétracter ?</h2>
      <p>
        Envoyez-nous une déclaration claire de votre décision, avant la fin du
        délai, par e-mail à <a href={`mailto:${site.email}`}>{site.email}</a>{" "}
        ou par courrier à : {a.nom}, {a.siege}. Vous pouvez utiliser le modèle
        ci-dessous, sans que ce soit obligatoire.
      </p>
      <p>
        Nous vous remboursons dans un délai maximal de 14 jours à compter de
        la réception de votre demande, par le même moyen de paiement que celui
        utilisé pour l’achat.
      </p>

      <h2>Modèle de formulaire de rétractation</h2>
      <div className="mt-4 rounded-2xl bg-white p-5 text-[15px] leading-relaxed shadow-sm">
        <p className="!mt-0">
          À l’attention de {a.nom}, {a.siege} –{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a> :
        </p>
        <p>
          Je vous notifie par la présente ma rétractation du contrat portant
          sur la prestation de services ci-dessous :
        </p>
        <ul>
          <li>Prestation commandée : ……………………………………………</li>
          <li>Commandée le : ………………………………………………………</li>
          <li>Nom : ………………………………………………………………………</li>
          <li>Adresse : …………………………………………………………………</li>
          <li>Adresse e-mail du compte : ……………………………………</li>
        </ul>
        <p>Date : ……………………………………</p>
        <p>
          Signature (uniquement en cas de notification du présent formulaire
          sur papier) : ……………………………………
        </p>
      </div>

      <p>
        <a
          href={`mailto:${site.email}?subject=${encodeURIComponent(
            "Rétractation de ma commande"
          )}`}
        >
          Écrire un e-mail de rétractation
        </a>
      </p>
    </PageLegale>
  );
}