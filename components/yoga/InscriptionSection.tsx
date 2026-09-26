import Link from "next/link";

export default function InscriptionSection() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-20 text-center sm:px-6">
      <h2 className="mb-4 text-3xl">Inscription &amp; informations</h2>
      <p className="mb-6 text-encre/80">
        Le premier cours d&rsquo;essai est gratuit. Les chèques vacances sont
        acceptés.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href="/inscription"
          className="min-h-[44px] rounded-pill border-2 border-violet-dark bg-violet-light px-6 py-3 text-sm font-semibold text-violet-dark"
        >
          Demander un cours d&rsquo;essai
        </Link>
        <Link
          href="/mon-espace"
          className="min-h-[44px] rounded-pill border-2 border-violet-dark px-6 py-3 text-sm font-semibold text-violet-dark"
        >
          Découvrir les cours en ligne
        </Link>
      </div>
    </section>
  );
}
