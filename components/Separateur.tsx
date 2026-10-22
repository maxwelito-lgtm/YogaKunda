import Image from "next/image";

/**
 * Pause entre deux sections : un espace crème avec le logo au centre,
 * deux fils fins terracotta de chaque côté (un petit point à chaque bout).
 * « compact » : version plus petite, pour juste sous le Hero.
 */
export default function Separateur({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`flex flex-col items-center px-4 ${
        compact ? "pb-0 pt-10 sm:pt-12 lg:pt-14" : "py-10 sm:py-12 lg:py-14"
      }`}
    >
      <div className="flex w-full max-w-5xl items-center gap-4 sm:gap-8">
        <Fil sens="gauche" />
        <Image
          src="/images/logo-shantalam.png"
          alt=""
          width={140}
          height={140}
          className={`flex-none object-contain ${
            compact
              ? "h-16 w-16 sm:h-20 sm:w-20"
              : "h-20 w-20 sm:h-24 sm:w-24 lg:h-[104px] lg:w-[104px]"
          }`}
        />
        <Fil sens="droite" />
      </div>
      <span
        className={`${
          compact ? "mt-2" : "mt-3"
        } text-[11px] uppercase tracking-[0.38em] text-[#75523F]`}
      >
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