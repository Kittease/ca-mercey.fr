import GalleryLayout from "@/app/(photography)/_components/gallery-layout";
import { getGalleryPhotos } from "@/domain/photography/services/photos";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Galerie — Carl-Adrien Mercey",
};

export const dynamic = "force-dynamic";

const GalleryPage = async () => {
  const photos = await getGalleryPhotos();

  return <GalleryLayout photos={photos} />;
};

export default GalleryPage;
