import { AlbumPrivacy } from "@prisma/client";
import { notFound, unauthorized } from "next/navigation";

import WorldGallery from "@/app/(photography)/_components/world-gallery";
import { getAlbumByShortID } from "@/domain/photography/services/albums";
import { getAlbumPhotosWithCoordinates } from "@/domain/photography/services/photos";
import { getAdminUser } from "@/lib/auth/admin";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { Metadata } from "next";

export const dynamic = "force-dynamic";

export const generateMetadata = async ({
  params,
}: PageProps<"/albums/[shortId]/worldview">): Promise<Metadata> => {
  const { shortId } = await params;
  const album = await getAlbumByShortID(shortId);

  if (!album) {
    return notFound();
  }

  if (album.privacy === AlbumPrivacy.PRIVATE && !(await getAdminUser())) {
    return unauthorized();
  }

  return { title: `Carte de l'album ${album.name} | Carl-Adrien Mercey` };
};

const AlbumWorldViewPage = async ({
  params,
  searchParams,
}: PageProps<"/albums/[shortId]/worldview">) => {
  const { shortId } = await params;

  const album = await getAlbumByShortID(shortId);
  if (!album) {
    return notFound();
  }

  if (album.privacy === AlbumPrivacy.PRIVATE && !(await getAdminUser())) {
    return unauthorized();
  }

  const [photos, { photo }] = await Promise.all([
    getAlbumPhotosWithCoordinates(album.id),
    searchParams,
  ]);

  return (
    <WorldGallery
      photos={photos}
      backPath={generatePath(Routes.PHOTO_ALBUM, { shortId })}
      focusPhotoShortId={typeof photo === "string" ? photo : undefined}
      enableFitBoundsIntro
    />
  );
};

export default AlbumWorldViewPage;
