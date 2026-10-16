"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/site.config";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="absolute inset-x-0 top-0 z-50 text-white"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      {/* Voile sombre dédié au header, indépendant du dégradé du Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 via-black/20 to-transparent sm:h-40" />

      <div className="relative mx-auto flex max-w-[1800px] items-center justify-between px-6 py-4 sm:px-10 lg:px-14">
        {/* Gauche : logo + nom du site */}
        <Link href="/" className="flex items-center gap-3" aria-label="Accueil">
          <span className="flex h-14 w-14 items-center justify-center sm:h-16 sm:w-16">
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

        {/* Droite (desktop) : nav + connexion + panier, tout sur la même ligne */}
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
            </ul>
          </nav>

          <Link
            href="/connexion"
            className="flex items-center gap-2 text-[15px] font-medium text-white drop-shadow-md hover:text-violet-light lg:text-base"
          >
            <UserIcon />
            Se connecter
          </Link>

          <Link
            href="/panier"
            aria-label="Panier"
            className="text-white drop-shadow-md hover:text-violet-light"
          >
            <CartIcon />
          </Link>
        </div>

        {/* Droite (mobile) : panier + burger */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/panier"
            aria-label="Panier"
            className="p-2 text-white drop-shadow-md"
          >
            <CartIcon />
          </Link>
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

            <li>
              <Link
                href="/connexion"
                className="block min-h-[44px] py-3 text-base text-violet-light"
                onClick={() => setOpen(false)}
              >
                Se connecter
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M6 8h12l-1 11H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
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