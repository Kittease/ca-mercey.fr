import GalleryHeader from "@/app/(photography)/gallery/_components/gallery-header";
import SortedGallery from "@/app/(photography)/gallery/_components/sorted-gallery";
import { getGalleryPhotos } from "@/domain/photography/services/photos";
import { Routes } from "@/lib/routes";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Galerie | Carl-Adrien Mercey",
};

const GalleryPage = async () => {
  const photos = await getGalleryPhotos();

  return (
    <div className="flex w-full flex-col">
      <GalleryHeader
        showWorldviewLink={photos.some(
          ({ metadata: { locationCoordinates } }) => locationCoordinates,
        )}
      />

      <div className="mt-24 sm:mt-16">
        <SortedGallery
          photos={photos}
          worldviewPath={Routes.GALLERY_WORLDVIEW}
        />
      </div>
    </div>
  );
};

export default GalleryPage;
