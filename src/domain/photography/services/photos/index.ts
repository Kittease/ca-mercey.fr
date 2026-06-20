import "server-only";

import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";

import prisma from "@/lib/prisma";

import { transformRawPhotoToPhoto } from "./transforms";
import { NewPhotoData } from "./types";

export const getPhotoPath = (id: string) => {
  return `/photos/original/${id}.jpg`;
};

export const getThumbnailPath = (id: string) => {
  return `/photos/thumbnail/${id}.jpg`;
};

export const getAllPhotos = async () => {
  const photos = await prisma.photos.findMany({
    orderBy: { createdAt: "desc" },
    include: { galleryEntry: true, albums: { select: { albumId: true } } },
  });

  return photos.map(transformRawPhotoToPhoto);
};

export const getPhoto = async (id: string) => {
  const photo = await prisma.photos.findUnique({ where: { id } });

  return photo ? transformRawPhotoToPhoto(photo) : null;
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
