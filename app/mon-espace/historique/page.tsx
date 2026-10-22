import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";
import { estAbonne } from "@/lib/espace";
import { ABONNEMENT, offres, euros } from "@/data/offres";

export const metadata: Metadata = {
  title: "Mes achats — Shantalam",
  robots: { index: false },
};

type Commande = {
  id: string;
  offre: string;
  formule: string | null;
  rythme: number | null;
  seances: number | null;
  montant_centimes: number;
  paye_le: string | null;
  created_at: string;
};

function dateFr(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function detailCommande(c: Commande): string {
  const offre = offres.find((o) => o.id === c.offre);
  const n = c.seances ?? 1;
  if (c.formule === "trim" || c.formule === "annee") {
    const rythme = c.rythme && c.rythme > 0 ? ` · ${c.rythme} par semaine` : "";
    const nom = c.formule === "annee" ? "Année scolaire" : "Trimestre";
    return `${nom} · ${n} ${offre?.unite === "cours" ? "cours" : "séances"}${rythme}`;
  }
  if (offre?.unite === "cours") return n > 1 ? `${n} cours` : "1 cours";
  return n > 1 ? `${n} séances` : "1 séance";
}

export default async function HistoriquePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/connexion?next=/mon-espace/historique");

  const { data: abo } = await supabase
    .from("abonnements")
    .select("statut, formule, fin_periode, stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const { data: lignes } = await supabase
    .from("commandes")
    .select("id, offre, formule, rythme, seances, montant_centimes, paye_le, created_at")
    .eq("user_id", user.id)
    .eq("statut", "payee")
    .order("paye_le", { ascending: false });

  const commandes = (lignes ?? []) as Commande[];

  const abonne = estAbonne(abo);
  const enEssai = abonne && abo?.statut === "essai";
  const termine = !!abo && abo.statut === "annule";
  const mensuelle = abo?.formule === "mensuelle";
  const prix = mensuelle
    ? `${euros(ABONNEMENT.mensuel)} par mois`
    : `${euros(ABONNEMENT.annuel)} par an`;

  let titreAbo = "Aucun abonnement";
  let ligneAbo = "Accédez à tous les replays, podcasts et au Yoga Nidra.";
  let pastille = "Inactif";
  if (enEssai) {
    titreAbo = "Essai gratuit";
    pastille = "En cours";
    ligneAbo = `Votre essai se termine le ${dateFr(abo?.fin_periode)}. Ensuite : ${prix}, sauf si vous résiliez avant.`;
  } else if (abonne) {
    titreAbo = mensuelle ? "Formule mensuelle" : "Formule annuelle";
    pastille = "Actif";
    ligneAbo = `${prix} · prochain renouvellement le ${dateFr(abo?.fin_periode)}.`;
  } else if (termine) {
    titreAbo = "Abonnement terminé";
    ligneAbo = `Votre abonnement s’est arrêté le ${dateFr(abo?.fin_periode)}. Vous pouvez vous réabonner à tout moment.`;
  }

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <div className="mx-auto max-w-3xl px-4 pb-20 pt-32 sm:px-6">
        <Link
          href="/mon-espace"
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#75523F] hover:underline"
        >
          <span aria-hidden="true">←</span> Mon espace
        </Link>

        <h1 className="mt-4 font-display text-5xl italic leading-none text-encre sm:text-6xl">
          Mes achats
        </h1>
        <p className="mt-3 text-[17px] text-encre/75">
          Votre abonnement et vos réservations, au même endroit.
        </p>

        {/* Abonnement */}
        <section
          aria-labelledby="titre-abonnement"
          className="mt-10 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2
                id="titre-abonnement"
                className="text-xs font-bold uppercase tracking-wider text-[#75523F]"
              >
                Mon abonnement
              </h2>
              <p className="mt-2 font-display text-3xl italic text-encre">
                {titreAbo}
              </p>
            </div>
            <span
              className={`shrink-0 rounded-pill px-3.5 py-1.5 text-xs font-semibold ${
                abonne
                  ? "bg-[#E6EFE8] text-[#4E7A5B]"
                  : "bg-[#F5F3E7] text-encre/70"
              }`}
            >
              {pastille}
            </span>
          </div>

          <p className="mt-3 text-[15px] leading-relaxed text-encre/75">
            {ligneAbo}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {abo?.stripe_subscription_id && (
              <a
                href="/api/portail"
                className="btn-bounce inline-flex min-h-[46px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F] px-6 text-sm font-semibold text-white shadow-[0_0_0_1px_#75523F] hover:bg-[#75523F]/90"
              >
                Gérer mon abonnement et mes factures
              </a>
            )}
            {!abonne && (
              <a
                href="/#abonnement"
                className="btn-bounce inline-flex min-h-[46px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F] px-6 text-sm font-semibold text-white shadow-[0_0_0_1px_#75523F] hover:bg-[#75523F]/90"
              >
                {termine ? "Me réabonner" : "Découvrir l’abonnement"}
              </a>
            )}
          </div>
          {abo?.stripe_subscription_id && (
            <p className="mt-3 text-[13px] text-encre/60">
              Vous y retrouvez vos factures, votre moyen de paiement et la
              résiliation.
            </p>
          )}
        </section>

        {/* Réservations */}
        <section aria-labelledby="titre-reservations" className="mt-10">
          <div className="flex items-baseline justify-between gap-4">
            <h2
              id="titre-reservations"
              className="font-display text-3xl italic text-encre"
            >
              Mes réservations
            </h2>
            {commandes.length > 0 && (
              <span className="text-sm text-encre/60">
                {commandes.length} achat{commandes.length > 1 ? "s" : ""}
              </span>
            )}
          </div>

          {commandes.length === 0 ? (
            <div className="mt-5 rounded-3xl bg-white p-8 text-center shadow-lg ring-1 ring-black/5">
              <p className="font-display text-2xl italic text-encre">
                Aucune réservation pour le moment
              </p>
              <p className="mx-auto mt-2 max-w-md text-[15px] text-encre/70">
                Cours, ateliers et séances apparaîtront ici dès votre premier
                paiement.
              </p>
              <Link
                href="/reserver"
                className="btn-bounce mt-6 inline-flex min-h-[46px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F] px-7 text-sm font-semibold text-white shadow-[0_0_0_1px_#75523F] hover:bg-[#75523F]/90"
              >
                Voir les dates &amp; tarifs
              </Link>
            </div>
          ) : (
            <>
              <ul className="mt-5 grid gap-3">
                {commandes.map((c) => {
                  const offre = offres.find((o) => o.id === c.offre);
                  return (
                    <li
                      key={c.id}
                      className="flex items-center justify-between gap-4 rounded-2xl bg-white p-5 shadow-md ring-1 ring-black/5 sm:px-7"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-encre">
                          {offre?.nom ?? "Réservation"}
                        </p>
                        <p className="mt-0.5 text-sm text-encre/65">
                          {detailCommande(c)}
                        </p>
                        <p className="mt-1 text-[13px] text-encre/55">
                          Payé le {dateFr(c.paye_le ?? c.created_at)}
                        </p>
                      </div>
                      <p className="shrink-0 font-display text-2xl italic text-[#75523F]">
                        {euros(c.montant_centimes / 100)}
                      </p>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-4 text-sm text-encre/65">
                Après chaque réservation, Chantal vous rappelle pour fixer la
                date. Une question ?{" "}
                <Link
                  href="/nous-contacter"
                  className="font-semibold text-[#75523F] hover:underline"
                >
                  Écrivez-lui
                </Link>
                .
              </p>
            </>
          )}
        </section>
      </div>

      <Footer />
    </main>
  );
}