"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { site } from "@/site.config";
import { createClient } from "@/lib/supabase/client";
import { estAbonne } from "@/lib/espace";

// Activités qui ont une page dédiée (affichées dans le menu mobile)
const ACTIVITES = [
  { label: "Kundalini Yoga", href: "/yoga/kundalini" },
  { label: "Tantra Yoga", href: "/yoga/tantra" },
  { label: "Yoga Nidra", href: "/yoga/nidra" },
  { label: "Thérapie holistique", href: "/therapie-holistique" },
];

// Menu PC : les cours sont regroupés dans un sous-menu « Cours »
const COURS_PC = [
  { label: "Kundalini Yoga", href: "/yoga/kundalini" },
  { label: "Yoga Nidra", href: "/yoga/nidra" },
  { label: "Ateliers Tantra & Kundalini", href: "/yoga/tantra" },
];

type Compte = { id: string; prenom: string } | null;
type Abo = { statut: string; fin_periode: string | null } | null;

function dateCourte(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "long" });
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [atTop, setAtTop] = useState(true); // tout en haut de la page
  const [hidden, setHidden] = useState(false); // header caché (scroll vers le bas)
  const [compte, setCompte] = useState<Compte>(null);
  const [abo, setAbo] = useState<Abo>(null);
  const connecte = !!compte;
  const pathname = usePathname();
  const lastY = useRef(0);
  const openRef = useRef(false);
  const [coursOuvert, setCoursOuvert] = useState(false); // sous-menu « Cours » (PC)
  const coursRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  // Savoir si la personne est connectée (pour afficher « Déconnexion » et son compte)
  useEffect(() => {
    let desabonner: (() => void) | undefined;
    const versCompte = (u: { id: string; user_metadata?: Record<string, unknown> } | null | undefined): Compte =>
      u
        ? {
            id: u.id,
            prenom:
              typeof u.user_metadata?.prenom === "string" ? u.user_metadata.prenom : "",
          }
        : null;
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => setCompte(versCompte(data.user)));
      const { data } = supabase.auth.onAuthStateChange((_evenement, session) => {
        setCompte(versCompte(session?.user));
      });
      desabonner = () => data.subscription.unsubscribe();
    } catch {
      // Sans configuration, on n'affiche simplement pas le bouton.
    }
    return () => desabonner?.();
  }, []);

  // État de l'abonnement (affiché dans le menu mobile)
  const compteId = compte?.id;
  useEffect(() => {
    if (!compteId) {
      setAbo(null);
      return;
    }
    let annule = false;
    try {
      createClient()
        .from("abonnements")
        .select("statut, fin_periode")
        .eq("user_id", compteId)
        .maybeSingle()
        .then(({ data }) => {
          if (!annule) setAbo(data ?? null);
        });
    } catch {
      // pas bloquant
    }
    return () => {
      annule = true;
    };
  }, [compteId]);

  // Le menu se ferme quand on change de page
  useEffect(() => {
    setOpen(false);
    setCoursOuvert(false);
  }, [pathname]);

  // Le sous-menu « Cours » se ferme si le header se cache
  useEffect(() => {
    if (hidden) setCoursOuvert(false);
  }, [hidden]);

  // ... et au clic en dehors ou avec la touche Échap
  useEffect(() => {
    if (!coursOuvert) return;
    const dehors = (e: PointerEvent) => {
      if (coursRef.current && !coursRef.current.contains(e.target as Node)) {
        setCoursOuvert(false);
      }
    };
    const touche = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCoursOuvert(false);
    };
    document.addEventListener("pointerdown", dehors);
    window.addEventListener("keydown", touche);
    return () => {
      document.removeEventListener("pointerdown", dehors);
      window.removeEventListener("keydown", touche);
    };
  }, [coursOuvert]);

  // Touche Échap + page figée derrière le menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const avant = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = avant;
    };
  }, [open]);

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

  const abonne = estAbonne(abo);
  const enEssai = abonne && abo?.statut === "essai";
  const actif = (href: string) =>
    pathname === href || (href !== "/" && !href.includes("#") && pathname.startsWith(href + "/"));

  // « Accueil » : retour à l'accueil, ou descente vers « L'espace Shantalam » si on y est déjà
  const hrefAccueil = pathname === "/" ? "/#espace" : "/";

  return (
    <>
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
            <Image
              src="/images/logo-shantalam.png"
              alt=""
              width={64}
              height={64}
              loading="eager"
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
            <ul className="flex items-center gap-5 text-[15px] xl:gap-8 lg:text-base">
              <li className="hidden lg:block">
                <Link
                  href={hrefAccueil}
                  className="text-white drop-shadow-md hover:text-violet-light"
                >
                  Accueil
                </Link>
              </li>

              {/* Sous-menu « Cours » : s'ouvre au clic */}
              <li ref={coursRef} className="relative hidden lg:block">
                <button
                  type="button"
                  aria-expanded={coursOuvert}
                  aria-haspopup="true"
                  aria-controls="menu-cours"
                  onClick={() => setCoursOuvert((v) => !v)}
                  className={`inline-flex items-center gap-1.5 drop-shadow-md hover:text-violet-light ${
                    COURS_PC.some((c) => actif(c.href))
                      ? "font-semibold text-white"
                      : "text-white"
                  }`}
                >
                  Cours
                  <ChevronBas ouvert={coursOuvert} />
                </button>
                {coursOuvert && (
                  <ul
                    id="menu-cours"
                    className="absolute left-1/2 top-full z-10 mt-4 w-64 -translate-x-1/2 overflow-hidden rounded-2xl bg-[rgba(36,28,24,0.96)] py-2 shadow-xl ring-1 ring-white/10 backdrop-blur-md"
                  >
                    {COURS_PC.map((c) => (
                      <li key={c.href}>
                        <Link
                          href={c.href}
                          onClick={() => setCoursOuvert(false)}
                          aria-current={actif(c.href) ? "page" : undefined}
                          className={`block px-5 py-3 text-[15px] hover:bg-white/10 ${
                            actif(c.href) ? "font-semibold" : ""
                          }`}
                        >
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>

              <li className="hidden lg:block">
                <Link
                  href="/therapie-holistique"
                  className="text-white drop-shadow-md hover:text-violet-light"
                >
                  Thérapies
                </Link>
              </li>
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
            aria-controls="menu-mobile"
            onClick={() => setOpen(!open)}
            className="flex h-11 w-11 items-center justify-center rounded-pill drop-shadow-md"
          >
            <BurgerIcon open={open} />
          </button>
        </div>
      </div>

    </header>

    {/* Menu mobile : tiroir qui glisse depuis la droite */}
    <div
      className={`fixed inset-0 z-[60] md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        tabIndex={-1}
        aria-label="Fermer le menu"
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-[#241C18]/55 transition-opacity duration-300 motion-reduce:transition-none ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />

      <nav
        id="menu-mobile"
        aria-label="Menu principal"
        onClick={(e) => {
          // Un clic sur n'importe quel lien referme le menu (y compris « /#abonnement » sur l'accueil)
          if ((e.target as HTMLElement).closest("a")) setOpen(false);
        }}
        className={`absolute inset-y-0 right-0 flex w-[min(86vw,340px)] flex-col bg-[#F5F3E7] text-encre shadow-[-12px_0_40px_rgba(0,0,0,0.25)] transition-transform duration-300 ease-out motion-reduce:transition-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          paddingTop: "env(safe-area-inset-top)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        {/* Logo + nom + fermer */}
        <div className="flex items-center justify-between py-3 pl-6 pr-3">
          <Link
            href="/"
            tabIndex={open ? 0 : -1}
            className="flex items-center gap-2.5"
            aria-label="Accueil"
          >
            <Image
              src="/images/logo-shantalam.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-contain"
            />
            <span className="font-display text-xl italic">{site.nom}</span>
          </Link>
          <button
            type="button"
            tabIndex={open ? 0 : -1}
            aria-label="Fermer le menu"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-pill hover:bg-black/5"
          >
            <BurgerIcon open />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-2">
          {/* État du compte */}
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
            {connecte ? (
              <>
                <p className="font-display text-xl italic leading-tight">
                  Bonjour{compte?.prenom ? ` ${compte.prenom}` : ""}
                </p>
                <p className="mt-0.5 text-[13px] text-encre/70">
                  {enEssai
                    ? `Essai gratuit · jusqu'au ${dateCourte(abo?.fin_periode)}`
                    : abonne
                      ? "Abonnement actif"
                      : "Compte gratuit · aucun abonnement"}
                </p>
                <Link
                  href="/mon-espace/historique"
                  tabIndex={open ? 0 : -1}
                  className="mt-1.5 inline-block text-[13px] font-semibold text-[#75523F]"
                >
                  Mes achats
                </Link>
              </>
            ) : (
              <div className="flex items-center justify-between gap-3">
                <p className="text-[13px] text-encre/70">Vous avez déjà un compte ?</p>
                <Link
                  href="/connexion"
                  tabIndex={open ? 0 : -1}
                  className="shrink-0 rounded-pill border border-encre/25 px-4 py-2 text-[13px] font-semibold"
                >
                  Se connecter
                </Link>
              </div>
            )}
          </div>

          {/* Accueil */}
          <div className="mt-3 border-b border-encre/10">
            <Link
              href={hrefAccueil}
              tabIndex={open ? 0 : -1}
              aria-current={actif("/") ? "page" : undefined}
              className={`block min-h-[44px] py-2.5 text-[17px] ${
                actif("/") ? "font-semibold text-[#75523F]" : ""
              }`}
            >
              Accueil
            </Link>
          </div>

          {/* Activités */}
          <p className="mb-1 mt-4 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#75523F]">
            Activités
          </p>
          <ul>
            {ACTIVITES.map((a) => (
              <li key={a.href} className="border-b border-encre/10 last:border-0">
                <Link
                  href={a.href}
                  tabIndex={open ? 0 : -1}
                  aria-current={actif(a.href) ? "page" : undefined}
                  className={`block min-h-[44px] py-2.5 text-[17px] ${
                    actif(a.href) ? "font-semibold text-[#75523F]" : ""
                  }`}
                >
                  {a.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Pages du site */}
          <p className="mb-1 mt-5 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#75523F]">
            Le site
          </p>
          <ul>
            {site.nav.map((item) => (
              <li key={item.href} className="border-b border-encre/10 last:border-0">
                <Link
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  aria-current={actif(item.href) ? "page" : undefined}
                  className={`block min-h-[44px] py-2.5 text-[17px] ${
                    actif(item.href) ? "font-semibold text-[#75523F]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bouton principal + déconnexion */}
        <div className="flex flex-col gap-2 px-6 pb-5 pt-3">
          {abonne ? (
            <Link
              href="/mon-espace"
              tabIndex={open ? 0 : -1}
              className="btn-bounce inline-flex min-h-[48px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-6 text-[15px] font-semibold text-white shadow-[0_0_0_1px_#75523F]"
            >
              Mon espace
            </Link>
          ) : (
            <Link
              href="/#abonnement"
              tabIndex={open ? 0 : -1}
              className="btn-bounce inline-flex min-h-[48px] items-center justify-center rounded-pill border-[1.5px] border-white bg-[#75523F]/90 px-6 text-[15px] font-semibold text-white shadow-[0_0_0_1px_#75523F]"
            >
              Essayer 7 jours gratuits
            </Link>
          )}
          {connecte && (
            <button
              type="button"
              tabIndex={open ? 0 : -1}
              onClick={deconnexion}
              className="min-h-[40px] text-[13px] font-semibold text-encre/65"
            >
              Se déconnecter
            </button>
          )}
        </div>
      </nav>
    </div>
    </>
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

// Petite flèche du sous-menu « Cours » (se retourne quand il est ouvert)
function ChevronBas({ ouvert = false }: { ouvert?: boolean }) {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`transition-transform duration-200 motion-reduce:transition-none ${
        ouvert ? "rotate-180" : ""
      }`}
    >
      <path
        d="M5 9l7 7 7-7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}