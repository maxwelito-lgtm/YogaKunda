"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  offres,
  getOffre,
  calculer,
  euros,
  pourcentEconomie,
  SEMAINES_TRIMESTRE,
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
type Onglet = "groupe" | "individuel";

const INDIVIDUELS: OffreId[] = ["perso", "therapie"];

const FORMULES = [
  ["cours", "Au cours"],
  ["trim", "Au trimestre"],
  ["annee", "À l’année"],
] as const;

const IMAGES: Record<OffreId, string> = {
  kundalini: "/images/kundalini.png",
  tantra: "/images/tantra.png",
  atelier: "/images/yoga-nature.png",
  perso: "/images/yoga-n.webp",
  therapie: "/images/therapie.webp",
};

const ETIQUETTES: Record<OffreId, string> = {
  kundalini: "Chaque semaine",
  tantra: "Atelier",
  atelier: "Atelier",
  perso: "Sur rendez-vous",
  therapie: "Sur rendez-vous",
};

// Texte court sous le titre de chaque carte (sans répéter « En groupe » : l'onglet le dit déjà).
const DETAILS: Record<OffreId, string> = {
  kundalini: "Lundi à Géronce · mercredi à Oloron · 18 h 30 – 20 h",
  tantra: "Atelier de 2 h · date fixée avec Chantal",
  atelier: "Atelier de 2 h · date fixée avec Chantal",
  perso: "Déplacement compris",
  therapie: "Séance individuelle",
};

