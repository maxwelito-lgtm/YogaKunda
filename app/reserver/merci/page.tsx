import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ActualiserAuto from "@/components/ActualiserAuto";
import { createClient } from "@/lib/supabase/server";
import { euros, offres } from "@/data/offres";

export const metadata: Metadata = {
  title: "Merci — Shantalam",
  robots: { index: false },
};

type Props = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function MerciPage({ searchParams }: Props) {
  const { session_id } = await searchParams;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/connexion?next=/mon-espace");

  // La sécurité de la base ne laisse lire que ses propres commandes.
  const { data: commande } = session_id
    ? await supabase
        .from("commandes")
        .select("offre, formule, rythme, seances, montant_centimes, statut")
        .eq("stripe_session_id", session_id)
        .maybeSingle()
    : { data: null };

  const offre = offres.find((o) => o.id === commande?.offre);
  const payee = commande?.statut === "payee";

  const lignes: [string, string][] = [];
  if (commande && offre) {
    lignes.push(["Pratique", offre.nom]);
    if (offre.trimestre) {
      lignes.push([
        "Formule",
        commande.formule === "trim" ? "Trimestre" : "Au cours",
      ]);
    }
    lignes.push([
      commande.seances > 1 ? "Séances" : "Séance",
      String(commande.seances),
    ]);
    lignes.push(["Montant", euros(commande.montant_centimes / 100)]);
  }

  return (
    <main style={{ backgroundColor: "#F5F3E7" }}>
      <Header />

      <div className="mx-auto max-w-xl px-4 pb-20 pt-36 sm:px-6">
        <div className="rounded-3xl bg-white p-7 text-center shadow-lg ring-1 ring-black/5 sm:p-10">
          {!commande || !offre ? (
            <>
              <h1 className="font-display text-3xl italic text-encre sm:text-4xl">
                Commande introuvable
              </h1>
              <p className="mt-3 text-sm text-encre/70">
                Nous ne retrouvons pas cette commande. Si vous avez été débité(e),
                écrivez-nous et nous vérifierons tout de suite.
              </p>
              <Link
                href="/nous-contacter"
                className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F]"
              >
                Nous contacter
              </Link>
            </>
          ) : (
            <>
              <h1 className="font-display text-3xl italic text-encre sm:text-4xl">
                {payee ? "Merci, votre paiement est confirmé" : "Paiement en cours de validation"}
              </h1>

              {payee ? (
                <p className="mt-3 text-sm text-encre/70">
                  Chantal vous contacte très bientôt, au numéro que vous avez
                  indiqué, pour fixer les dates avec vous.
                </p>
              ) : (
                <>
                  <p role="status" className="mt-3 text-sm text-encre/70">
                    Votre paiement est en cours de confirmation, cette page se met
                    à jour toute seule. Si rien ne change, rechargez-la dans un
                    instant.
                  </p>
                  <ActualiserAuto />
                </>
              )}

              <ul className="mx-auto mt-7 grid max-w-sm gap-2 text-left text-sm">
                {lignes.map(([nom, valeur]) => (
                  <li
                    key={nom}
                    className="flex justify-between gap-3 border-b border-encre/10 pb-2"
                  >
                    <span className="text-encre/60">{nom}</span>
                    <span className="min-w-0 text-right font-semibold text-encre">
                      {valeur}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href="/mon-espace"
                className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded-pill border border-encre/30 px-6 py-2.5 text-sm font-semibold text-encre hover:bg-[#F5F3E7]"
              >
                Aller à mon espace
              </Link>
            </>
          )}
        </div>
      </div>

      <Footer />
    </main>
  );
}