import Image from "next/image";

/**
 * Pause entre deux sections : un espace crème avec le logo au centre,
 * deux fils fins terracotta de chaque côté (un petit point à chaque bout).
 */
export default function Separateur() {
  return (
    <div
      aria-hidden="true"
      className="flex flex-col items-center px-4 py-16 sm:py-20 lg:py-24"
    >
      <div className="flex w-full max-w-5xl items-center gap-4 sm:gap-8">
        <Fil sens="gauche" />
        <Image
          src="/images/logo-shantalam.png"
          alt=""
          width={140}
          height={140}
          className="h-24 w-24 flex-none object-contain sm:h-32 sm:w-32 lg:h-[140px] lg:w-[140px]"
        />
        <Fil sens="droite" />
      </div>
      <span className="mt-3 text-[11px] uppercase tracking-[0.38em] text-[#75523F]">
        Shantalam
      </span>
    </div>
  );
}

function Fil({ sens }: { sens: "gauche" | "droite" }) {
  return (
    <div
      className={`flex flex-1 items-center ${
        sens === "droite" ? "flex-row-reverse" : ""
      }`}
    >
      <span className="h-[7px] w-[7px] flex-none rounded-full bg-[#75523F]" />
      <span className="h-px flex-1 bg-[#75523F]/55" />
    </div>
  );
}