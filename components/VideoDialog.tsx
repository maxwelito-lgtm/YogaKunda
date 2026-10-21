"use client";

import { useRef } from "react";

type Props = {
  src?: string;
  label?: string;
};

export default function VideoDialog({
  src = "/videos/presentation.mp4",
  label = "Voir la vidéo du studio",
}: Props) {
  const ref = useRef<HTMLDialogElement>(null);

  function ouvrir() {
    ref.current?.showModal();
  }

  function fermer() {
    ref.current?.close();
  }

  function arreterVideo() {
    ref.current?.querySelector("video")?.pause();
  }

  return (
    <>
      <button
        type="button"
        onClick={ouvrir}
        className="btn-bounce inline-flex min-h-[48px] items-center gap-2.5 rounded-pill border-[1.5px] border-white bg-[#75523F] px-6 text-[15px] font-semibold text-white hover:bg-[#75523F]/90"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z" />
        </svg>
        {label}
      </button>

      <dialog
        ref={ref}
        onClose={arreterVideo}
        onClick={(e) => {
          if (e.target === e.currentTarget) fermer();
        }}
        aria-label="Vidéo de présentation du studio"
        className="m-auto w-[min(92vw,900px)] overflow-hidden rounded-2xl bg-encre p-0 backdrop:bg-black/70"
      >
        <div className="relative">
          <button
            type="button"
            onClick={fermer}
            aria-label="Fermer la vidéo"
            className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
          <video
            className="aspect-video w-full object-contain"
            controls
            playsInline
            preload="none"
          >
            <source src={src} type="video/mp4" />
            Votre navigateur ne permet pas la lecture de cette vidéo.
          </video>
        </div>
      </dialog>
    </>
  );
}