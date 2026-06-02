import "server-only";

import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";

import prisma from "@/lib/prisma";

import {
  transformRawAlbumToAlbum,
  transformRawAlbumWithPhotosToAlbumWithPhotos,
} from "./transforms";
import { NewAlbumData } from "./types";

export const getAllAlbums = async () => {
  const albums = await prisma.albums.findMany({
    orderBy: { createdAt: "desc" },
  });

  return albums.map(transformRawAlbumToAlbum);
};

export const getAlbumByShortID = async (shortId: string) => {
  const album = await prisma.albums.findUnique({
    include: { photos: { include: { photo: true } } },
    where: { shortId },
  });

  return album ? transformRawAlbumWithPhotosToAlbumWithPhotos(album) : null;
};

export const createAlbum = async (data: NewAlbumData) => {
  const album = await prisma.albums.create({
    data: {
      shortId: customAlphabet(nolookalikes, 5)(),
      name: data.name,
      description: data.description,
      privacy: data.privacy,
    },
  });

  return transformRawAlbumToAlbum(album);
};

export const addPhotosToAlbum = async (albumId: string, photoIds: string[]) => {
  // Membership rows carry a unique position within the album, so we append the
  // not-yet-present photos after the current highest position.
  const existing = await prisma.albumPhoto.findMany({
    where: { albumId },
    select: { photoId: true, position: true },
  });

  const existingPhotoIds = new Set(existing.map((entry) => entry.photoId));
  const nextPosition =
    existing.reduce((max, entry) => Math.max(max, entry.position), -1) + 1;

  const toAdd = photoIds.filter((photoId) => !existingPhotoIds.has(photoId));

  if (toAdd.length === 0) {
    return;
  }

  await prisma.albumPhoto.createMany({
    data: toAdd.map((photoId, index) => ({
      albumId,
      photoId,
      position: nextPosition + index,
    })),
    skipDuplicates: true,
  });
};

export const removePhotosFromAlbum = async (
  albumId: string,
  photoIds: string[],
) => {
  await prisma.albumPhoto.deleteMany({
    where: { albumId, photoId: { in: photoIds } },
  });
};