export default function ReservationForm({
  offreInitiale,
  formuleInitiale,
  rythmeInitial,
}: Props) {
  const [offreId, setOffreId] = useState<OffreId>(offreInitiale);
  const [onglet, setOnglet] = useState<Onglet>(
    INDIVIDUELS.includes(offreInitiale) ? "individuel" : "groupe"
  );
  const [formule, setFormule] = useState<Formule>(formuleInitiale);
  const [rythme, setRythme] = useState<Rythme>(rythmeInitial);
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");
  const [cgv, setCgv] = useState(false);

  const offre = getOffre(offreId);
  const formuleEff: Formule =
    formule === "annee" && offre.annee
      ? "annee"
      : formule === "trim" && offre.trimestre
        ? "trim"
        : "cours";
  const rythmeEff: Rythme = offre.rythmeChoisi ? rythme : 1;
  const forfait = formuleEff !== "cours"; // trimestre ou année scolaire
  const c = calculer(offre, formuleEff, rythmeEff);

  const trimMessage =
    formuleEff === "trim"
      ? `${SEMAINES_TRIMESTRE} semaines, un seul paiement, sans renouvellement automatique.`
      : "Vous payez à la séance. Chantal vous rappelle après le paiement pour fixer la date.";

  const visibles = offres.filter((o) =>
    onglet === "individuel" ? INDIVIDUELS.includes(o.id) : !INDIVIDUELS.includes(o.id)
  );

  function changerOnglet(nouveau: Onglet) {
    setOnglet(nouveau);
    const premier = offres.find((o) =>
      nouveau === "individuel" ? INDIVIDUELS.includes(o.id) : !INDIVIDUELS.includes(o.id)
    );
    // Si la pratique choisie n'est pas dans ce groupe, on sélectionne la première.
    const dansLeGroupe =
      nouveau === "individuel"
        ? INDIVIDUELS.includes(offreId)
        : !INDIVIDUELS.includes(offreId);
    if (!dansLeGroupe && premier) setOffreId(premier.id);
  }

  const resume = [
    offre.nom,
    offre.trimestre
      ? formuleEff === "annee"
        ? "à l'année"
        : formuleEff === "trim"
          ? "au trimestre"
          : "au cours"
      : null,
    offre.rythmeChoisi
      ? forfait
        ? `${rythmeEff} par semaine`
        : `${rythmeEff} cours`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

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
          cgv: true,
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
    <div className="min-w-0">
      {/* Titre + onglets */}
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="space-y-2">
          <h2 className="font-display text-3xl italic text-encre sm:text-5xl">
            Comment souhaitez-vous pratiquer ?
          </h2>
          <p className="text-base text-encre/70">
            Deux choix, puis le paiement. C’est tout.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Type de pratique"
          className="inline-flex rounded-pill bg-white p-1.5 shadow-md ring-1 ring-black/5"
        >
          {(
            [
              ["groupe", "En groupe"],
              ["individuel", "Rien que pour moi"],
            ] as const
          ).map(([valeur, libelle]) => (
            <button
              key={valeur}
              type="button"
              role="tab"
              aria-selected={onglet === valeur}
              onClick={() => changerOnglet(valeur)}
              className={`min-h-[46px] rounded-pill px-5 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75523F] sm:px-8 sm:text-base ${
                onglet === valeur
                  ? "bg-encre text-[#F5F3E7]"
                  : "text-encre hover:text-[#75523F]"
              }`}
            >
              {libelle}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes */}
      <div
        className={`mt-8 grid gap-5 sm:grid-cols-2 ${
          onglet === "groupe" ? "lg:grid-cols-3" : "lg:mx-auto lg:max-w-3xl"
        }`}
      >
        {visibles.map((o) => {
          const choisi = offreId === o.id;
          return (
            <button
              key={o.id}
              type="button"
              aria-pressed={choisi}
              onClick={() => setOffreId(o.id)}
              className={`group flex min-w-0 flex-col overflow-hidden rounded-3xl bg-white text-left shadow-lg ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75523F] ${
                choisi
                  ? "ring-2 ring-[#75523F] ring-offset-2 ring-offset-[#F5F3E7]"
                  : "ring-black/5 hover:-translate-y-0.5"
              }`}
            >
              <span className="relative block h-32 w-full overflow-hidden bg-[#D3BFA8] sm:h-36">
                <Image
                  src={IMAGES[o.id]}
                  alt=""
                  aria-hidden="true"
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-4 top-4 rounded-pill bg-white/90 px-3 py-1 text-xs font-semibold text-encre">
                  {ETIQUETTES[o.id]}
                </span>
              </span>

              <span className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
                <span>
                  <span className="block font-display text-2xl italic leading-tight text-encre">
                    {o.nom}
                  </span>
                  <span className="mt-1 block text-sm text-encre/65">
                    {DETAILS[o.id]}
                  </span>
                </span>

                <span className="mt-auto flex items-baseline gap-1.5">
                  <span className="font-display text-4xl italic text-[#75523F]">
                    {euros(o.prixUnitaire)}
                  </span>
                  <span className="text-sm text-encre/60">
                    {o.unite === "cours" ? "le cours" : "la séance"}
                  </span>
                </span>

                <span
                  className={`mt-1 inline-flex min-h-[46px] items-center justify-center rounded-pill px-6 text-sm font-semibold transition-colors ${
                    choisi
                      ? "bg-encre text-[#F5F3E7]"
                      : "bg-[#75523F] text-white group-hover:bg-[#654431]"
                  }`}
                >
                  {choisi ? "✓ Choisi" : "Choisir"}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {onglet === "groupe" && (
        <p className="mt-5 text-center text-sm text-encre/70">
          Au trimestre ou à l’année : <strong>des tarifs dégressifs</strong> sur
          les cours et ateliers en groupe.
        </p>
      )}

      {/* Personnalisation (seulement si la pratique le permet) */}
      {offre.trimestre && (
        <section
          aria-label="Votre formule"
          className="mx-auto mt-8 max-w-3xl rounded-3xl bg-white p-5 shadow-lg ring-1 ring-black/5 sm:p-8"
        >
          <h3 className="font-display text-2xl italic text-encre">
            {offre.nom} : votre formule
          </h3>

          <div
            className={`mt-5 grid gap-1 rounded-pill bg-[#F5F3E7] p-1 ${
              offre.annee ? "grid-cols-3" : "grid-cols-2"
            }`}
          >
            {FORMULES.filter(([v]) => v !== "annee" || offre.annee).map(([valeur, libelle]) => (
              <button
                key={valeur}
                type="button"
                aria-pressed={formuleEff === valeur}
                onClick={() => setFormule(valeur)}
                className={`min-h-[46px] rounded-pill px-3 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75523F] ${
                  formuleEff === valeur
                    ? "bg-[#75523F] text-white"
                    : "text-encre/70 hover:text-encre"
                }`}
              >
                {libelle}
                {valeur !== "cours" && (
                  <span
                    className={`ml-2 hidden rounded-pill px-2 py-0.5 text-xs sm:inline ${
                      formuleEff === valeur
                        ? "bg-white/25 text-white"
                        : "bg-[#EFE6DA] text-[#75523F]"
                    }`}
                  >
                    −{pourcentEconomie(calculer(offre, valeur, rythmeEff))} %
                  </span>
                )}
              </button>
            ))}
          </div>
          <p className="mt-3 text-sm text-encre/70">
            {formuleEff === "annee"
              ? "Toute l’année scolaire (septembre à juin), un seul paiement, sans renouvellement automatique."
              : trimMessage}
          </p>

          {offre.rythmeChoisi && (
            <div className="mt-6">
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#75523F]">
                Combien de cours par semaine ?
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {([1, 2] as const).map((n) => {
                  const cn = calculer(offre, formuleEff, n);
                  const actif = rythmeEff === n;
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => setRythme(n)}
                      className={`min-w-0 rounded-2xl border-[1.5px] p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#75523F] ${
                        actif
                          ? "border-encre bg-encre text-[#F5F3E7]"
                          : "border-transparent bg-[#F5F3E7] hover:border-[#75523F]"
                      }`}
                    >
                      <span className="block text-lg font-bold">
                        {forfait ? `${n} par semaine` : `${n} cours`}
                      </span>
                      <span
                        className={`mt-0.5 block text-sm ${
                          actif ? "text-[#F5F3E7]/80" : "text-encre/70"
                        }`}
                      >
                        {forfait
                          ? `${cn.seances} cours sur ${
                              formuleEff === "annee" ? "l’année scolaire" : "le trimestre"
                            }`
                          : n === 1
                            ? "Lundi (Géronce) ou mercredi (Oloron), 18 h 30 – 20 h"
                            : "Lundi et mercredi, 18 h 30 – 20 h"}
                      </span>
                      <span
                        className={`mt-2 block font-bold ${
                          actif ? "text-[#E0C9B5]" : "text-[#75523F]"
                        }`}
                      >
                        {euros(cn.total)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </section>
      )}

      {/* Barre de paiement, toujours visible */}
      <div
        aria-live="polite"
        className="sticky bottom-3 z-20 mx-auto mt-8 max-w-3xl rounded-3xl bg-encre p-4 text-[#F5F3E7] shadow-[0_-4px_30px_rgba(43,31,25,0.3)] sm:px-7 sm:py-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <p className="truncate text-sm text-[#F5F3E7]/75">{resume}</p>
            <p className="mt-0.5 flex flex-wrap items-baseline gap-x-3">
              <strong className="font-display text-3xl font-normal italic sm:text-4xl">
                {euros(c.total)}
              </strong>
              {forfait && (
                <>
                  <span className="text-sm text-[#F5F3E7]/55 line-through">
                    {euros(c.plein)}
                  </span>
                  <span className="rounded-pill bg-[#E6EFE8] px-2.5 py-0.5 text-xs font-semibold text-[#4E7A5B]">
                    Vous économisez {euros(c.economie)}
                  </span>
                </>
              )}
            </p>
          </div>

          <button
            type="button"
            onClick={payer}
            disabled={etat === "envoi" || !cgv}
            className="btn-bounce inline-flex min-h-[50px] shrink-0 items-center justify-center rounded-pill bg-[#F5F3E7] px-8 py-3 text-base font-semibold text-encre hover:bg-white disabled:opacity-60"
          >
            {etat === "envoi" ? "Un instant…" : `Payer ${euros(c.total)}`}
          </button>
        </div>
        {!cgv && (
          <p className="mt-2 text-xs text-[#F5F3E7]/55">
            Cochez la case ci-dessous pour activer le paiement.
          </p>
        )}

        <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-[#F5F3E7]/85">
          <input
            type="checkbox"
            checked={cgv}
            onChange={(e) => setCgv(e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[#F5F3E7]"
          />
          <span>
            J’ai lu et j’accepte les{" "}
            <Link
              href="/cgv"
              target="_blank"
              className="underline underline-offset-2 hover:text-white"
            >
              conditions générales de vente
            </Link>
            .
          </span>
        </label>

        {etat === "erreur" && (
          <p role="alert" className="mt-3 text-center text-sm text-[#FFB4A8]">
            {erreur}
          </p>
        )}
      </div>

      <ul className="mt-6 flex flex-col items-center gap-1.5 text-center text-sm text-encre/70 sm:flex-row sm:justify-center sm:gap-6">
        <li>✓ Paiement sécurisé par carte bancaire</li>
        <li>✓ Un compte gratuit est nécessaire pour payer</li>
        <li>
          ✓{" "}
          {forfait
            ? "Un seul paiement, sans renouvellement"
            : "Chantal vous rappelle pour fixer la date"}
        </li>
      </ul>
    </div>
  );
}