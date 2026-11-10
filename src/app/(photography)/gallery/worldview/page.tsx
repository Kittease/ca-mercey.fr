import WorldGallery from "@/app/(photography)/_components/world-gallery";
import { getGalleryPhotosWithCoordinates } from "@/domain/photography/services/photos";
import { Routes } from "@/lib/routes";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon monde en photos | Carl-Adrien Mercey",
};

const WorldViewPage = async ({
  searchParams,
}: PageProps<"/gallery/worldview">) => {
  const [photos, { photo }] = await Promise.all([
    getGalleryPhotosWithCoordinates(),
    searchParams,
  ]);

  return (
    <WorldGallery
      photos={photos}
      backPath={Routes.GALLERY}
      focusPhotoShortId={typeof photo === "string" ? photo : undefined}
    />
  );
};

export default WorldViewPage;
