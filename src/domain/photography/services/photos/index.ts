import "server-only";

import { customAlphabet } from "nanoid";
import { nolookalikes } from "nanoid-dictionary";

import prisma from "@/lib/prisma";

import { transformRawPhotoToPhoto } from "./transforms";
import { NewPhotoData } from "./types";

export const getPhotoPath = (storageKey: string) => {
  return `/photos/original/${storageKey}`;
};

export const getThumbnailPath = (storageKey: string) => {
  return `/photos/thumbnail/${storageKey}`;
};

export const getAllPhotos = async () => {
  const photos = await prisma.photos.findMany({
    orderBy: { createdAt: "desc" },
  });

  return photos.map(transformRawPhotoToPhoto);
};

export const getPhoto = async (id: string) => {
  const photo = await prisma.photos.findUnique({ where: { id } });

  return photo ? transformRawPhotoToPhoto(photo) : null;
};

export const getStorageKeyFromId = async (id: string) => {
  const photo = await prisma.photos.findUnique({
    select: { storageKey: true },
    where: { id },
  });

  if (!photo) {
    throw new Error("Photo not found");
  }

  return photo.storageKey;
};

export const createPhoto = async (data: NewPhotoData) => {
  const photo = await prisma.photos.create({
    data: {
      shortId: customAlphabet(nolookalikes, 5)(),
      storageKey: data.name,
      width: data.width,
      height: data.height,
      camera: data.camera,
      lens: data.lens,
      focalLength: data.focalLength,
      aperture: data.aperture,
      exposureTimeNumerator: data.exposureTimeNumerator,
      exposureTimeDenominator: data.exposureTimeDenominator,
      iso: data.iso,
      captureTime: data.captureTime,
    },
  });

  if (data.locationCoordinates) {
    await prisma.$executeRaw`
      UPDATE photography.photos
      SET location_coordinates = ST_SetSRID(ST_MakePoint(${data.locationCoordinates.longitude}, ${data.locationCoordinates.latitude}}), 4326)
      WHERE id = ${photo.id}::uuid
    `;

    return prisma.photos.findUnique({ where: { id: photo.id } });
  }

  return photo;
};

export const deletePhoto = async (id: string) => {
  await prisma.photos.delete({ where: { id } });
};
