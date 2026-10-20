"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Message affiché au retour du paiement.
// - abonnement pas encore activé : on recharge la page toute seule quelques fois
// - abonnement actif : message de bienvenue, qui disparaît au bout de quelques secondes
export default function MessageAbonnement({ actif }: { actif: boolean }) {
  const router = useRouter();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (actif) {
      const minuterie = setTimeout(() => {
        setVisible(false);
        window.history.replaceState(null, "", "/mon-espace");
      }, 8000);
      return () => clearTimeout(minuterie);
    }

    let essais = 0;
    const intervalle = setInterval(() => {
      essais += 1;
      router.refresh();
      if (essais >= 6) clearInterval(intervalle);
    }, 2500);
    return () => clearInterval(intervalle);
  }, [actif, router]);

  if (!visible) return null;

  return (
    <p
      role="status"
      className="mt-8 rounded-2xl bg-white px-5 py-4 text-sm text-encre ring-1 ring-black/10"
    >
      {actif
        ? "Bienvenue ! Votre abonnement est actif, tous les cours sont débloqués."
        : "Merci ! Votre abonnement est en cours d'activation, cette page se met à jour toute seule. Si rien ne change, rechargez-la dans un instant."}
    </p>
  );
}