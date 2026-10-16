type Props = {
  src?: string;
  poster?: string;
};

export default function PresentationVideo({
  src = "/videos/presentation.mp4",
  poster,
}: Props) {
  return (
    <div className="mx-auto mt-10 w-full max-w-3xl overflow-hidden rounded-2xl bg-encre shadow-lg ring-1 ring-black/5">
      <video
        className="aspect-video w-full object-contain"
        controls
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Votre navigateur ne permet pas la lecture de cette vidéo.
      </video>
    </div>
  );
}