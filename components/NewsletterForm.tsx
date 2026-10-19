"use client";

import { useState } from "react";

type Etat = "repos" | "envoi" | "ok" | "erreur";

const champ =
  "w-full min-h-[44px] rounded-md border border-encre/20 bg-white px-3 py-2";

export default function NewsletterForm() {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setEtat("envoi");
    setErreur("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prenom: data.get("prenom"),
          nom: data.get("nom"),
          email: data.get("email"),
          consentement: data.get("consentement") === "on",
          website: data.get("website"), // champ piège anti-robots
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErreur(json.error || "L'inscription a échoué. Merci de réessayer.");
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

  if (etat === "ok") {
    return (
      <div className="text-left" role="status">
        <h2 className="text-2xl">Merci !</h2>
        <p className="mt-4 text-encre/80">
          Votre inscription à la newsletter est bien prise en compte.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} className="text-left">
      <h2 className="text-2xl">Abonnez-vous à la newsletter</h2>
      <div className="mt-4 space-y-4">
        <label className="block">
          <span className="mb-1 block font-display text-sm italic">Prénom</span>
          <input
            type="text"
            name="prenom"
            maxLength={100}
            autoComplete="given-name"
            className={champ}
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-display text-sm italic">Nom</span>
          <input
            type="text"
            name="nom"
            maxLength={100}
            autoComplete="family-name"
            className={champ}
          />
        </label>
        <label className="block">
          <span className="mb-1 block font-display text-sm italic">
            E-mail *
          </span>
          <input
            type="email"
            name="email"
            required
            maxLength={200}
            autoComplete="email"
            className={champ}
          />
        </label>

        <label className="flex items-start gap-3 text-sm text-encre/80">
          <input
            type="checkbox"
            name="consentement"
            required
            className="mt-1 h-5 w-5 flex-none accent-[#75523F]"
          />
          <span>
            J&rsquo;accepte de recevoir la newsletter. Je peux me désinscrire à
            tout moment. *
          </span>
        </label>

        {/* Champ piège : invisible pour les humains */}
        <div className="hidden" aria-hidden="true">
          <label>
            Site web
            <input name="website" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        {etat === "erreur" && (
          <p role="alert" className="text-sm text-alerte">
            {erreur}
          </p>
        )}

        <button
          type="submit"
          disabled={etat === "envoi"}
          className="btn-bounce min-h-[44px] w-full rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-6 py-3 text-sm font-semibold text-white hover:bg-[#75523F] disabled:opacity-60 sm:w-auto"
        >
          {etat === "envoi" ? "Inscription…" : "S\u2019inscrire"}
        </button>
      </div>
    </form>
  );
}