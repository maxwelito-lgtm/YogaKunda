"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Etat = "repos" | "envoi" | "confirmer" | "erreur";

const bouton =
  "btn-bounce inline-flex min-h-[44px] w-full items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-7 py-3 text-sm font-semibold text-white hover:bg-[#75523F] disabled:opacity-60";
const champ =
  "w-full min-h-[44px] rounded-md border border-encre/20 bg-[#F5F3E7]/60 px-3 py-2 focus:border-[#75523F] focus:outline-none focus:ring-1 focus:ring-[#75523F]";

type Props = { suivant: string };

export default function InscriptionForm({ suivant }: Props) {
  const [etat, setEtat] = useState<Etat>("repos");
  const [erreur, setErreur] = useState("");

  async function envoyer(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const prenom = String(data.get("prenom") || "").trim();
    const nom = String(data.get("nom") || "").trim();
    const email = String(data.get("email") || "").trim();
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

    const supabase = createClient();
    const { data: resultat, error } = await supabase.auth.signUp({
      email,
      password: motDePasse,
      options: {
        data: { prenom, nom, cgv_acceptees_le: new Date().toISOString() },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
          suivant
        )}`,
      },
    });

    if (error) {
      if (error.status === 429) {
        setErreur("Trop de tentatives. Merci de patienter quelques minutes.");
      } else if (error.code === "weak_password") {
        setErreur("Ce mot de passe est trop simple. Essayez-en un plus long.");
      } else {
        setErreur("L'inscription n'a pas abouti. Merci de réessayer.");
      }
      setEtat("erreur");
      return;
    }

    // Si la confirmation par e-mail est désactivée, la personne est déjà connectée :
    // on l'envoie directement à sa destination (par exemple le paiement de l'abonnement).
    if (resultat.session) {
      window.location.assign(suivant);
      return;
    }

    // Message volontairement identique que l'adresse soit nouvelle ou non.
    setEtat("confirmer");
  }

  if (etat === "confirmer") {
    return (
      <div className="py-4 text-center" role="status">
        <h2 className="font-display text-3xl italic text-encre">
          Vérifiez votre boîte mail
        </h2>
        <p className="mt-3 text-sm text-encre/70">
          Pour finaliser votre inscription, cliquez sur le lien que nous venons
          de vous envoyer. Pensez à regarder dans vos courriers indésirables.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={envoyer} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-encre">
            Prénom *
          </span>
          <input
            name="prenom"
            type="text"
            required
            maxLength={80}
            autoComplete="given-name"
            className={champ}
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm font-semibold text-encre">
            Nom *
          </span>
          <input
            name="nom"
            type="text"
            required
            maxLength={80}
            autoComplete="family-name"
            className={champ}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1 block text-sm font-semibold text-encre">
          Votre e-mail *
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
          Mot de passe * <span className="font-normal text-encre/60">(8 caractères minimum)</span>
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
          Confirmer le mot de passe *
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

      <label className="flex items-start gap-3 text-sm text-encre/80">
        <input
          type="checkbox"
          name="consentement"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[#75523F]"
        />
        <span>
          J&apos;accepte que mes données soient utilisées pour gérer mon compte
          et mon accès à l&apos;espace en ligne. *
        </span>
      </label>

      <label className="flex items-start gap-3 text-sm text-encre/80">
        <input
          type="checkbox"
          name="cgv"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-[#75523F]"
        />
        <span>
          J&apos;ai lu et j&apos;accepte les{" "}
          <Link
            href="/cgv"
            target="_blank"
            className="font-semibold text-[#75523F] underline underline-offset-2"
          >
            conditions générales de vente
          </Link>{" "}
          et la{" "}
          <Link
            href="/confidentialite"
            target="_blank"
            className="font-semibold text-[#75523F] underline underline-offset-2"
          >
            politique de confidentialité
          </Link>
          . *
        </span>
      </label>

      {erreur && (
        <p role="alert" className="text-center text-sm text-alerte">
          {erreur}
        </p>
      )}

      <button type="submit" disabled={etat === "envoi"} className={bouton}>
        {etat === "envoi" ? "Un instant…" : "Créer mon compte"}
      </button>

      <p className="text-center text-sm text-encre/70">
        Déjà un compte ?{" "}
        <Link
          href={`/connexion?next=${encodeURIComponent(suivant)}`}
          className="font-semibold text-[#75523F] underline underline-offset-2"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}