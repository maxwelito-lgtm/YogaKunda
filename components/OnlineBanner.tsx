import Image from "next/image";

const avantages = [
  "Cours de Kundalini et de Tantra Yoga en direct",
  "Replays pour pratiquer à votre rythme",
  "Relaxations audio guidées pour le soir",
];

export default function OnlineBanner() {
  return (
    <section className="bg-[#75523F] py-10 lg:py-[60px]">
      <div className="lg:grid lg:grid-cols-[44.4%_minmax(0,1fr)] lg:items-center">
        {/* Photo : colle au bord gauche de l'écran */}
        <div className="relative h-64 w-[92%] sm:h-80 lg:h-[500px] lg:w-full">
          <Image
            src="/images/podcast.png"
            alt="Téléphone diffusant un podcast sur la philosophie du yoga, à côté d'un casque audio"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 45vw, 92vw"
            className="object-cover"
            style={{ objectPosition: "60% center" }}
          />
          <span className="absolute right-4 top-5 z-10 rounded-pill bg-[#F5F3E7] px-3 py-1 text-xs font-semibold text-encre">
            Nouveau !
          </span>
        </div>

        {/* Panneau sombre : chevauche la photo */}
        <div className="relative z-10 -mt-10 ml-auto mr-4 w-[92%] bg-[#2B1F19] p-6 text-[#F5F3E7] sm:mr-8 sm:p-10 lg:-ml-20 lg:mr-[6%] lg:mt-0 lg:w-auto lg:p-14">
          <h2 className="font-display text-3xl italic leading-[1.05] sm:text-4xl xl:text-5xl">
            Cours en ligne &amp; relaxations audio
          </h2>
          <p className="mt-2 font-display italic text-[#F5F3E7]/85">
            Pratiquez où vous voulez, quand vous voulez.
          </p>

          <ul className="mt-5 flex flex-col gap-2">
            {avantages.map((a) => (
              <li
                key={a}
                className="flex items-start gap-2.5 text-sm sm:text-[15px]"
              >
                <CheckIcon />
                <span>{a}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
            <a
              href="#abonnement"
              className="btn-bounce inline-flex min-h-[48px] w-full items-center justify-center rounded-pill bg-[#F5F3E7] px-7 py-3 text-sm font-semibold text-encre sm:w-auto"
            >
              Essayer 7 jours gratuits
            </a>
            <p className="text-center text-sm text-[#F5F3E7]/85 sm:text-left">
              À partir de 17&nbsp;€/mois
            </p>
          </div>
        </div>
      </div>
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
      className="mt-0.5 flex-none text-[#F5F3E7]"
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