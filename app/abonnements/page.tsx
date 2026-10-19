import Link from "next/link";
import { ABONNEMENT } from "@/data/offres";

export const metadata = {
  title: "Abonnements en ligne | Shantalam",
  description:
    "Cours de yoga en vidéo, relaxations et Yoga Nidra : abonnez-vous à votre rythme, sans pression. 7 jours offerts.",
};

// Après le choix, on passe par la connexion puis l'espace personnel.
function lienChoix(formule: "annuelle" | "mensuelle") {
  const suite = `/mon-espace?formule=${formule}`;
  return `/connexion?next=${encodeURIComponent(suite)}`;
}

const inclus = [
  "Tous les cours en vidéo, à la demande",
  "Le Yoga Nidra et les relaxations guidées",
  "Pratique à votre rythme, où et quand vous voulez",
  "Résiliable à tout moment",
];

export default function PageAbonnements() {
  return (
    <main className="bg-[#F5F3E7]">
      <section className="mx-auto max-w-3xl px-4 pb-6 pt-16 text-center sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#75523F]">
          Cours en ligne
        </p>
        <h1 className="mt-2 font-display text-4xl italic text-encre sm:text-5xl">
          Pratiquez à votre rythme, sans pression
        </h1>
        <p className="mt-4 text-encre/80">
          Un accès illimité à tous les contenus en ligne.{" "}
          <strong>{ABONNEMENT.essaiJours} jours offerts</strong> pour essayer.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <ul className="mx-auto grid max-w-xl gap-2 text-sm text-encre/80">
          {inclus.map((i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[#75523F]" aria-hidden="true">
                ✓
              </span>
              {i}
            </li>
          ))}
        </ul>
      </section>

      <section className="mx-auto grid max-w-4xl gap-6 px-4 pb-16 pt-6 sm:grid-cols-2 sm:px-6">
        {/* Annuelle */}
        <div className="relative rounded-2xl border-2 border-[#75523F] bg-white p-6">
          <span className="absolute -top-3 left-4 rounded-pill bg-[#75523F] px-3 py-1 text-xs font-semibold text-white">
            Meilleur prix
          </span>
          <p className="mt-3 font-semibold text-encre">Formule annuelle</p>
          <p className="mt-2">
            <span className="font-display text-4xl italic text-[#75523F]">
              17 €
            </span>
            <span className="text-sm text-encre/70"> /mois</span>
          </p>
          <p className="mt-1 text-xs text-encre/60">
            {ABONNEMENT.annuel} € par an, facturé une fois par an
          </p>
          <Link
            href={lienChoix("annuelle")}
            className="btn-bounce mt-6 flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-6 py-3 text-sm font-semibold text-white hover:bg-[#75523F]"
          >
            Essayer 7 jours gratuits
          </Link>
        </div>

        {/* Mensuelle */}
        <div className="rounded-2xl border border-encre/15 bg-white p-6">
          <p className="mt-3 font-semibold text-encre">Formule mensuelle</p>
          <p className="mt-2">
            <span className="font-display text-4xl italic text-[#75523F]">
              {ABONNEMENT.mensuel} €
            </span>
            <span className="text-sm text-encre/70"> /mois</span>
          </p>
          <p className="mt-1 text-xs text-encre/60">
            Sans engagement, facturé chaque mois
          </p>
          <Link
            href={lienChoix("mensuelle")}
            className="btn-bounce mt-6 flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-[#75523F] px-6 py-3 text-sm font-semibold text-[#75523F] hover:bg-[#75523F]/10"
          >
            Essayer 7 jours gratuits
          </Link>
        </div>
      </section>

      <p className="pb-12 text-center text-xs text-encre/60">
        Vous serez invité(e) à créer votre compte ou à vous connecter avant de
        valider.
      </p>
    </main>
  );
}