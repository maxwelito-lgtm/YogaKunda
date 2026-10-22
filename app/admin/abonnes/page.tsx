import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Abonnés — ${site.nom}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Ligne = {
  user_id: string;
  statut: string;
  formule: string | null;
  fin_periode: string | null;
  updated_at: string | null;
};

type Client = { nom: string; email: string };

type Props = { searchParams: Promise<{ vue?: string }> };

function jour(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

async function lireClients(ids: string[]): Promise<Map<string, Client>> {
  const admin = createAdminClient();
  const paires = await Promise.all(
    ids.map(async (id): Promise<[string, Client]> => {
      try {
        const { data } = await admin.auth.admin.getUserById(id);
        const u = data?.user;
        const m = (u?.user_metadata ?? {}) as { prenom?: string; nom?: string };
        return [id, { nom: [m.prenom, m.nom].filter(Boolean).join(" ").trim(), email: u?.email ?? "" }];
      } catch {
        return [id, { nom: "", email: "" }];
      }
    })
  );
  return new Map(paires);
}

export default async function AbonnesPage({ searchParams }: Props) {
  await exigerAdmin("/admin/abonnes");

  const { vue: vueBrute } = await searchParams;
  const vue = vueBrute === "essai" || vueBrute === "termines" ? vueBrute : "en-cours";

  const { data, error } = await createAdminClient()
    .from("abonnements")
    .select("user_id, statut, formule, fin_periode, updated_at")
    .in("statut", ["essai", "actif", "annule"])
    .order("updated_at", { ascending: false })
    .limit(300);
  if (error) console.error("Admin : lecture des abonnés", error);

  const lignes = (data ?? []) as Ligne[];
  const enCours = lignes.filter((l) => l.statut === "essai" || l.statut === "actif");
  const enEssai = lignes.filter((l) => l.statut === "essai");
  const termines = lignes.filter((l) => l.statut === "annule");

  const affichees = vue === "essai" ? enEssai : vue === "termines" ? termines : enCours;
  const clients = await lireClients(Array.from(new Set(affichees.map((l) => l.user_id))));

  const onglets = [
    { id: "en-cours", titre: `En cours · ${enCours.length}`, href: "/admin/abonnes" },
    { id: "essai", titre: `En essai · ${enEssai.length}`, href: "/admin/abonnes?vue=essai" },
    { id: "termines", titre: `Terminés · ${termines.length}`, href: "/admin/abonnes?vue=termines" },
  ];

  return (
    <main className="min-h-screen bg-[#F5F3E7] text-encre">
      <div className="mx-auto flex max-w-2xl flex-col gap-5 px-5 pb-14 pt-6 sm:px-6">
        <Link href="/admin" className="inline-flex items-center gap-1 text-[15px] font-semibold text-[#75523F]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="m14 6-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Accueil
        </Link>

        <h1 className="font-display text-4xl italic leading-tight">Mes abonnés</h1>
        <p className="-mt-2 text-sm text-encre/70">
          Les personnes qui ont accès à l’espace en ligne. Les abonnements se gèrent dans Stripe.
        </p>

        <nav className="flex flex-wrap gap-2" aria-label="Filtrer les abonnés">
          {onglets.map((o) => (
            <Link
              key={o.id}
              href={o.href}
              aria-current={vue === o.id ? "page" : undefined}
              className={`rounded-pill px-4 py-2.5 text-sm font-semibold ${
                vue === o.id ? "bg-encre text-white" : "bg-white text-encre"
              }`}
            >
              {o.titre}
            </Link>
          ))}
        </nav>

        {error && (
          <p role="alert" className="rounded-2xl bg-white p-4 text-sm text-alerte">
            Impossible de lire la liste des abonnés pour le moment.
          </p>
        )}

        {!error && affichees.length === 0 && (
          <p className="rounded-3xl bg-white p-6 text-center text-encre/70">Aucun abonné dans cette liste.</p>
        )}

        {affichees.map((l) => {
          const c = clients.get(l.user_id) ?? { nom: "", email: "" };
          const essai = l.statut === "essai";
          const termine = l.statut === "annule";
          const formule = l.formule === "mensuelle" ? "mensuelle" : "annuelle";
          return (
            <article key={l.user_id} className="flex flex-col gap-3 rounded-3xl bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="text-lg font-semibold">{c.nom || c.email || "Client"}</h2>
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="break-all text-sm text-[#75523F] underline underline-offset-2">
                      {c.email}
                    </a>
                  )}
                </div>
                <span
                  className={`whitespace-nowrap rounded-pill px-3 py-1 text-xs font-semibold ${
                    termine
                      ? "bg-encre/10 text-encre/70"
                      : essai
                        ? "bg-[#F3E3D6] text-[#75523F]"
                        : "bg-[#E6EFE8] text-[#3f6b4d]"
                  }`}
                >
                  {termine ? "Terminé" : essai ? "En essai" : "Abonné(e)"}
                </span>
              </div>
              <p className="text-sm text-encre/75">
                Formule {formule}
                {l.fin_periode
                  ? termine
                    ? ` · terminé le ${jour(l.fin_periode)}`
                    : essai
                      ? ` · essai jusqu’au ${jour(l.fin_periode)}`
                      : ` · prochain renouvellement le ${jour(l.fin_periode)}`
                  : ""}
              </p>
            </article>
          );
        })}
      </div>
    </main>
  );
}