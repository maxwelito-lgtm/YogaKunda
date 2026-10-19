"use client";

import { useState } from "react";
import {
  offres,
  getOffre,
  calculer,
  euros,
  SEMAINES_TRIMESTRE,
  REDUCTION_TRIMESTRE,
  type OffreId,
  type Formule,
  type Rythme,
} from "@/data/offres";

type Props = {
  offreInitiale: OffreId;
  formuleInitiale: Formule;
  rythmeInitial: Rythme;
};

type Etat = "repos" | "envoi" | "erreur";

const choix =
  "min-w-0 w-full rounded-xl border-[1.5px] p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75523F]";
const choixOff = "border-transparent bg-[#F5F3E7] hover:border-[#75523F]";
const choixOn = "border-[#75523F] bg-white ring-4 ring-[#75523F]/15";

export default function ReservationForm({
  offreInitiale,
  formuleInitiale,
  rythmeInitial,
}: Props) {
  const [offreId, setOffreId] = useState<OffreId>(offreInitiale);
  const [formule, setFormule] = useState<Formule>(formuleInitiale);
  const [rythme, setRythme] = useState<Rythme>(rythmeInitial);
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  const offre = getOffre(offreId);
  const formuleEff: Formule = offre.trimestre ? formule : "cours";
  const rythmeEff: Rythme = offre.rythmeChoisi ? rythme : 1;
  const trim = formuleEff === "trim";
  const c = calculer(offre, formuleEff, rythmeEff);
  const pourcent = Math.round(REDUCTION_TRIMESTRE * 100);

  const lignes: [string, string][] = [["Pratique", offre.nom]];
  if (offre.trimestre) lignes.push(["Formule", trim ? "Trimestre" : "Au cours"]);
  if (offre.rythmeChoisi) {
    lignes.push([
      "Rythme",
      trim ? `${rythmeEff} par semaine` : `${rythmeEff} cours`,
    ]);
  }
  lignes.push(["Séances", String(c.seances)]);
  if (trim) lignes.push([`Prix par ${offre.unite}`, euros(c.parSeance)]);

  const notes = ["Paiement sécurisé par carte bancaire"];
  notes.push(
    trim
      ? "Un seul paiement, sans renouvellement"
      : "Chantal vous rappelle pour fixer la date"
  );
  notes.push("Un compte gratuit est nécessaire pour payer");

  async function payer() {
    setEtat("envoi");
    setErreur("");
    try {
      const res = await fetch("/api/paiement", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offre: offreId,
          formule: formuleEff,
          rythme: rythmeEff,
        }),
      });

      // Pas connecté : on passe par la connexion, puis on revient ici.
      if (res.status === 401) {
        const retour = `/reserver?offre=${offreId}&formule=${formuleEff}&rythme=${rythmeEff}`;
        window.location.href = `/connexion?next=${encodeURIComponent(retour)}`;
        return;
      }

      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.url) {
        setErreur(json.error || "Le paiement n’est pas encore disponible.");
        setEtat("erreur");
        return;
      }
      window.location.href = json.url;
    } catch {
      setErreur("Connexion impossible. Merci de réessayer.");
      setEtat("erreur");
    }
  }

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-6">
      <div className="min-w-0 space-y-6">
        {/* Étape 1 */}
        <Carte etape="Étape 1" titre="Votre pratique">
          <div className="grid gap-3 sm:grid-cols-2">
            {offres.map((o) => (
              <button
                key={o.id}
                type="button"
                aria-pressed={offreId === o.id}
                onClick={() => setOffreId(o.id)}
                className={`${choix} ${offreId === o.id ? choixOn : choixOff}`}
              >
                <span className="block font-semibold text-encre">{o.nom}</span>
                <span className="mt-0.5 block text-sm text-encre/70">{o.sous}</span>
                <span className="mt-2 block text-sm font-bold text-[#75523F]">
                  {o.trimestre
                    ? `À partir de ${euros(o.prixUnitaire)} · trimestre −${pourcent} %`
                    : `${euros(o.prixUnitaire)} la séance`}
                </span>
              </button>
            ))}
          </div>
        </Carte>

        {/* Étape 2 : formule */}
        {offre.trimestre && (
          <Carte etape="Étape 2" titre="Votre formule">
            <div className="grid grid-cols-2 gap-1 rounded-pill bg-[#F5F3E7] p-1">
              {(
                [
                  ["cours", "Au cours"],
                  ["trim", "Au trimestre"],
                ] as const
              ).map(([valeur, libelle]) => (
                <button
                  key={valeur}
                  type="button"
                  aria-pressed={formuleEff === valeur}
                  onClick={() => setFormule(valeur)}
                  className={`min-h-[44px] rounded-pill px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75523F] ${
                    formuleEff === valeur
                      ? "bg-[#75523F] text-white"
                      : "text-encre/70 hover:text-encre"
                  }`}
                >
                  {libelle}
                  {valeur === "trim" && (
                    <span
                      className={`ml-2 rounded-pill px-2 py-0.5 text-xs ${
                        formuleEff === "trim"
                          ? "bg-white/25 text-white"
                          : "bg-[#EFE6DA] text-[#75523F]"
                      }`}
                    >
                      −{pourcent} %
                    </span>
                  )}
                </button>
              ))}
            </div>
            <p className="mt-3 text-sm text-encre/70">
              {trim
                ? `${SEMAINES_TRIMESTRE} semaines, un seul paiement, sans renouvellement automatique. Vous économisez ${pourcent} %.`
                : "Vous payez à la séance. Chantal vous rappelle après le paiement pour fixer la date."}
            </p>
          </Carte>
        )}

        {/* Étape 3 : rythme (cours de Kundalini) */}
        {offre.rythmeChoisi && (
          <Carte etape="Étape 3" titre="Votre rythme">
            <div className="grid gap-3 sm:grid-cols-2">
              {([1, 2] as const).map((n) => {
                const cn = calculer(offre, formuleEff, n);
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={rythmeEff === n}
                    onClick={() => setRythme(n)}
                    className={`${choix} ${rythmeEff === n ? choixOn : choixOff}`}
                  >
                    <span className="block text-lg font-bold text-encre">
                      {trim
                        ? `${n} cours par semaine`
                        : `${n} cours`}
                    </span>
                    <span className="mt-0.5 block text-sm text-encre/70">
                      {trim
                        ? `${cn.seances} cours sur le trimestre`
                        : n === 1
                          ? "60 minutes"
                          : "2 × 60 minutes"}
                    </span>
                    <span className="mt-2 block font-bold text-[#75523F]">
                      {euros(cn.total)}
                    </span>
                  </button>
                );
              })}
            </div>
          </Carte>
        )}
      </div>

      {/* Récapitulatif : à droite sur PC, barre fixe en bas sur smartphone */}
      <aside
        aria-labelledby="titre-commande"
        className="sticky bottom-2 z-20 mt-6 min-w-0 rounded-2xl bg-white p-4 shadow-[0_-4px_30px_rgba(43,31,25,0.22)] ring-1 ring-black/5 lg:bottom-auto lg:top-24 lg:mt-0 lg:p-6 lg:shadow-lg"
      >
        <h2
          id="titre-commande"
          className="font-display text-xl italic text-encre lg:text-2xl"
        >
          Votre commande
        </h2>

        <ul className="mt-3 hidden gap-2 text-sm lg:grid">
          {lignes.map(([nom, valeur]) => (
            <li key={nom} className="flex justify-between gap-3">
              <span className="text-encre/60">{nom}</span>
              <span className="min-w-0 text-right font-semibold text-encre">
                {valeur}
              </span>
            </li>
          ))}
        </ul>

        <div className="mt-2 flex items-baseline justify-between gap-3 border-t border-encre/10 pt-2 lg:mt-4 lg:pt-4">
          <span className="font-semibold text-encre">Total</span>
          <div className="text-right">
            {trim && (
              <span className="mr-2 text-sm text-encre/50 line-through">
                {euros(c.plein)}
              </span>
            )}
            <strong className="font-display text-3xl font-normal italic text-encre lg:text-4xl">
              {euros(c.total)}
            </strong>
          </div>
        </div>

        {trim && (
          <span className="mt-2 inline-block rounded-pill bg-[#E6EFE8] px-3 py-1 text-sm font-semibold text-[#4E7A5B]">
            Vous économisez {euros(c.economie)}
          </span>
        )}

        {etat === "erreur" && (
          <p role="alert" className="mt-3 text-center text-sm text-alerte">
            {erreur}
          </p>
        )}

        <button
          type="button"
          onClick={payer}
          disabled={etat === "envoi"}
          className="btn-bounce mt-3 inline-flex min-h-[48px] w-full items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-6 py-3 text-sm font-semibold text-white shadow-[0_0_0_1px_#75523F] hover:bg-[#75523F] disabled:opacity-60 lg:mt-4"
        >
          {etat === "envoi" ? "Un instant…" : `Payer ${euros(c.total)}`}
        </button>

        <ul className="mt-4 hidden gap-1.5 text-sm text-encre/70 lg:grid">
          {notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span aria-hidden="true" className="text-[#4E7A5B]">
                ✓
              </span>
              {n}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

function Carte({
  etape,
  titre,
  children,
}: {
  etape: string;
  titre: string;
  children: React.ReactNode;
}) {
  return (
    <section className="min-w-0 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5 sm:p-6">
      <div className="mb-4 flex items-baseline gap-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#75523F]">
          {etape}
        </span>
        <h2 className="font-display text-2xl italic text-encre">{titre}</h2>
      </div>
      {children}
    </section>
  );
}