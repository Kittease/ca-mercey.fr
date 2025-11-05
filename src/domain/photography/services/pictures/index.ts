import { transformRawPictureToPicture } from "@/domain/photography/services/pictures/transform";
import prisma from "@/lib/prisma";

import type exifr from "exifr";

import type { Picture } from "@/domain/photography/services/pictures/types";

const formatExposure = (value: unknown): string | undefined => {
  const num = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(num) || num <= 0) {
    return undefined;
  }

  if (num < 1) {
    const target = 1 / num;
    const standards = [
      1, 2, 3, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 80, 100, 125,
      160, 200, 250, 320, 400, 500, 640, 800, 1000, 1250, 1600, 2000, 2500,
      3200, 4000, 5000, 6400, 8000,
    ];
    let best = standards[0];
    for (let i = 1; i < standards.length; i += 1) {
      if (Math.abs(standards[i] - target) < Math.abs(best - target)) {
        best = standards[i];
      }
    }
    return `1/${best}`;
  }

  return String(num);
};

export const getAllPictures = async (): Promise<Picture[]> => {
  const pictures = await prisma.pictures.findMany({
    include: { PictureMetadata: true },
    orderBy: [{ PictureMetadata: { date: "desc" } }],
  });

  return pictures.map(transformRawPictureToPicture);
};

interface AddPictureOptions {
  id: string;
  name: string;
  dimensions: { width: number; height: number };
  exif: Awaited<ReturnType<typeof exifr.parse>>;
}

export const addPicture = async ({
  id,
  name,
  dimensions,
  exif,
}: AddPictureOptions): Promise<Picture> => {
  const picture = await prisma.pictures.create({
    data: {
      id,
      name,
      shortId: id.slice(0, 8),
      PictureMetadata: {
        create: {
          date: exif?.DateTimeOriginal
            ? new Date(exif.DateTimeOriginal)
            : undefined,
          width: dimensions.width,
          height: dimensions.height,
          camera: exif?.Model ?? undefined,
          lens: exif?.LensModel ?? undefined,
          focalLength: exif?.FocalLength ? Number(exif.FocalLength) : undefined,
          aperture: exif?.FNumber ? `f/${exif.FNumber}` : undefined,
          exposure: formatExposure(exif?.ExposureTime),
          iso: exif?.ISO ? Number(exif.ISO) : undefined,
          location: exif?.gps
            ? exif.gps.latitude && exif.gps.longitude
              ? `${exif.gps.latitude}, ${exif.gps.longitude}`
              : undefined
            : exif?.latitude && exif?.longitude
            ? `${exif.latitude}, ${exif.longitude}`
            : undefined,
        },
      },
    },
    include: { PictureMetadata: true },
  });

  return transformRawPictureToPicture(picture);
};

export const deletePicture = async (id: string): Promise<void> => {
  await prisma.pictures.delete({ where: { id } });
};
