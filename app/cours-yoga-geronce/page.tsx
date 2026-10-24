import LieuRoute, { metadataLieu } from "@/components/LieuRoute";

export const metadata = metadataLieu("geronce");

export default function Page() {
  return <LieuRoute lieuId="geronce" />;
}
