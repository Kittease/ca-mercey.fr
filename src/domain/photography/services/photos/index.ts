import "server-only";

import { Photos } from "@prisma/client";
import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";

import prisma from "@/lib/prisma";

import { transformRawPhotoToPhoto } from "./transforms";
import { NewPhotoData, RawPhoto } from "./types";

export const getPhotoPath = (id: string) => {
  return `/photos/original/${id}.jpg`;
};

export const getThumbnailPath = (id: string) => {
  return `/photos/thumbnail/${id}.jpg`;
};

type LocatedRow = { id: string; latitude: number; longitude: number };

const toCoordinatesById = (located: LocatedRow[]) =>
  new Map(
    located.map(({ id, latitude, longitude }) => [id, { latitude, longitude }]),
  );

export const attachCoordinates = async <T extends Photos>(
  photos: T[],
): Promise<(T & Pick<RawPhoto, "locationCoordinates">)[]> => {
  if (photos.length === 0) {
    return photos;
  }

  const ids = photos.map((photo) => photo.id);

  const located = await prisma.$queryRaw<LocatedRow[]>`
    SELECT id::text AS id,
           ST_Y(location_coordinates) AS latitude,
           ST_X(location_coordinates) AS longitude
    FROM photography.photos
    WHERE id = ANY(${ids}::uuid[])
      AND location_coordinates IS NOT NULL
  `;

  const coordinatesById = toCoordinatesById(located);

  return photos.map((photo) => ({
    ...photo,
    locationCoordinates: coordinatesById.get(photo.id),
  }));
};

export const getAllPhotos = async () => {
  const photos = await prisma.photos.findMany({
    orderBy: { createdAt: "desc" },
    include: { galleryEntry: true, albums: { select: { albumId: true } } },
  });

  return (await attachCoordinates(photos)).map(transformRawPhotoToPhoto);
};

export const getGalleryPhotos = async () => {
  const photos = await prisma.photos.findMany({
    where: { galleryEntry: { isNot: null } },
    orderBy: [
      { captureTime: { sort: "desc", nulls: "last" } },
      { createdAt: "desc" },
    ],
    include: { galleryEntry: true, albums: { select: { albumId: true } } },
  });

  return (await attachCoordinates(photos)).map(transformRawPhotoToPhoto);
};

const hydratePhotosWithCoordinates = async (located: LocatedRow[]) => {
  if (located.length === 0) {
    return [];
  }

  const coordinatesById = toCoordinatesById(located);

  const photos = await prisma.photos.findMany({
    where: { id: { in: located.map(({ id }) => id) } },
    orderBy: { captureTime: "asc" },
    include: { galleryEntry: true, albums: { select: { albumId: true } } },
  });

  return photos.map((photo) =>
    transformRawPhotoToPhoto({
      ...photo,
      locationCoordinates: coordinatesById.get(photo.id),
    }),
  );
};

export const getGalleryPhotosWithCoordinates = async () => {
  const located = await prisma.$queryRaw<LocatedRow[]>`
    SELECT p.id::text AS id,
           ST_Y(p.location_coordinates) AS latitude,
           ST_X(p.location_coordinates) AS longitude
    FROM photography.photos p
    INNER JOIN photography.gallery_photo g ON g.photo_id = p.id
    WHERE p.location_coordinates IS NOT NULL
  `;

  return hydratePhotosWithCoordinates(located);
};

export const getAlbumPhotosWithCoordinates = async (albumId: string) => {
  const located = await prisma.$queryRaw<LocatedRow[]>`
    SELECT p.id::text AS id,
           ST_Y(p.location_coordinates) AS latitude,
           ST_X(p.location_coordinates) AS longitude
    FROM photography.photos p
    INNER JOIN photography.album_photo a ON a.photo_id = p.id
    WHERE a.album_id = ${albumId}::uuid
      AND p.location_coordinates IS NOT NULL
  `;

  return hydratePhotosWithCoordinates(located);
};

export const getPhoto = async (id: string) => {
  const photo = await prisma.photos.findUnique({ where: { id } });
  if (!photo) {
    return null;
  }

  const [located] = await attachCoordinates([photo]);

  return located ? transformRawPhotoToPhoto(located) : null;
};

export const createPhoto = async (data: NewPhotoData) => {
  const photoFields = {
    width: data.width,
    height: data.height,
    thumbhash: data.thumbhash,
    camera: data.camera,
    lens: data.lens,
    focalLength: data.focalLength,
    aperture: data.aperture,
    exposureTime: data.exposureTime,
    iso: data.iso,
    captureTime: data.captureTime,
  };

  const photo = await prisma.photos.upsert({
    where: { id: data.id },
    create: {
      id: data.id,
      shortId: customAlphabet(nolookalikes, 5)(),
      ...photoFields,
    },
    update: photoFields,
  });

  if (data.locationCoordinates) {
    await prisma.$executeRaw`
      UPDATE photography.photos
      SET location_coordinates = ST_SetSRID(ST_MakePoint(${data.locationCoordinates.longitude}, ${data.locationCoordinates.latitude}), 4326)
      WHERE id = ${photo.id}::uuid
    `;

    const updated = await prisma.photos.findUnique({ where: { id: photo.id } });
    if (updated) {
      return updated;
    }
  }

  return photo;
};

export const deletePhoto = async (id: string) => {
  await prisma.photos.delete({ where: { id } });
};

export const addPhotosToGallery = async (ids: string[]) => {
  await prisma.galleryPhoto.createMany({
    data: ids.map((photoId) => ({ photoId })),
    skipDuplicates: true,
  });
};

export const removePhotosFromGallery = async (ids: string[]) => {
  await prisma.galleryPhoto.deleteMany({ where: { photoId: { in: ids } } });
};
