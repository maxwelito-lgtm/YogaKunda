export default function PricingSection() {
  return (
       <section id="abonnement" className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16 sm:px-6">
      <h2 className="mb-2 text-center font-display text-3xl italic text-dark sm:text-4xl">
        Essayez gratuitement pendant 7 jours
      </h2>
      <p className="mb-10 text-center text-sm text-encre/70">
        L&rsquo;abonnement annuel donne accès à tous les contenus en ligne et
        vous fait économiser 36€ par an.
      </p>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Formule annuelle */}
        <div className="relative rounded-2xl border-2 border-violet bg-violet-light/30 p-6">
          <span className="absolute -top-3 left-4 rounded-pill bg-violet px-3 py-1 text-xs font-semibold text-white">
            Meilleure offre — économisez 36€/an
          </span>
          <p className="mt-3 font-semibold text-encre">Formule annuelle</p>
          <p className="mt-2">
            <span className="font-display text-4xl italic text-violet-dark">
              17€
            </span>
            <span className="text-sm text-encre/70">/mois</span>
          </p>
          <p className="mt-1 text-xs text-encre/60">
            204€ par an, facturé annuellement
          </p>
          <a
            href="/mon-espace"
            className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-pill bg-encre px-6 py-3 text-sm font-semibold text-white"
          >
            Choisir cette formule
          </a>
        </div>

        {/* Formule mensuelle */}
        <div className="rounded-2xl border border-encre/15 bg-white p-6">
          <p className="mt-3 font-semibold text-encre">Formule mensuelle</p>
          <p className="mt-2">
            <span className="font-display text-4xl italic text-violet-dark">
              20€
            </span>
            <span className="text-sm text-encre/70">/mois</span>
          </p>
          <p className="mt-1 text-xs text-encre/60">
            240€ par an, facturé mensuellement
          </p>
          <a
            href="/mon-espace"
            className="mt-6 flex min-h-[44px] w-full items-center justify-center rounded-pill border-2 border-violet-dark px-6 py-3 text-sm font-semibold text-violet-dark hover:bg-violet-light"
          >
            Choisir cette formule
          </a>
        </div>
      </div>
    </section>
  );
}