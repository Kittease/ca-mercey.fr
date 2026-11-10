"use server";

import { revalidatePath } from "next/cache";

import {
  deletePhoto,
  getPhotoPath,
  getThumbnailPath,
} from "@/domain/photography/services/photos";
import { getAdminUser } from "@/lib/auth/admin";
import logger from "@/lib/logger";
import { Routes } from "@/lib/routes";
import { deleteFile } from "@/lib/storage";

interface DeletePhotosResult {
  deletedIds: string[];
  failedIds: string[];
}

export const deletePhotos = async (
  ids: string[],
): Promise<DeletePhotosResult> => {
  if (!(await getAdminUser())) {
    throw new Error("Unauthorized");
  }

  const deletedIds: string[] = [];
  const failedIds: string[] = [];

  for (const id of ids) {
    try {
      // Delete the database record first: if it fails the photo is left fully
      // intact (and still serveable) rather than pointing at missing files.
      await deletePhoto(id);
      await Promise.all([
        deleteFile(getPhotoPath(id)),
        deleteFile(getThumbnailPath(id)),
      ]);

      deletedIds.push(id);
    } catch (err) {
      logger.error({ err, id }, "[PHOTOS] Failed to delete photo");

      failedIds.push(id);
    }
  }

  if (deletedIds.length > 0) {
    revalidatePath(Routes.ADMIN);
  }

  return { deletedIds, failedIds };
};
