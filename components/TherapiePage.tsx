import Image from "next/image";
import Link from "next/link";

const RDV = "/reserver?offre=therapie";

const situations = [
  {
    titre: "Traumatismes profonds",
    texte:
      "Un choc, un événement ancien ou une période très dure qui continue de peser : images qui reviennent, tension dans le corps, évitements, réactions plus fortes que la situation.",
    but: "Apaiser ce qui est resté figé",
  },
  {
    titre: "Chemin de vie",
    texte:
      "Vous êtes à la croisée des chemins : perte de sens, séparation, deuil, reconversion, sentiment de ne pas être à votre place. Retrouver une direction qui vous ressemble.",
    but: "Retrouver votre cap",
  },
  {
    titre: "Enfant intérieur",
    texte:
      "Des blessures d'enfance (manque, rejet, exigences trop lourdes) qui se rejouent aujourd'hui dans vos relations, votre confiance en vous, votre façon de vous traiter.",
    but: "Réparer en douceur",
  },
  {
    titre: "Émotions, peur et stress",
    texte:
      "Anxiété, colère, tristesse qui débordent, peurs qui vous limitent, stress qui s'installe, sommeil perturbé. Comprendre ce qui se joue et apprendre à le traverser.",
    but: "Retrouver du calme",
  },
  {
    titre: "Féminin sacré",
    texte:
      "Se reconnecter à son corps, à sa sensibilité et à sa force intuitive. Passages de vie, féminité blessée ou oubliée, cycles, maternité, ménopause.",
    but: "Se réconcilier avec soi",
  },
];

const outils = [
  {
    titre: "Approche psycho-intégrative transpersonnelle",
    texte:
      "Une approche qui relie la parole, le corps, les émotions et la dimension spirituelle de la personne. On ne s'arrête pas à un symptôme : on regarde la personne dans son ensemble, avec ce qu'elle vit et ce qu'elle cherche.",
  },
  {
    titre: "EMDR",
    texte:
      "Une méthode reconnue pour traiter les souvenirs traumatiques. Guidé par des mouvements des yeux, votre cerveau retraite le souvenir, qui perd peu à peu sa charge émotionnelle et cesse de vous envahir.",
  },
];

const etapes = [
  {
    titre: "Un premier échange",
    texte:
      "Vous exposez ce qui vous amène. Chantal écoute, vous explique ses outils et choisit avec vous le plus adapté.",
  },
  {
    titre: "Le travail en séance",
    texte:
      "Parole, respiration, EMDR ou approche corporelle : à votre rythme, jamais plus loin que vous ne le souhaitez.",
  },
  {
    titre: "L'intégration",
    texte:
      "Un temps pour déposer, ancrer ce qui a bougé et repartir avec des reperes pour la suite.",
  },
];

const reperes = [
  "Thérapeute diplômée",
  "Plus de 50 élèves accompagnés",
  "Une dizaine d’années de pratique",
];

const mention =
  "Cet accompagnement ne remplace ni un suivi médical ni un suivi psychiatrique.";

function Eyebrow({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span
      className={`text-xs font-semibold uppercase tracking-[0.22em] ${className}`}
    >
      {children}
    </span>
  );
}

function BoutonRdv({ clair = false }: { clair?: boolean }) {
  return (
    <Link
      href={RDV}
      className={`btn-bounce inline-flex min-h-[50px] items-center justify-center rounded-pill px-7 py-3 text-[15px] font-semibold ${
        clair
          ? "bg-[#F5F3E7] text-[#2B1F19]"
          : "border-[1.5px] border-white bg-[#75523F]/90 text-white hover:bg-[#75523F]"
      }`}
    >
      Prendre rendez-vous
    </Link>
  );
}

