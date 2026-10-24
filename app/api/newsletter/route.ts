import { NextResponse } from "next/server";
import { site } from "@/site.config";

export const runtime = "nodejs";

const echapper = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const nettoyerLigne = (s: unknown, max: number) =>
  String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }

  // Champ piège rempli = robot : on répond "ok" sans rien envoyer
  if (String(body.website ?? "").trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const prenom = nettoyerLigne(body.prenom, 100);
  const nom = nettoyerLigne(body.nom, 100);
  const email = nettoyerLigne(body.email, 200);

  if (body.consentement !== true) {
    return NextResponse.json(
      { error: "Merci de cocher la case de consentement." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Adresse e-mail invalide." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY manquante");
    return NextResponse.json(
      { error: "L'inscription n'est pas disponible pour le moment." },
      { status: 500 }
    );
  }

  const destinataire = process.env.CONTACT_TO || site.email;
  const identite = [prenom, nom].filter(Boolean).join(" ") || "(nom non renseigné)";
  const date = new Date().toLocaleString("fr-FR", { timeZone: "Europe/Paris" });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM || `${site.nom} <onboarding@resend.dev>`,
      to: [destinataire],
      reply_to: email,
      subject: `Nouvelle inscription à la newsletter : ${identite}`,
      text: `Nouvelle inscription à la newsletter\n\nNom : ${identite}\nE-mail : ${email}\nDate : ${date}\nConsentement : oui (case cochée)`,
      html: `<p><strong>Nouvelle inscription à la newsletter</strong></p><p>Nom : ${echapper(identite)}<br>E-mail : ${echapper(email)}<br>Date : ${echapper(date)}<br>Consentement : oui (case cochée)</p>`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json(
      { error: "L'inscription a échoué. Merci de réessayer." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}