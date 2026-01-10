"use server";

import { getAllPictures } from "@/domain/photography/services/pictures";
import type { Picture } from "@/domain/photography/services/pictures/types";

export const getPictures = async (): Promise<Picture[]> => {
  return getAllPictures();
};
