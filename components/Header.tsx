"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { site } from "@/site.config";
import { createClient } from "@/lib/supabase/client";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true); // tout en haut de la page
  const [hidden, setHidden] = useState(false); // header caché (scroll vers le bas)
  const [connecte, setConnecte] = useState(false);
  const lastY = useRef(0);
  const openRef = useRef(false);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Savoir si la personne est connectée (pour afficher « Déconnexion »)
  useEffect(() => {
    let desabonner: (() => void) | undefined;
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setConnecte(!!data.user));
      const { data } = supabase.auth.onAuthStateChange((_evenement, session) => {
        setConnecte(!!session?.user);
      });
      desabonner = () => data.subscription.unsubscribe();
    } catch {
      // Sans configuration, on n'affiche simplement pas le bouton.
    }
    return () => desabonner?.();
  }, []);

  async function deconnexion() {
    try {
      await createClient().auth.signOut();
    } finally {
      window.location.assign("/");
    }
  }

  useEffect(() => {
    let ticking = false;

    const update = () => {
      // max(0) : évite les valeurs négatives du rebond (overscroll) sur iPhone
      const y = Math.max(0, window.scrollY);
      const delta = y - lastY.current;

      if (y <= 24) {
        setAtTop(true);
        setHidden(false);
        lastY.current = y;
      } else if (Math.abs(delta) >= 6) {
        setAtTop(false);
        if (delta > 0 && !openRef.current) {
          setHidden(true); // on descend : on cache
        } else if (delta < 0) {
          setHidden(false); // on remonte : on affiche
        }
        lastY.current = y;
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-white transition-all duration-300 motion-reduce:transition-none ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        atTop
          ? "bg-transparent"
          : "bg-[rgba(36,28,24,0.92)] shadow-lg backdrop-blur-md"
      }`}
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Voile sombre en haut de page uniquement (disparaît quand la barre foncée s'affiche) */}
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 via-black/20 to-transparent transition-opacity duration-300 sm:h-40 ${
          atTop ? "opacity-100" : "opacity-0"
        }`}
      />

      <div
        className={`relative mx-auto flex max-w-[1800px] items-center justify-between px-6 transition-all duration-300 sm:px-10 lg:px-14 ${
          atTop ? "py-4" : "py-2"
        }`}
      >
        {/* Gauche : logo + nom du site */}
        <Link href="/" className="flex items-center gap-3" aria-label="Accueil">
          <span
            className={`flex items-center justify-center transition-all duration-300 ${
              atTop ? "h-14 w-14 sm:h-16 sm:w-16" : "h-11 w-11 sm:h-12 sm:w-12"
            }`}
          >
            <img
              src="/images/logo-shantalam.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </span>
          <span className="font-display text-base italic text-white drop-shadow-md sm:text-xl">
            {site.nom}
          </span>
        </Link>

        {/* Droite (desktop) : navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <nav>
            <ul className="flex items-center gap-8 text-[15px] lg:text-base">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-white drop-shadow-md hover:text-violet-light"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              {connecte && (
                <li>
                  <button
                    type="button"
                    onClick={deconnexion}
                    className="text-white drop-shadow-md hover:text-violet-light"
                  >
                    Déconnexion
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </div>

        {/* Droite (mobile) : burger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-pill drop-shadow-md"
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* Navigation mobile (menu burger) */}
      {open && (
        <nav className="relative border-t border-white/10 bg-black/30 backdrop-blur-md md:hidden">
          <ul className="flex flex-col px-4 py-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block min-h-[44px] py-3 text-base text-white"
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {connecte && (
              <li>
                <button
                  type="button"
                  onClick={deconnexion}
                  className="block min-h-[44px] w-full py-3 text-left text-base text-white"
                >
                  Déconnexion
                </button>
              </li>
            )}
          </ul>
        </nav>
      )}
    </header>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}