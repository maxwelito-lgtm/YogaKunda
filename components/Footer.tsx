import type { JSX } from "react";
import { site } from "@/site.config";
import NewsletterForm from "@/components/NewsletterForm";

export default function Footer() {
  return (
    <footer className="bg-[#F5F3E7]">
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6">
        {/* Colonne identité */}
        <div className="text-center sm:text-left">
          <div className="mb-4 flex justify-center gap-4 sm:justify-start">
            <a href={site.reseaux.youtube} aria-label="YouTube" className="p-2">
              <SocialIcon type="youtube" />
            </a>
            <a href={site.reseaux.facebook} aria-label="Facebook" className="p-2">
              <SocialIcon type="facebook" />
            </a>
            <a href={site.reseaux.instagram} aria-label="Instagram" className="p-2">
              <SocialIcon type="instagram" />
            </a>
          </div>
                    <img
            src="/images/logo-shantalam.png"
            alt={site.nom}
            className="mx-auto h-24 w-24 object-contain sm:mx-0"
          />
          <p className="text-sm text-encre/80">{site.telephone}</p>
        </div>

        <NewsletterForm />

      </div>

      <div className="border-t border-encre/10 px-4 py-6 text-center text-xs text-encre/70 sm:px-6">
        <nav className="mb-3 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <a href="/mentions-legales">Mentions légales</a>
          <a href="/cgv">Conditions générales de vente</a>
          <a href="/retractation">Formulaire de rétractation</a>
          <a href="/confidentialite">Politique de confidentialité</a>
        </nav>
        <p>© {new Date().getFullYear()} {site.nom}. Tous droits réservés.</p>
      </div>
    </footer>
  );
}

function SocialIcon({ type }: { type: "youtube" | "facebook" | "instagram" }) {
  const paths: Record<string, JSX.Element> = {
    youtube: (
      <path d="M21 7.5s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.4 4.3 12 4.3 12 4.3s-3.4 0-6.1.2c-.4 0-1.3.1-2.1.9-.6.6-.8 2.1-.8 2.1S2.8 9.3 2.8 11v1c0 1.7.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.9.8 2.4.9 1.7.2 7.3.2 7.3.2s3.4 0 6.1-.2c.4 0 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.8.2-3.5v-1c0-1.7-.2-3.5-.2-3.5ZM10 14.6V8.9l5.2 2.9-5.2 2.8Z" />
    ),
    facebook: (
      <path d="M13.5 21v-7.5H16l.4-3H13.5V8.4c0-.9.2-1.5 1.5-1.5H16.5V4.3c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.3H8v3h2.3V21h3.2Z" />
    ),
    instagram: (
      <path d="M12 3.5c2.4 0 2.7 0 3.6.1 1 0 1.6.2 2 .4a3.9 3.9 0 0 1 2.4 2.4c.2.4.3 1 .4 2 0 .9.1 1.2.1 3.6s0 2.7-.1 3.6c0 1-.2 1.6-.4 2a3.9 3.9 0 0 1-2.4 2.4c-.4.2-1 .3-2 .4-.9 0-1.2.1-3.6.1s-2.7 0-3.6-.1c-1 0-1.6-.2-2-.4a3.9 3.9 0 0 1-2.4-2.4c-.2-.4-.3-1-.4-2 0-.9-.1-1.2-.1-3.6s0-2.7.1-3.6c0-1 .2-1.6.4-2A3.9 3.9 0 0 1 6.4 4c.4-.2 1-.3 2-.4.9 0 1.2-.1 3.6-.1Zm0 2.2c-2.3 0-2.6 0-3.5.1-.8 0-1.2.2-1.5.3-.4.1-.6.3-.9.6-.3.3-.5.5-.6.9-.1.3-.3.7-.3 1.5-.1.9-.1 1.2-.1 3.5s0 2.6.1 3.5c0 .8.2 1.2.3 1.5.1.4.3.6.6.9.3.3.5.5.9.6.3.1.7.3 1.5.3.9.1 1.2.1 3.5.1s2.6 0 3.5-.1c.8 0 1.2-.2 1.5-.3.4-.1.6-.3.9-.6.3-.3.5-.5.6-.9.1-.3.3-.7.3-1.5.1-.9.1-1.2.1-3.5s0-2.6-.1-3.5c0-.8-.2-1.2-.3-1.5a1.6 1.6 0 0 0-.6-.9 1.6 1.6 0 0 0-.9-.6c-.3-.1-.7-.3-1.5-.3-.9-.1-1.2-.1-3.5-.1Zm0 3.7a3.6 3.6 0 1 1 0 7.2 3.6 3.6 0 0 1 0-7.2Zm0 2a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Zm4.6-2.2a.85.85 0 1 1-1.7 0 .85.85 0 0 1 1.7 0Z" />
    ),
  };
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {paths[type]}
    </svg>
  );
}
