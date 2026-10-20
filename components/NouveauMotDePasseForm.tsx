"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Etat = "repos" | "envoi" | "erreur";

const bouton =
  "btn-bounce inline-flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F] disabled:opacity-60";
const champ =
  "w-full min-h-[44px] rounded-md border border-encre/20 bg-[#F5F3E7]/60 px-3 py-2 focus:border-[#75523F] focus:outline-none focus:ring-1 focus:ring-[#75523F]";

export default function NouveauMotDePasseForm() {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const motDePasse = String(data.get("motdepasse") || "");
    const confirmation = String(data.get("confirmation") || "");

    if (motDePasse.length < 8) {
      setErreur("Le mot de passe doit contenir au moins 8 caractères.");
      setEtat("erreur");
      return;
    }
    if (motDePasse !== confirmation) {
      setErreur("Les deux mots de passe ne sont pas identiques.");
      setEtat("erreur");
      return;
    }

    setEtat("envoi");
    setErreur("");

    const { error } = await createClient().auth.updateUser({
      password: motDePasse,
    });

    if (error) {
      if (error.code === "same_password") {
        setErreur("Choisissez un mot de passe différent de l'ancien.");
      } else if (error.code === "weak_password") {
        setErreur("Ce mot de passe est trop simple. Essayez-en un plus long.");
      } else {
        setErreur(
          "Le mot de passe n'a pas pu être modifié. Demandez un nouveau lien et réessayez."
        );
      }
      setEtat("erreur");
      return;
    }

    window.location.assign("/mon-espace");
  }

  return (
    <form onSubmit={envoyer} className="space-y-5">
      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-encre">
          Nouveau mot de passe
        </span>
        <input
          name="motdepasse"
          type="password"
          required
          minLength={8}
          maxLength={200}
          autoComplete="new-password"
          className={champ}
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-encre">
          Confirmez le mot de passe
        </span>
        <input
          name="confirmation"
          type="password"
          required
          minLength={8}
          maxLength={200}
          autoComplete="new-password"
          className={champ}
        />
      </label>

      {erreur && (
        <p role="alert" className="text-center text-sm text-alerte">
          {erreur}
        </p>
      )}

      <button type="submit" disabled={etat === "envoi"} className={bouton}>
        {etat === "envoi" ? "Un instant…" : "Enregistrer mon mot de passe"}
      </button>
    </form>
  );
}