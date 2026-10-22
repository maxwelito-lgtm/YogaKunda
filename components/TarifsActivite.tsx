import Link from "next/link";
import type { ReactNode } from "react";
import type { TypeTarifs } from "@/data/activity-pages";
import {
  getOffre,
  calculer,
  euros,
  pourcentEconomie,
  ABONNEMENT,
  SEMAINES_TRIMESTRE,
  REDUCTION_TRIMESTRE,
  type OffreId,
  type Formule,
  type Rythme,
} from "@/data/offres";

const pourcent = Math.round(REDUCTION_TRIMESTRE * 100);

function lienReservation(
  offre: OffreId,
  formule: Formule = "cours",
  rythme: Rythme = 1
) {
  return `/reserver?offre=${offre}&formule=${formule}&rythme=${rythme}`;
}

const introParType: Record<TypeTarifs, string> = {
  kundalini: `Un ou deux cours par semaine. Payez à l’unité, au trimestre ou pour toute l’année scolaire : plus la durée est longue, plus le cours revient moins cher.`,
  ateliers: `Un atelier le lundi (Tantra) et un le samedi (Kundalini). Payez à la séance ou pour tout le trimestre, avec ${pourcent} % de réduction.`,
  "en-ligne": `Le Yoga Nidra fait partie des cours en ligne : essayez gratuitement pendant ${ABONNEMENT.essaiJours} jours.`,
  therapie:
    "Un tarif unique par séance. Chantal vous rappelle après le paiement pour fixer le rendez-vous.",
};

export default function TarifsActivite({ type }: { type: TypeTarifs }) {
  return (
    <section id="tarifs" className="scroll-mt-24 px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-3xl italic text-encre sm:text-4xl">
          Les tarifs
        </h2>
        <p className="mx-auto mb-10 mt-3 max-w-xl text-center text-encre/70">
          {introParType[type]}
        </p>

        {type === "kundalini" && <TarifsKundalini />}
        {type === "ateliers" && <TarifsAteliers />}
        {type === "en-ligne" && <TarifsEnLigne />}
        {type === "therapie" && <TarifsTherapie />}
      </div>
    </section>
  );
}

/* ---------- Cours de Kundalini ---------- */
function TarifsKundalini() {
  const o = getOffre("kundalini");
  const c1 = calculer(o, "cours", 1);
  const c2 = calculer(o, "cours", 2);
  const t1 = calculer(o, "trim", 1);
  const t2 = calculer(o, "trim", 2);
  const a1 = calculer(o, "annee", 1);
  const a2 = calculer(o, "annee", 2);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-3">
        <Plan
          titre="Au cours"
          sous="Vous payez ce dont vous avez besoin. Chantal vous rappelle pour fixer la date."
        >
          <Ligne
            titre="1 cours"
            detail="Lundi (Géronce) ou mercredi (Oloron), de 18 h 30 à 20 h"
            prix={euros(c1.total)}
            href={lienReservation("kundalini", "cours", 1)}
          />
          <Ligne
            titre="2 cours"
            detail="Lundi et mercredi, de 18 h 30 à 20 h"
            prix={euros(c2.total)}
            href={lienReservation("kundalini", "cours", 2)}
          />
        </Plan>

        <Plan
          badge={`Jusqu'à −${pourcentEconomie(t2)} %`}
          titre="Au trimestre"
          sous={`${SEMAINES_TRIMESTRE} semaines, un seul paiement, sans renouvellement automatique.`}
        >
          <Ligne
            titre="1 cours par semaine"
            detail={`${t1.seances} cours · ${euros(t1.parSeance)} le cours`}
            prix={euros(t1.total)}
            href={lienReservation("kundalini", "trim", 1)}
          />
          <Ligne
            titre="2 cours par semaine"
            detail={`${t2.seances} cours · ${euros(t2.parSeance)} le cours`}
            prix={euros(t2.total)}
            href={lienReservation("kundalini", "trim", 2)}
          />
        </Plan>

        <Plan
          meilleur
          badge="Meilleur prix"
          titre="À l’année"
          sous="Toute l’année scolaire, de septembre à juin. Un seul paiement, sans renouvellement automatique."
        >
          <Ligne
            titre="1 cours par semaine"
            detail={`${a1.seances} cours · ${euros(a1.parSeance)} le cours`}
            prix={euros(a1.total)}
            href={lienReservation("kundalini", "annee", 1)}
          />
          <Ligne
            titre="2 cours par semaine"
            detail={`${a2.seances} cours · ${euros(a2.parSeance)} le cours`}
            prix={euros(a2.total)}
            href={lienReservation("kundalini", "annee", 2)}
          />
        </Plan>
      </div>
      <Perso />
    </>
  );
}

/* ---------- Ateliers Tantra (lundi) et Kundalini (samedi) ---------- */
function TarifsAteliers() {
  return (
    <>
      <div className="grid gap-8 md:grid-cols-2">
        <PlanAtelier id="tantra" jours="lundis" />
        <PlanAtelier id="atelier" jours="samedis" />
      </div>
      <Perso />
    </>
  );
}

