const avantages = [
  "Cours de Kundalini et de Tantra Yoga en direct",
  "Replays pour pratiquer à votre rythme",
  "Relaxations audio guidées pour le soir",
];

export default function OnlineBanner() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <article className="relative flex min-h-[480px] flex-col justify-end overflow-hidden rounded-2xl shadow-sm md:min-h-[380px]">
        <img
          src="https://picsum.photos/seed/enligne/1600/700"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />

        {/* Dégradé : du bas vers le haut sur mobile, de la gauche vers la droite sur PC */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20 md:bg-gradient-to-r md:from-black/80 md:via-black/50 md:to-black/10" />

        <span className="absolute left-5 top-5 z-10 rounded-pill bg-[#75523F] px-3 py-1 text-xs font-semibold text-white sm:left-8 sm:top-8">
          Nouveau !
        </span>

        <div className="relative z-10 flex flex-col gap-6 p-6 pt-20 sm:p-8 md:max-w-xl md:p-10">
          <div>
            <h2 className="font-display text-3xl italic text-white drop-shadow-md sm:text-4xl">
              Cours en ligne &amp; relaxations audio
            </h2>
            <p className="mt-2 font-display italic text-white/90 drop-shadow-md">
              Pratiquez où vous voulez, quand vous voulez.
            </p>
          </div>

          <ul className="flex flex-col gap-2">
            {avantages.map((a) => (
              <li
                key={a}
                className="flex items-start gap-2 text-sm text-white/90 drop-shadow-md sm:text-base"
              >
                <CheckIcon />
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#abonnement"
              className="btn-bounce inline-flex min-h-[44px] w-full items-center justify-center rounded-pill bg-white px-6 py-3 text-sm font-semibold text-encre sm:w-auto"
            >
              Essayer 7 jours gratuits
            </a>
            <p className="text-center text-sm text-white/85 drop-shadow-md sm:text-left">
              À partir de 17&nbsp;€/mois
            </p>
          </div>
        </div>
      </article>
    </section>
  );
}

function CheckIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="mt-0.5 flex-none text-white"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.2" />
      <path
        d="M8 12.5l2.5 2.5L16 9.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}