"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

// Recharge la page quelques fois, le temps que la confirmation du paiement arrive.
export default function ActualiserAuto() {
  const router = useRouter();

  useEffect(() => {
    let essais = 0;
    const intervalle = setInterval(() => {
      essais += 1;
      router.refresh();
      if (essais >= 8) clearInterval(intervalle);
    }, 2500);
    return () => clearInterval(intervalle);
  }, [router]);

  return null;
}