function PlanAtelier({ id, jours }: { id: "tantra" | "atelier"; jours: string }) {
  const o = getOffre(id);
  const seance = calculer(o, "cours", 1);
  const trim = calculer(o, "trim", 1);

  return (
    <Plan titre={o.nom} sous={o.sous}>
      <Ligne
        titre="À la séance"
        detail="Chantal vous rappelle pour fixer la date"
        prix={euros(seance.total)}
        href={lienReservation(id, "cours", 1)}
      />
      <Ligne
        titre="Au trimestre"
        detail={`−${pourcent} % · ${trim.seances} ${jours} · un seul paiement`}
        prix={euros(trim.total)}
        href={lienReservation(id, "trim", 1)}
      />
    </Plan>
  );
}

/* ---------- Yoga Nidra : compris dans les cours en ligne ---------- */
function TarifsEnLigne() {
  const parMois = ABONNEMENT.annuel / 12;
  const economie = ABONNEMENT.mensuel * 12 - ABONNEMENT.annuel;

  return (
    <div className="mx-auto max-w-2xl">
      <Plan
        meilleur
        badge={`${ABONNEMENT.essaiJours} jours offerts`}
        titre="Cours en ligne & relaxations audio"
        sous="Le Yoga Nidra est inclus, avec toutes les relaxations audio, les replays et les cours en direct. Accessible quand vous voulez, depuis votre espace personnel."
      >
        <Ligne
          titre="Formule annuelle"
          detail={`${euros(ABONNEMENT.annuel)} par an · économisez ${euros(economie)}`}
          prix={`${euros(parMois)} / mois`}
href="/#abonnement"
bouton={`Essayer ${ABONNEMENT.essaiJours} jours gratuits`}
        />
        <Ligne
          titre="Formule mensuelle"
          detail={`${euros(ABONNEMENT.mensuel * 12)} par an, facturé mensuellement`}
          prix={`${euros(ABONNEMENT.mensuel)} / mois`}
href="/#abonnement"
bouton={`Essayer ${ABONNEMENT.essaiJours} jours gratuits`}
        />
      </Plan>
    </div>
  );
}

/* ---------- Thérapie holistique : un seul tarif ---------- */
function TarifsTherapie() {
  const o = getOffre("therapie");
  const c = calculer(o, "cours", 1);

  return (
    <div className="mx-auto max-w-2xl">
      <Plan
        meilleur
        badge="Sur rendez-vous"
        titre="Séance d'accompagnement"
        sous="Un accompagnement personnel, adapté à ce que vous traversez. Chantal vous rappelle après le paiement pour fixer la date."
      >
        <Ligne
          titre="1 séance"
          detail="60 minutes"
          prix={euros(c.total)}
          href={lienReservation("therapie")}
          bouton="Réserver"
        />
      </Plan>
    </div>
  );
}

/* ---------- Séance personnalisée (commune aux pages présentiel) ---------- */
function Perso() {
  const o = getOffre("perso");
  const c = calculer(o, "cours", 1);

  return (
    <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5 sm:p-6">
      <div className="min-w-0">
        <h3 className="font-display text-2xl italic text-encre">
          Séance personnalisée
        </h3>
        <p className="mt-1 text-sm text-encre/70">
          Sur rendez-vous, déplacement compris. Chantal vous rappelle après le
          paiement pour fixer la date.
        </p>
      </div>
      <div className="flex w-full items-center justify-between gap-3 sm:w-auto">
        <span className="font-display text-3xl italic text-encre">
          {euros(c.total)}
        </span>
        <BoutonChoisir href={lienReservation("perso")} />
      </div>
    </div>
  );
}

/* ---------- Éléments communs ---------- */
function Plan({
  titre,
  sous,
  badge,
  meilleur,
  children,
}: {
  titre: string;
  sous?: string;
  badge?: string;
  meilleur?: boolean;
  children: ReactNode;
}) {
  return (
    <article
      className={`relative grid min-w-0 content-start gap-4 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-black/5 sm:p-6 ${
        meilleur ? "border-2 border-[#75523F]" : ""
      }`}
    >
      {badge && (
        <span className="absolute -top-3 left-5 rounded-pill bg-[#75523F] px-3 py-1 text-xs font-bold tracking-wide text-white">
          {badge}
        </span>
      )}
      <h3 className="font-display text-2xl italic text-encre">{titre}</h3>
      {sous && <p className="-mt-2 text-sm text-encre/70">{sous}</p>}
      {children}
    </article>
  );
}

function Ligne({
  titre,
  detail,
  prix,
  href,
  bouton = "Choisir",
}: {
  titre: string;
  detail?: string;
  prix: string;
  href: string;
  bouton?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#F5F3E7] p-3.5">
      <div className="min-w-0">
        <p className="font-semibold text-encre">{titre}</p>
        {detail && <p className="text-sm text-encre/60">{detail}</p>}
      </div>
      <div className="flex w-full items-center justify-between gap-3 sm:ml-auto sm:w-auto">
        <span className="font-display text-2xl italic text-encre">{prix}</span>
        <BoutonChoisir href={href} libelle={bouton} />
      </div>
    </div>
  );
}

function BoutonChoisir({
  href,
  libelle = "Choisir",
}: {
  href: string;
  libelle?: string;
}) {
  return (
    <Link
      href={href}
      className="btn-bounce inline-flex min-h-[40px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-5 py-2 text-sm font-semibold text-white shadow-[0_0_0_1px_#75523F] hover:bg-[#75523F]"
    >
      {libelle}
    </Link>
  );
}