export default function EventBanner() {
  return (
    <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h2 className="mb-8 text-center text-4xl">Événements</h2>
      <div className="flex flex-col items-center gap-4 rounded-2xl bg-violet-light px-4 py-5 sm:flex-row sm:gap-6 sm:px-8">
        <img
          src="https://picsum.photos/seed/stage-yoga/120/160"
          alt="Affiche du prochain stage"
          className="h-28 w-24 rounded-md object-cover"
        />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm text-encre/70">
            29 oct. 2026, 09:00 – 01 nov. 2026, 18:00
          </p>
          <p className="font-display text-lg text-violet-dark">
            Stage Tantra Rencontre{" "}
            <span className="font-body text-sm font-normal italic text-encre/70">
              — lieu à préciser, France
            </span>
          </p>
        </div>
        <a
          href="/evenements/stage-tantra-rencontre"
          className="min-h-[44px] rounded-pill bg-encre px-5 py-2.5 text-sm font-semibold text-white"
        >
          En savoir plus
        </a>
      </div>
    </section>
  );
}
