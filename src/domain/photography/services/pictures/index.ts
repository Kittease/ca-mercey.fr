"server only";

import { transformRawPictureToPicture } from "@/domain/photography/services/pictures/transforms";
import { Picture } from "@/domain/photography/services/pictures/types";
import prisma from "@/lib/prisma";

export const getAllPictures = async (): Promise<Picture[]> => {
  const pictures = await prisma.pictures.findMany({
    include: { PictureMetadata: true },
    orderBy: [{ PictureMetadata: { date: "desc" } }],
  });

  return pictures.map(transformRawPictureToPicture);
};
