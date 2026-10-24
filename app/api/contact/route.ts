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

  const nom = nettoyerLigne(body.nom, 100);
  const email = nettoyerLigne(body.email, 200);
  const message = String(body.message ?? "").trim().slice(0, 5000);

  if (!nom || !email || message.length < 10) {
    return NextResponse.json(
      { error: "Merci de remplir tous les champs (message : 10 caractères minimum)." },
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
      { error: "L'envoi n'est pas disponible pour le moment. Merci d'appeler directement." },
      { status: 500 }
    );
  }

  const destinataire = process.env.CONTACT_TO || site.email;

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
      subject: `Nouveau message de ${nom} (site ${site.nom})`,
      text: `De : ${nom} <${email}>\n\n${message}`,
      html: `<p><strong>De :</strong> ${echapper(nom)} &lt;${echapper(email)}&gt;</p><p>${echapper(message).replace(/\n/g, "<br>")}</p>`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text());
    return NextResponse.json(
      { error: "L'envoi a échoué. Merci de réessayer ou d'appeler directement." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}