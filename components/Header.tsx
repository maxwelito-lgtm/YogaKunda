"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/site.config";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="absolute inset-x-0 top-0 z-50 text-white">
      {/* Voile sombre dédié au header, indépendant du dégradé du Hero */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/55 via-black/20 to-transparent sm:h-40" />

      <div className="relative mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Actions gauche : burger + connexion */}
        <div className="flex items-center gap-4">
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-pill drop-shadow-md md:hidden"
          >
            <BurgerIcon open={open} />
          </button>

          <Link
            href="/connexion"
            className="hidden items-center gap-2 text-sm font-medium text-white drop-shadow-md hover:text-violet-light sm:flex"
          >
            <UserIcon />
            Se connecter
          </Link>
        </div>

        {/* Logo circulaire, centré */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Accueil"
        >
          <span className="shine-effect flex h-12 w-12 items-center justify-center rounded-full bg-white drop-shadow-md sm:h-16 sm:w-16">
            <img
              src="/images/logo-yoga.png"
              alt={site.nom}
              className="h-full w-full rounded-full object-cover"
            />
          </span>
        </Link>

        {/* Action droite : panier */}
        <Link
          href="/panier"
          aria-label="Panier"
          className="p-2 text-white drop-shadow-md hover:text-violet-light"
        >
          <CartIcon />
        </Link>
      </div>

      {/* Navigation desktop */}
      <nav className="relative hidden md:block">
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-10 px-6 py-3 text-sm">
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
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="4"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M4 20c0-4 4-6 8-6s8 2 8 6"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 8h12l-1 11H7L6 8Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M9 8V6a3 3 0 0 1 6 0v2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function BurgerIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      {open ? (
        <path
          d="M6 6l12 12M18 6L6 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M4 7h16M4 12h16M4 17h16"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}