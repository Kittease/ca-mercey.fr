import { AlbumPrivacy } from "@prisma/client";
import { notFound, unauthorized } from "next/navigation";

import GalleryLayout from "@/app/(photography)/_components/gallery-layout";
import AlbumHeader from "@/app/(photography)/albums/[shortId]/_components/album-header";
import { getAlbumByShortID } from "@/domain/photography/services/albums";
import { getAdminUser } from "@/lib/auth/admin";
import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";

import type { Metadata } from "next";

export const generateMetadata = async ({
  params,
}: PageProps<"/albums/[shortId]">): Promise<Metadata> => {
  const { shortId } = await params;
  const album = await getAlbumByShortID(shortId);

  if (!album) {
    return notFound();
  }

  if (album.privacy === AlbumPrivacy.PRIVATE && !(await getAdminUser())) {
    return unauthorized();
  }

  return { title: `${album.name} | Carl-Adrien Mercey` };
};

const AlbumPage = async ({ params }: PageProps<"/albums/[shortId]">) => {
  const { shortId } = await params;
  const album = await getAlbumByShortID(shortId);
  if (!album) {
    return notFound();
  }

  if (album.privacy === AlbumPrivacy.PRIVATE && !(await getAdminUser())) {
    return unauthorized();
  }

  if (album.photos.length === 0) {
    return <p>Album vide</p>;
  }

  const worldviewPath = generatePath(Routes.PHOTO_ALBUM_WORLDVIEW, {
    shortId,
  });

  return (
    <div className="flex w-full flex-col">
      <AlbumHeader album={album} worldviewPath={worldviewPath} />

      <GalleryLayout photos={album.photos} worldviewPath={worldviewPath} />
    </div>
  );
};

export default AlbumPage;
