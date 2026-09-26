export default function MantrasBanner() {
  return (
    <section className="bg-violet-light">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6">
        <img
          src="https://picsum.photos/seed/mantras/220/140"
          alt="Instruments utilisés pour l'enregistrement des mantras"
          className="h-32 w-48 rounded-full object-cover"
        />
        <h2 className="text-4xl">Mantras</h2>
        <p className="max-w-md text-encre/80">
          Vous pouvez écouter et acheter les fichiers audio des mantras
          enregistrés, à l&rsquo;unité ou en album.
        </p>
        <a
          href="/mantras"
          className="min-h-[44px] rounded-pill bg-white px-6 py-3 text-sm font-semibold text-violet-dark"
        >
          Découvrir la boutique
        </a>
      </div>
    </section>
  );
}
