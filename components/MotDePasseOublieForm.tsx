"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Etat = "repos" | "envoi" | "envoye" | "erreur";

const bouton =
  "btn-bounce inline-flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F] disabled:opacity-60";
const champ =
  "w-full min-h-[44px] rounded-md border border-encre/20 bg-[#F5F3E7]/60 px-3 py-2 focus:border-[#75523F] focus:outline-none focus:ring-1 focus:ring-[#75523F]";

export default function MotDePasseOublieForm() {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get("email") || "").trim();

    setEtat("envoi");
    setErreur("");

    const { error } = await createClient().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
        "/nouveau-mot-de-passe"
      )}`,
    });

    if (error && error.status === 429) {
      setErreur("Trop de tentatives. Merci de patienter quelques minutes.");
      setEtat("erreur");
      return;
    }

    // On ne dit jamais si l'adresse existe ou non.
    setEtat("envoye");
  }

  if (etat === "envoye") {
    return (
      <div className="py-4 text-center" role="status">
        <h2 className="font-display text-3xl italic text-encre">
          Vérifiez votre boîte mail
        </h2>
        <p className="mt-3 text-sm text-encre/70">
          Si un compte existe avec cette adresse, vous allez recevoir un lien
          pour choisir un nouveau mot de passe. Pensez à regarder dans vos
          courriers indésirables.
        </p>
        <Link
          href="/connexion"
          className="mt-6 inline-block text-sm font-semibold text-[#75523F] underline underline-offset-2"
        >
          Retour à la connexion
        </Link>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={envoyer} className="space-y-5">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-encre">
            Votre e-mail
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

        {erreur && (
          <p role="alert" className="text-center text-sm text-alerte">
            {erreur}
          </p>
        )}

        <button type="submit" disabled={etat === "envoi"} className={bouton}>
          {etat === "envoi" ? "Un instant…" : "Recevoir mon lien"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-encre/70">
        <Link
          href="/connexion"
          className="font-semibold text-[#75523F] underline underline-offset-2"
        >
          Retour à la connexion
        </Link>
      </p>
    </div>
  );
}