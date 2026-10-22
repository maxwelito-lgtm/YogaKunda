import type { Metadata } from "next";
import Link from "next/link";
import { exigerAdmin } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { getOffre, lireOffre, euros } from "@/data/offres";
import { site } from "@/site.config";
import { marquerRappelee, remettreARappeler } from "./actions";

export const metadata: Metadata = {
  title: `Réservations — ${site.nom}`,
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Ligne = {
  id: string;
  user_id: string;
  offre: string;
  formule: string;
  seances: number | null;
  montant_centimes: number | null;
  paye_le: string | null;
  telephone: string | null;
  rappelee_le: string | null;
  date_fixee: string | null;
};

type Client = { nom: string; email: string };

type Props = { searchParams: Promise<{ vue?: string }> };

const fuseau = "Europe/Paris";

function jour(iso: string | null): string {
  if (!iso) return "";
  const d = iso.length === 10 ? new Date(`${iso}T12:00:00`) : new Date(iso);
  return d.toLocaleDateString("fr-FR", { timeZone: fuseau, day: "numeric", month: "long", year: "numeric" });
}

function jourHeure(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso)
    .toLocaleString("fr-FR", {
      timeZone: fuseau,
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replace(":", " h ");
}

function detail(l: Ligne): string {
  const o = getOffre(lireOffre(l.offre));
  const n = Number(l.seances) || 1;
  const nb = `${n} ${o.unite}${n > 1 ? "s" : ""}`;
  const forfait =
    l.formule === "trim" ? `trimestre · ${nb}` : l.formule === "annee" ? `année scolaire · ${nb}` : nb;
  return `${o.nom} · ${forfait} · ${euros((l.montant_centimes ?? 0) / 100)}`;
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

export default async function ReservationsPage({ searchParams }: Props) {
  await exigerAdmin("/admin/reservations");

  const { vue: vueBrute } = await searchParams;
  const vue = vueBrute === "rappelees" || vueBrute === "toutes" ? vueBrute : "a-rappeler";

  const { data, error } = await createAdminClient()
    .from("commandes")
    .select("id, user_id, offre, formule, seances, montant_centimes, paye_le, telephone, rappelee_le, date_fixee")
    .eq("statut", "payee")
    .order("paye_le", { ascending: false })
    .limit(200);
  if (error) console.error("Admin : lecture des réservations", error);

  const lignes = (data ?? []) as Ligne[];
  const aRappeler = lignes.filter((l) => !l.rappelee_le);
  const rappelees = lignes.filter((l) => l.rappelee_le);

  // À rappeler : les plus anciennes d'abord (ce sont celles qui attendent depuis le plus longtemps).
  const affichees =
    vue === "rappelees" ? rappelees : vue === "toutes" ? lignes : [...aRappeler].reverse();

  const clients = await lireClients(Array.from(new Set(affichees.map((l) => l.user_id))));

  const onglets = [
    { id: "a-rappeler", titre: `À rappeler · ${aRappeler.length}`, href: "/admin/reservations" },
    { id: "rappelees", titre: "Rappelées", href: "/admin/reservations?vue=rappelees" },
    { id: "toutes", titre: "Toutes", href: "/admin/reservations?vue=toutes" },
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

        <h1 className="font-display text-4xl italic leading-tight">Réservations</h1>

        <nav className="flex flex-wrap gap-2" aria-label="Filtrer les réservations">
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
            Impossible de lire les réservations. Vérifiez que la mise à jour de la base de données a bien été faite.
          </p>
        )}

        {!error && affichees.length === 0 && (
          <p className="rounded-3xl bg-white p-6 text-center text-encre/70">
            {vue === "a-rappeler" ? "Personne à rappeler pour le moment." : "Rien à afficher ici."}
          </p>
        )}

        {affichees.map((l) => (
          <Fiche key={l.id} ligne={l} client={clients.get(l.user_id) ?? { nom: "", email: "" }} />
        ))}
      </div>
    </main>
  );
}

function Fiche({ ligne, client }: { ligne: Ligne; client: Client }) {
  const rappelee = Boolean(ligne.rappelee_le);
  const tel = ligne.telephone?.trim() ?? "";

  return (
    <article className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-xl font-semibold">{client.nom || client.email || "Client"}</h2>
          <p className="mt-1 text-sm text-encre/70">{detail(ligne)}</p>
        </div>
        <span
          className={`whitespace-nowrap rounded-pill px-3 py-1 text-xs font-semibold ${
            rappelee ? "bg-[#E6EFE8] text-[#3f6b4d]" : "bg-[#F3E3D6] text-[#75523F]"
          }`}
        >
          {rappelee ? "Rappelée" : "À rappeler"}
        </span>
      </div>

      <div className="flex flex-col gap-1 text-sm text-encre/80">
        <span>Payé le {jourHeure(ligne.paye_le)}</span>
        {client.email && (
          <a href={`mailto:${client.email}`} className="break-all text-[#75523F] underline underline-offset-2">
            {client.email}
          </a>
        )}
      </div>

      {tel ? (
        <a
          href={`tel:${tel.replace(/[^\d+]/g, "")}`}
          className="btn-bounce inline-flex min-h-[54px] items-center justify-center gap-2 rounded-pill bg-[#75523F] px-6 py-3 text-base font-semibold text-white"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path
              d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z"
              stroke="#fff"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
          Appeler le {tel}
        </a>
      ) : (
        <p className="rounded-2xl bg-[#F5F3E7] p-3 text-sm text-encre/70">
          Pas de numéro de téléphone enregistré : écrivez à la personne par e-mail.
        </p>
      )}

      {rappelee ? (
        <div className="flex flex-col gap-3 border-t border-encre/10 pt-4">
          <p className="text-sm text-encre/80">
            Rappelée le {jourHeure(ligne.rappelee_le)}
            {ligne.date_fixee ? ` · séance prévue le ${jour(ligne.date_fixee)}` : ""}.
          </p>
          <form action={remettreARappeler}>
            <input type="hidden" name="id" value={ligne.id} />
            <button
              type="submit"
              className="inline-flex min-h-[44px] items-center justify-center rounded-pill border-[1.5px] border-[#75523F] px-5 py-2 text-sm font-semibold text-[#75523F]"
            >
              Remettre à rappeler
            </button>
          </form>
        </div>
      ) : (
        <form action={marquerRappelee} className="flex flex-col gap-3 border-t border-encre/10 pt-4">
          <input type="hidden" name="id" value={ligne.id} />
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Date de séance fixée avec la personne (facultatif)
            <input
              type="date"
              name="date"
              className="min-h-[48px] rounded-xl border border-encre/20 bg-[#F5F3E7]/60 px-3 font-normal"
            />
          </label>
          <button
            type="submit"
            className="btn-bounce inline-flex min-h-[50px] items-center justify-center rounded-pill bg-encre px-6 py-3 text-base font-semibold text-white"
          >
            J’ai rappelé cette personne
          </button>
        </form>
      )}
    </article>
  );
}