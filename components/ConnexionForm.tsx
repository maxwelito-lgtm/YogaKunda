"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "motdepasse" | "lien";
type Etat = "repos" | "envoi" | "lien-envoye" | "erreur";

const bouton =
  "btn-bounce inline-flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F] disabled:opacity-60";
const champ =
  "w-full min-h-[44px] rounded-md border border-encre/20 bg-[#F5F3E7]/60 px-3 py-2 focus:border-[#75523F] focus:outline-none focus:ring-1 focus:ring-[#75523F]";

type Props = { suivant: string; erreurLien?: boolean };

export default function ConnexionForm({ suivant, erreurLien }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("motdepasse");
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState(
    erreurLien ? "Ce lien n'est plus valable. Merci de réessayer." : ""
  );

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") || "").trim();
    const motDePasse = String(data.get("motdepasse") || "");
    const supabase = createClient();

    setEtat("envoi");
    setErreur("");

    if (mode === "motdepasse") {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: motDePasse,
      });
      if (error) {
        setErreur("E-mail ou mot de passe incorrect.");
        setEtat("erreur");
        return;
      }
      router.push(suivant);
      router.refresh();
      return;
    }

    // Lien magique : on ne crée pas de compte ici, et on ne dit jamais
    // si l'adresse existe ou non.
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: false,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          suivant
        )}`,
      },
    });
    if (error && error.status === 429) {
      setErreur("Trop de tentatives. Merci de patienter quelques minutes.");
      setEtat("erreur");
      return;
    }
    setEtat("lien-envoye");
  }

  if (etat === "lien-envoye") {
    return (
      <div className="py-4 text-center" role="status">
        <h2 className="font-display text-3xl italic text-encre">
          Vérifiez votre boîte mail
        </h2>
        <p className="mt-3 text-sm text-encre/70">
          Si un compte existe avec cette adresse, vous allez recevoir un lien de
          connexion. Pensez à regarder dans vos courriers indésirables.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Choix du mode de connexion */}
      <div
        className="mb-6 grid grid-cols-2 gap-1 rounded-pill bg-[#F5F3E7] p-1"
        role="tablist"
      >
        {(
          [
            ["motdepasse", "Mot de passe"],
            ["lien", "Lien par e-mail"],
          ] as const
        ).map(([valeur, libelle]) => (
          <button
            key={valeur}
            type="button"
            role="tab"
            aria-selected={mode === valeur}
            onClick={() => {
              setMode(valeur);
              setErreur("");
              setEtat("repos");
            }}
            className={`min-h-[40px] rounded-pill px-3 text-sm font-semibold transition-colors ${
              mode === valeur
                ? "bg-[#75523F] text-white"
                : "text-encre/70 hover:text-encre"
            }`}
          >
            {libelle}
          </button>
        ))}
      </div>

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

        {mode === "motdepasse" && (
          <label className="block">
            <span className="mb-1 block text-sm font-semibold text-encre">
              Mot de passe
            </span>
            <input
              name="motdepasse"
              type="password"
              required
              maxLength={200}
              autoComplete="current-password"
              className={champ}
            />
            <Link
              href="/mot-de-passe-oublie"
              className="mt-2 inline-block text-sm text-[#75523F] underline underline-offset-2"
            >
              Mot de passe oublié ?
            </Link>
          </label>
        )}

        {mode === "lien" && (
          <p className="text-sm text-encre/70">
            Nous vous envoyons un lien : un clic et vous êtes connecté(e), sans
            mot de passe.
          </p>
        )}

        {erreur && (
          <p role="alert" className="text-center text-sm text-alerte">
            {erreur}
          </p>
        )}

        <button type="submit" disabled={etat === "envoi"} className={bouton}>
          {etat === "envoi"
            ? "Un instant…"
            : mode === "motdepasse"
              ? "Se connecter"
              : "Recevoir mon lien"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-encre/70">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-semibold text-[#75523F] underline underline-offset-2"
        >
          Créer un compte
        </Link>
      </p>
    </div>
  );
}