import Link from "next/link";
import { site } from "@/site.config";

export default function Hero() {
  return (
    <section className="relative">
      <div className="relative aspect-[16/9] w-full overflow-hidden sm:aspect-[21/9]">
        {/* Remplacer par une vraie photo (paysage, posture, lieu) */}
        <img
          src="https://picsum.photos/seed/yoga-hero/1600/700"
          alt="Silhouette en posture de méditation, mains jointes au-dessus de la tête, face à un paysage de verdure"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-encre/60 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-end gap-6 p-6 sm:p-12">
          <h1 className="max-w-xl font-display text-4xl italic text-white sm:text-6xl">
            {site.accroche}
          </h1>
          <p className="max-w-md text-white/90">
            Cours de Kundalini et Tantra Yoga, en présentiel à {site.ville} ou en
            ligne, où que vous soyez et quand vous le voulez.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/inscription"
              className="rounded-pill border-2 border-violet-dark bg-violet-light px-6 py-3 text-sm font-semibold text-violet-dark hover:bg-white"
            >
              Créer mon compte
            </Link>
            <Link
              href="/yoga"
              className="rounded-pill border-2 border-white px-6 py-3 text-sm font-semibold text-white hover:bg-white hover:text-encre"
            >
              Découvrir les formules
            </Link>
          </div>
        </div>
      </div>

      {/* Bandeau essai gratuit */}
      <div className="bg-sauge/20 px-4 py-3 text-center text-sm sm:px-6">
        <strong className="font-semibold">7 jours d&rsquo;essai gratuit</strong>
        {" "}sur les cours en ligne — renouvellement automatique sauf résiliation
        avant échéance.
      </div>
    </section>
  );
}