export default function TherapiePage() {
  return (
    <>
      {/* En-tête : Chantal en premier */}
      <section className="bg-[#F5F3E7] px-4 pb-14 pt-28 sm:px-6 lg:pb-20 lg:pt-36">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16">
          <div className="relative mx-auto w-full max-w-[420px] pb-3.5 pr-3.5 sm:pb-6 sm:pr-6 lg:max-w-none">
            <div className="relative">
              {/* Bloc terracotta décalé derrière la photo */}
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3.5 translate-y-3.5 rounded-sm bg-[#75523F] sm:translate-x-6 sm:translate-y-6"
              />
              <div className="relative aspect-[3/4] overflow-hidden rounded-sm lg:aspect-[26/35]">
                <Image
                  src="/images/chantal-arbre.jpg"
                  alt="Chantal Lassier, mains jointes, assise devant un grand arbre de vie"
                  fill
                  priority
                  sizes="(min-width: 1024px) 520px, 420px"
                  className="object-cover"
                  style={{ objectPosition: "center 38%" }}
                />
              </div>
            </div>
            <div className="absolute -bottom-5 left-4 right-4 rounded-sm bg-[#2B1F19] px-5 py-4 text-[#F5F3E7] shadow-xl sm:left-auto sm:right-[-12px] sm:w-72 lg:right-[-32px]">
              <p className="font-display text-2xl italic leading-none">
                Chantal Lassier
              </p>
              <p className="mt-1.5 text-[12.5px] leading-snug text-[#E6DCC6]">
                Thérapeute diplômée · Diplômée de l’École du Tantra
              </p>
            </div>
          </div>

          <div className="pt-4 lg:pt-0">
            <Eyebrow className="text-[#75523F]">Thérapie holistique</Eyebrow>
            <h1 className="mt-3 font-display text-4xl italic leading-[1.05] text-encre sm:text-5xl lg:text-[54px]">
              Retrouver sa paix intérieure, à votre rythme
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-encre/80 sm:text-[17px]">
              Traumatismes, peurs, blessures d’enfance, perte de sens… Chantal
              vous accompagne avec écoute et douceur, grâce à l’approche
              psycho-intégrative transpersonnelle et à l’EMDR.
            </p>

            <ul className="mt-6 flex flex-wrap gap-2.5">
              {reperes.map((r) => (
                <li
                  key={r}
                  className="rounded-pill bg-encre/[0.08] px-4 py-2 text-[13px] font-semibold text-[#2B1F19]"
                >
                  {r}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <BoutonRdv />
              <span className="text-sm text-encre/80">
                Séance de 60 min · 60&nbsp;€
              </span>
            </div>
            <p className="mt-6 text-[12.5px] text-encre/60">{mention}</p>
          </div>
        </div>
      </section>

      {/* Ce que Chantal accompagne */}
      <section className="bg-[#E6DCC6] px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Eyebrow className="text-[#75523F]">Ce que Chantal accompagne</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl italic leading-[1.08] text-encre sm:text-4xl lg:text-[42px]">
              Ce que vous traversez, vous n’avez pas à le porter seul(e)
            </h2>
          </div>

          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {situations.map((s) => (
              <li
                key={s.titre}
                className="flex flex-col rounded-2xl bg-[#F5F3E7] p-6 sm:p-7"
              >
                <h3 className="font-display text-[26px] italic leading-[1.05] text-encre">
                  {s.titre}
                </h3>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-encre/80">
                  {s.texte}
                </p>
                <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-[#75523F]">
                  {s.but} →
                </p>
              </li>
            ))}
            <li className="flex flex-col rounded-2xl bg-[#2B1F19] p-6 text-[#F5F3E7] sm:p-7">
              <h3 className="font-display text-[26px] italic leading-[1.05]">
                Une autre situation ?
              </h3>
              <p className="mt-3 flex-1 text-[14px] leading-relaxed text-[#E6DCC6]">
                Chaque histoire est singulière. Si vous ne vous retrouvez pas
                dans ces thèmes, parlons-en : Chantal vous dira honnêtement si
                elle peut vous aider.
              </p>
              <Link
                href="/nous-contacter"
                className="mt-4 inline-flex min-h-[44px] items-center text-xs font-semibold uppercase tracking-[0.14em] text-[#E6DCC6] hover:text-white"
              >
                Poser votre question →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* Les outils */}
      <section className="bg-[#2B1F19] px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Eyebrow className="text-[#E6DCC6]">Les outils de Chantal</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-3xl font-display text-3xl italic leading-[1.08] text-[#F5F3E7] sm:text-4xl lg:text-[42px]">
              Deux approches complémentaires, choisies avec vous
            </h2>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {outils.map((o) => (
              <article
                key={o.titre}
                className="rounded-2xl border border-[#F5F3E7]/25 bg-[#F5F3E7]/[0.08] p-7 sm:p-9"
              >
                <h3 className="font-display text-[28px] italic leading-[1.1] text-[#F5F3E7] sm:text-[32px]">
                  {o.titre}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[#E6DCC6] sm:text-[15.5px]">
                  {o.texte}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-[#E6DCC6]">
            Chantal vous explique chaque outil avant de l’utiliser, et vous
            gardez toujours le choix.
          </p>
        </div>
      </section>

      {/* Le déroulé */}
      <section className="bg-[#F5F3E7] px-4 py-16 sm:px-6 lg:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <Eyebrow className="text-[#75523F]">Votre séance</Eyebrow>
            <h2 className="mt-3 font-display text-3xl italic leading-[1.08] text-encre sm:text-4xl lg:text-[42px]">
              Comment ça se passe
            </h2>
          </div>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {etapes.map((e, i) => (
              <li key={e.titre}>
                <span
                  aria-hidden="true"
                  className="font-display text-6xl italic leading-none text-[#75523F]"
                >
                  {i + 1}
                </span>
                <h3 className="mt-2 font-display text-[26px] italic text-encre">
                  {e.titre}
                </h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-encre/80">
                  {e.texte}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Rendez-vous */}
      <section className="bg-[#75523F] text-[#F5F3E7] md:grid md:grid-cols-[minmax(0,330px)_minmax(0,1fr)] lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <div className="relative h-72 md:h-auto md:min-h-[420px]">
          <Image
            src="/images/chantal-portrait.png"
            alt="Portrait souriant de Chantal Lassier"
            fill
            loading="lazy"
            sizes="(min-width: 1024px) 420px, (min-width: 768px) 330px, 100vw"
            className="object-cover"
            style={{ objectPosition: "center 22%" }}
          />
        </div>
        <div className="px-6 py-12 sm:px-10 md:px-12 lg:px-20 lg:py-16">
          <h2 className="font-display text-3xl italic leading-[1.08] sm:text-4xl lg:text-[42px]">
            Un premier pas suffit
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-[#E6DCC6]">
            Séance individuelle de 60 minutes, dans un cadre confidentiel et
            bienveillant, sans jugement. Après votre paiement, Chantal vous
            rappelle pour fixer le rendez-vous.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <BoutonRdv clair />
            <span className="text-sm text-[#E6DCC6]">
              60 min · 60&nbsp;€
            </span>
          </div>
          <p className="mt-6 max-w-xl text-[12.5px] text-[#F5F3E7]/70">
            {mention}
          </p>
        </div>
      </section>
    </>
  );
}
