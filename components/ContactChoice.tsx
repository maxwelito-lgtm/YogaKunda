"use client";

import { useRef, useState } from "react";

type Props = { telephone: string; email: string };
type Etat = "repos" | "envoi" | "ok" | "erreur";

const bouton =
  "btn-bounce inline-flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F] sm:w-auto sm:min-w-[210px]";
const carte =
  "flex flex-col items-center rounded-2xl bg-white p-8 text-center shadow-lg ring-1 ring-black/5";
const champ =
  "w-full min-h-[44px] rounded-md border border-encre/20 bg-[#F5F3E7]/60 px-3 py-2 focus:border-[#75523F] focus:outline-none focus:ring-1 focus:ring-[#75523F]";

export default function ContactChoice({ telephone, email }: Props) {
  const [formOuvert, setFormOuvert] = useState(false);
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");
  const formRef = useRef<HTMLDivElement>(null);

  // "06 74 15 76 78" -> "+33674157678"
  const numeroTel = "+33" + telephone.replace(/\D/g, "").replace(/^0/, "");

  function ouvrirFormulaire() {
    setFormOuvert(true);
    setTimeout(
      () =>
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      50
    );
  }

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setEtat("envoi");
    setErreur("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: data.get("nom"),
          email: data.get("email"),
          message: data.get("message"),
          website: data.get("website"), // champ piège anti-robots
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErreur(json.error || "L'envoi a échoué. Merci de réessayer.");
        setEtat("erreur");
        return;
      }
      form.reset();
      setEtat("ok");
    } catch {
      setErreur("Connexion impossible. Merci de réessayer.");
      setEtat("erreur");
    }
  }

  return (
    <div>
      <div className="grid gap-6 sm:grid-cols-2">
        {/* Appeler */}
        <div className={carte}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#75523F]/10 text-[#75523F]">
            <PhoneIcon />
          </span>
          <h2 className="mt-4 font-display text-2xl italic text-encre">
            Appeler
          </h2>
          <p className="mt-2 flex-1 text-sm text-encre/70">
            Pour échanger directement avec Chantal.
          </p>
          <p className="mt-4 text-lg font-semibold text-encre">{telephone}</p>
          <a href={`tel:${numeroTel}`} className={`${bouton} mt-5`}>
            Appeler
          </a>
        </div>

        {/* Écrire */}
        <div className={carte}>
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#75523F]/10 text-[#75523F]">
            <MailIcon />
          </span>
          <h2 className="mt-4 font-display text-2xl italic text-encre">
            Écrire
          </h2>
          <p className="mt-2 flex-1 text-sm text-encre/70">
            Votre message arrive directement dans la boîte mail de Chantal.
          </p>
          <p className="mt-4 break-all text-sm text-encre/60">{email}</p>
          <button
            type="button"
            onClick={ouvrirFormulaire}
            className={`${bouton} mt-5`}
          >
            Écrire un message
          </button>
        </div>
      </div>

      {formOuvert && (
        <div
          ref={formRef}
          className="mt-8 scroll-mt-24 rounded-2xl bg-white p-6 shadow-lg ring-1 ring-black/5 sm:p-8"
        >
          {etat === "ok" ? (
            <div className="py-6 text-center" role="status">
              <h3 className="font-display text-3xl italic text-encre">
                Message envoyé
              </h3>
              <p className="mt-3 text-encre/70">
                Merci, Chantal vous répondra dès que possible.
              </p>
            </div>
          ) : (
            <form onSubmit={envoyer} className="space-y-5">
              <h3 className="text-center font-display text-3xl italic text-encre">
                Votre message
              </h3>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-encre">
                  Votre nom *
                </span>
                <input
                  name="nom"
                  type="text"
                  required
                  maxLength={100}
                  autoComplete="name"
                  className={champ}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-encre">
                  Votre e-mail (pour recevoir la réponse) *
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  autoComplete="email"
                  className={champ}
                />
              </label>

              <label className="block">
                <span className="mb-1 block text-sm font-semibold text-encre">
                  Message *
                </span>
                <textarea
                  name="message"
                  required
                  minLength={10}
                  maxLength={5000}
                  rows={6}
                  className={`${champ} resize-y`}
                />
              </label>

              {/* Champ piège : invisible pour les humains */}
              <div className="hidden" aria-hidden="true">
                <label>
                  Site web
                  <input
                    name="website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </label>
              </div>

              {etat === "erreur" && (
                <p role="alert" className="text-center text-sm text-alerte">
                  {erreur}
                </p>
              )}

              <div className="text-center">
                <button
                  type="submit"
                  disabled={etat === "envoi"}
                  className={`${bouton} disabled:opacity-60`}
                >
                  {etat === "envoi" ? "Envoi en cours…" : "Envoyer le message"}
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}