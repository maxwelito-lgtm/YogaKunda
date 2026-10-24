import LieuRoute, { metadataLieu } from "@/components/LieuRoute";

export const metadata = metadataLieu("oloron");

export default function Page() {
  return <LieuRoute lieuId="oloron" />;
}
