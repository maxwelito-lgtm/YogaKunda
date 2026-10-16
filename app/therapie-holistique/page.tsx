import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { site } from "@/site.config";

export const metadata: Metadata = {
  title: `Thérapie Holistique — ${site.nom}`,
  description:
    "Un accompagnement personnel qui prend en compte toutes les dimensions de l'être : physique, psychique et émotionnelle.",
};

const titreBloc =
  "text-center font-serif text-2xl font-bold uppercase tracking-wide text-[#A8944F] md:text-3xl";
const soulignement = "mx-auto mt-3 block h-0.5 w-48 bg-[#A8944F]";
const liste =
  "mt-8 list-disc space-y-3 pl-5 font-serif text-[15px] leading-7 text-encre";
const bouton =
  "inline-block bg-[#A08A3E] px-7 py-3 font-serif text-sm tracking-[0.12em] text-white transition hover:bg-[#8A7433]";

export default function TherapieHolistiquePage() {
  return (
    <main style={{ backgroundColor: "#FBFBFA" }}>
      <Header />

      {/* Haut de page : photo + panneau titre */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6">
        <div className="relative md:min-h-[520px]">
          <img
            src="https://picsum.photos/seed/therapie-hero/1200/700"
            alt="Paysage apaisant et lumineux"
            className="h-64 w-full object-cover md:absolute md:left-0 md:top-0 md:h-[516px] md:w-[62%]"
          />
          <div className="relative z-10 bg-[#FBFBFA] py-8 md:ml-auto md:mt-[87px] md:min-h-[398px] md:w-[52%] md:py-12 md:pl-20 md:pr-6">
            <h1 className="font-body text-4xl font-light text-[#9C8541] md:text-5xl">
              Thérapie Holistique
            </h1>
            <p className="mt-6 font-serif text-[15px] leading-8 text-encre">
              Un accompagnement personnel, pensé pour vous, qui prend en compte
              toutes les dimensions de l&rsquo;être : physique, psychique et
              émotionnelle.
            </p>
            <p className="font-serif text-[15px] leading-8 text-encre">
              Dans un cadre bienveillant, chaque séance s&rsquo;adapte à ce que
              vous traversez et à ce dont vous avez besoin.
            </p>
            <p className="font-serif text-[15px] leading-8 text-encre">
              Découvrez comment cet accompagnement peut vous aider à avancer, à
              votre rythme.
            </p>
          </div>
        </div>
      </section>

      {/* Bloc 1 : photo à gauche, texte à droite */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:gap-16">
        <img
          src="/images/therapie.jpeg"
          alt="Moment d'écoute et d'accompagnement"
          className="h-[420px] w-full object-cover"
        />
        <div>
          <h2 className={titreBloc}>Un accompagnement sur mesure</h2>
          <span className={soulignement} />
          <ul className={liste}>
            <li>
              Chaque séance est <strong>adaptée à vous</strong> : à votre
              histoire, à votre rythme et à ce que vous souhaitez traverser.
            </li>
            <li>
              Que vous souhaitiez <strong>apaiser votre stress</strong>, mieux{" "}
              <strong>comprendre vos émotions</strong>, retrouver de{" "}
              <strong>l&rsquo;énergie</strong> ou simplement prendre un temps
              pour vous, l&rsquo;accompagnement s&rsquo;ajuste à votre demande.
            </li>
            <li>
              L&rsquo;approche tient compte du{" "}
              <strong>corps, du mental et des émotions</strong>, sans les
              séparer.
            </li>
            <li>
              Un espace d&rsquo;écoute <strong>sans jugement</strong>, où vous
              avancez à votre rythme.
            </li>
            <li>TARIF : [à compléter].</li>
          </ul>
          <div className="mt-10 text-center">
            <a href="/nous-contacter" className={bouton}>
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      {/* Bloc 2 : texte à gauche, photo à droite */}
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:gap-16">
        <img
          src="https://picsum.photos/seed/therapie-approche/700/900"
          alt="Ambiance douce et lumineuse"
          className="h-[420px] w-full object-cover md:order-2"
        />
        <div className="md:order-1">
          <h2 className={titreBloc}>Une approche globale</h2>
          <span className={soulignement} />
          <ul className={liste}>
            <li>
              <strong>Le corps</strong> : l&rsquo;écoute des tensions, de la
              fatigue et des signaux qu&rsquo;il vous envoie.
            </li>
            <li>
              <strong>Le mental</strong> : prendre du recul sur les pensées qui
              tournent et retrouver de la clarté.
            </li>
            <li>
              <strong>Les émotions</strong> : les reconnaître, les accueillir et
              leur laisser de la place sans être submergé.
            </li>
            <li>
              Ces trois dimensions sont reliées : en prendre soin ensemble
              favorise <strong>un équilibre durable</strong>.
            </li>
          </ul>
          <div className="mt-10 text-center">
            <a href="/nous-contacter" className={bouton}>
              Prendre rendez-vous
            </a>
          </div>
        </div>
      </section>

      {/* Informations et tarifs */}
      <section
        className="px-4 py-16 sm:px-6"
        style={{
          background:
            "linear-gradient(135deg, #8f786c 0%, #a89084 55%, #9b8175 100%)",
        }}
      >
        <div className="mx-auto max-w-2xl border border-[#E6DCB8] px-6 py-10 text-center sm:px-12">
          <h2 className="font-body text-2xl uppercase tracking-wide text-[#F6EFD6] sm:text-3xl">
            Informations et tarifs
          </h2>
          <div className="mt-8 text-left">
            <h3 className="font-serif text-lg font-bold uppercase text-white">
              Séance d&rsquo;accompagnement
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 font-serif text-[15px] leading-7 text-encre">
              <li>Durée : 60 min</li>
              <li>Prix : [à compléter]</li>
              <li>Disponibilités : [à compléter]</li>
              <li>Lieu : {site.adresse}</li>
            </ul>
          </div>
          <div className="mt-8">
            <a href="/nous-contacter" className={bouton}>
              Nous contacter
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}