"use client";

import { useState } from "react";
import Link from "next/link";
import { site } from "@/site.config";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
      <div className="relative mx-auto flex max-w-6xl items-center justify-end px-4 py-4 sm:px-6">
        {/* Logo circulaire, centré */}
        <Link
          href="/"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          aria-label="Accueil"
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white text-center font-display text-[10px] uppercase tracking-wide text-encre">
            {site.nom}
          </span>
        </Link>


        {/* Actions droite : connexion + panier + burger */}
        <div className="flex items-center gap-4">
          <Link
            href="/connexion"
            className="hidden items-center gap-2 text-sm font-medium text-violet-light hover:text-white sm:flex"
          >
            <UserIcon />
            Se connecter
          </Link>
          <Link href="/panier" aria-label="Panier" className="p-2">
            <CartIcon />
          </Link>
          <button
            aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-pill md:hidden"
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </div>

      {/* Navigation desktop */}
      <nav className="hidden border-t border-white/10 md:block">
        <ul className="mx-auto flex max-w-6xl items-center justify-center gap-10 px-6 py-3 text-sm">
          {site.nav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="hover:text-violet-light">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Navigation mobile (menu burger) */}
      {open && (
        <nav className="border-t border-white/10 md:hidden">
          <ul className="flex flex-col px-4 py-2">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block min-h-[44px] py-3 text-base"
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 20c0-4 4-6 8-6s8 2 8 6" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
        <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      ) : (
        <>
          <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
