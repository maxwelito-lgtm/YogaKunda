import { site } from "@/site.config";
import { euros } from "@/data/offres";

// ------------------------------------------------------------------
// E-mails envoyés par le site (via Resend) :
//  - à Chantal : une alerte à chaque réservation payée et à chaque nouvel abonné
//  - au client : une confirmation (réservation) ou un message de bienvenue (abonnement)
//
// Réglages (variables d'environnement Vercel) :
//  - RESEND_API_KEY : clé Resend (déjà utilisée par le formulaire de contact)
//  - NOTIF_TO       : adresse qui reçoit les alertes (sinon CONTACT_TO, sinon site.email)
//  - EMAIL_FROM     : expéditeur, par exemple « Shantalam <bonjour@votre-domaine.fr> ».
//                     Sans domaine vérifié dans Resend, on garde l'adresse de test (valeur par défaut).
// ------------------------------------------------------------------

const echapper = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function dateHeureFr(d: Date): string {
  return d.toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function dateFr(d: Date): string {
  return d.toLocaleDateString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function destinataireAlertes(): string {
  return process.env.NOTIF_TO || process.env.CONTACT_TO || site.email;
}

type Message = {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

// Envoie un e-mail. Ne lève jamais d'erreur : renvoie true si c'est parti.
async function envoyer(m: Message): Promise<boolean> {
  const cle = process.env.RESEND_API_KEY;
  if (!cle) {
    console.error("E-mail non envoyé : RESEND_API_KEY manquante");
    return false;
  }
  const from = process.env.EMAIL_FROM || `${site.nom} <onboarding@resend.dev>`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cle}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [m.to],
        subject: m.subject,
        html: m.html,
        text: m.text,
        ...(m.replyTo ? { reply_to: m.replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(
        `E-mail refusé par Resend (${res.status}) pour « ${m.subject} » :`,
        await res.text()
      );
      return false;
    }
    return true;
  } catch (erreur) {
    console.error(`E-mail non envoyé : « ${m.subject} »`, erreur);
    return false;
  }
}

// Mise en page commune : fond crème, carte blanche, titre en brun.
function gabarit(titre: string, corps: string): string {
  return `<!doctype html>
<html lang="fr">
<body style="margin:0;padding:24px;background:#F5F3E7;font-family:Arial,Helvetica,sans-serif;color:#2B1F19;">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;">
    <p style="margin:0 0 4px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:#75523F;">${echapper(site.nom)}</p>
    <h1 style="margin:0 0 18px;font-size:22px;line-height:1.3;color:#2B1F19;">${titre}</h1>
    ${corps}
  </div>
</body>
</html>`;
}

function tableau(lignes: [string, string][]): string {
  const rangs = lignes
    .map(
      ([nom, valeur]) =>
        `<tr><td style="padding:8px 0;border-bottom:1px solid #eee;color:#75523F;width:38%;vertical-align:top;">${echapper(nom)}</td><td style="padding:8px 0;border-bottom:1px solid #eee;font-weight:bold;">${echapper(valeur)}</td></tr>`
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:15px;">${rangs}</table>`;
}

// ------------------------------------------------------------------
// Réservation payée (cours, atelier, séance, thérapie)
// ------------------------------------------------------------------

export type Achat = {
  commandeId: string;
  offreNom: string; // « Atelier Tantra »
  detail: string; // « Au trimestre · 12 séances »
  surRendezVous: boolean; // séance individuelle : rendez-vous à fixer
  montantCentimes: number;
  nomClient: string;
  emailClient: string;
  telephone: string | null;
  payeLe: Date;
  cgvAcceptees: Date | null;
  origine: string; // adresse du site, pour les liens
};

export async function alerteAchat(a: Achat): Promise<boolean> {
  const montant = euros(a.montantCentimes / 100);
  const tel = a.telephone || "non renseigné";
  const lignes: [string, string][] = [
    ["Client", a.nomClient || "(nom non renseigné)"],
    ["E-mail", a.emailClient || "non renseigné"],
    ["Téléphone", tel],
    ["Offre", a.offreNom],
    ["Détail", a.detail],
    ["Montant payé", montant],
    ["Payé le", dateHeureFr(a.payeLe)],
    [
      "CGV acceptées",
      a.cgvAcceptees ? `oui, le ${dateHeureFr(a.cgvAcceptees)}` : "non enregistré",
    ],
    ["Référence", a.commandeId],
  ];

  const aFaire = a.surRendezVous
    ? "À faire : rappeler le client pour fixer le rendez-vous."
    : "À faire : rappeler le client pour fixer la date.";

  const html = gabarit(
    `Nouvelle réservation : ${echapper(a.offreNom)}`,
    `<p style="margin:0 0 16px;font-size:15px;"><strong>${echapper(aFaire)}</strong></p>${tableau(lignes)}`
  );
  const text = `Nouvelle réservation : ${a.offreNom}\n\n${aFaire}\n\n${lignes
    .map(([n, v]) => `${n} : ${v}`)
    .join("\n")}`;

  return envoyer({
    to: destinataireAlertes(),
    subject: `Nouvelle réservation : ${a.offreNom} (${montant})`,
    html,
    text,
    replyTo: a.emailClient || undefined,
  });
}

export async function confirmationAchat(a: Achat): Promise<boolean> {
  if (!a.emailClient) return false;
  const montant = euros(a.montantCentimes / 100);
  const lignes: [string, string][] = [
    ["Pratique", a.offreNom],
    ["Détail", a.detail],
    ["Montant", montant],
    ["Date du paiement", dateFr(a.payeLe)],
  ];
  const suite = a.telephone
    ? `Chantal vous rappelle très bientôt au ${a.telephone} pour ${
        a.surRendezVous ? "fixer le rendez-vous" : "fixer la date"
      } avec vous.`
    : `Chantal vous contacte très bientôt pour ${
        a.surRendezVous ? "fixer le rendez-vous" : "fixer la date"
      } avec vous.`;
  const prenom = a.nomClient.split(" ")[0] || "";

  const html = gabarit(
    "Votre réservation est confirmée",
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;">Bonjour${prenom ? ` ${echapper(prenom)}` : ""}, merci pour votre confiance. Votre paiement est bien enregistré.</p>
    ${tableau(lignes)}
    <p style="margin:18px 0 0;font-size:15px;line-height:1.6;">${echapper(suite)}</p>
    <p style="margin:14px 0 0;font-size:14px;line-height:1.6;color:#555;">Vous retrouvez cette réservation dans votre espace : <a href="${echapper(a.origine)}/mon-espace/historique" style="color:#75523F;">Mes achats</a>. Pour toute question, répondez simplement à cet e-mail ou appelez le ${echapper(site.telephone)}.</p>`
  );
  const text = `Bonjour${prenom ? ` ${prenom}` : ""},\n\nMerci pour votre confiance. Votre paiement est bien enregistré.\n\n${lignes
    .map(([n, v]) => `${n} : ${v}`)
    .join("\n")}\n\n${suite}\n\nVos achats : ${a.origine}/mon-espace/historique\nQuestions : ${site.telephone}\n\n${site.nom}`;

  return envoyer({
    to: a.emailClient,
    subject: `Votre réservation ${site.nom} est confirmée`,
    html,
    text,
    replyTo: destinataireAlertes(),
  });
}

// ------------------------------------------------------------------
// Nouvel abonnement à l'espace en ligne
// ------------------------------------------------------------------

export type Abonnement = {
  nomClient: string;
  emailClient: string;
  statut: "essai" | "actif";
  formule: "mensuelle" | "annuelle";
  finPeriode: Date | null; // fin de l'essai ou de la période
  origine: string;
};

const libelleFormule = (f: Abonnement["formule"]) =>
  f === "mensuelle" ? "mensuelle" : "annuelle";

export async function alerteAbonnement(a: Abonnement): Promise<boolean> {
  const lignes: [string, string][] = [
    ["Client", a.nomClient || "(nom non renseigné)"],
    ["E-mail", a.emailClient || "non renseigné"],
    ["Formule", libelleFormule(a.formule)],
    ["Situation", a.statut === "essai" ? "Essai gratuit de 7 jours" : "Abonnement actif"],
    [
      a.statut === "essai" ? "Fin de l'essai" : "Prochaine échéance",
      a.finPeriode ? dateFr(a.finPeriode) : "non précisée",
    ],
  ];
  const html = gabarit(
    "Nouvel abonné à l'espace en ligne",
    tableau(lignes)
  );
  const text = `Nouvel abonné à l'espace en ligne\n\n${lignes
    .map(([n, v]) => `${n} : ${v}`)
    .join("\n")}`;

  return envoyer({
    to: destinataireAlertes(),
    subject: `Nouvel abonné : ${a.nomClient || a.emailClient}`,
    html,
    text,
    replyTo: a.emailClient || undefined,
  });
}

export async function confirmationAbonnement(a: Abonnement): Promise<boolean> {
  if (!a.emailClient) return false;
  const prenom = a.nomClient.split(" ")[0] || "";
  const intro =
    a.statut === "essai"
      ? `Votre essai gratuit de 7 jours est commencé${
          a.finPeriode ? ` et court jusqu'au ${dateFr(a.finPeriode)}` : ""
        }. Vous pouvez résilier à tout moment depuis votre espace, avant cette date, sans être débité(e).`
      : "Votre abonnement à l'espace en ligne est actif.";

  const html = gabarit(
    "Bienvenue dans l'espace en ligne",
    `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Bonjour${prenom ? ` ${echapper(prenom)}` : ""}, merci de nous rejoindre.</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">${echapper(intro)}</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.6;">Retrouvez vos contenus ici : <a href="${echapper(a.origine)}/mon-espace" style="color:#75523F;">Mon espace</a>. Pour gérer votre abonnement ou télécharger vos factures : « Gérer mon abonnement » dans votre espace.</p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#555;">Une question ? Répondez simplement à cet e-mail ou appelez le ${echapper(site.telephone)}.</p>`
  );
  const text = `Bonjour${prenom ? ` ${prenom}` : ""},\n\nMerci de nous rejoindre.\n\n${intro}\n\nMon espace : ${a.origine}/mon-espace\nQuestions : ${site.telephone}\n\n${site.nom}`;

  return envoyer({
    to: a.emailClient,
    subject: `Bienvenue dans l'espace en ligne ${site.nom}`,
    html,
    text,
    replyTo: destinataireAlertes(),
  });
}
