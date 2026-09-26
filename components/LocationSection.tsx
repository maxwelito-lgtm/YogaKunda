import { site } from "@/site.config";

export default function LocationSection() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 text-center sm:px-6">
      <h2 className="text-encre text-4xl">L&rsquo;espace {site.nom}</h2>
      <p className="mx-auto mt-4 max-w-2xl text-encre/80">
        Découvrez un espace chaleureux et
        intimiste pour vos activités hebdomadaires, vos ateliers ou vos
        événements.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <img
          src="https://picsum.photos/seed/facade/500/400"
          alt="Façade du studio de yoga"
          className="h-56 w-full rounded-xl object-cover sm:col-span-1"
        />
        <img
          src="https://picsum.photos/seed/salle1/500/400"
          alt="Salle de pratique avec tapis de yoga"
          className="h-56 w-full rounded-xl object-cover sm:col-span-1"
        />
        <img
          src="https://picsum.photos/seed/salle2/500/400"
          alt="Salle de pratique avec coussins colorés"
          className="h-56 w-full rounded-xl object-cover sm:col-span-1"
        />
      </div>

      <p className="mt-8 text-sm text-encre/70">
        Une localisation des plus avantageuses — facilement accessible en
        train et en voiture.
      </p>
    </section>
  );
}