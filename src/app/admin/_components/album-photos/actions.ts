"use server";

import { revalidatePath } from "next/cache";

import {
  addPhotosToAlbum,
  createAlbum,
  removePhotosFromAlbum,
} from "@/domain/photography/services/albums";
import {
  Album,
  NewAlbumData,
} from "@/domain/photography/services/albums/types";
import { getAdminUser } from "@/lib/auth/admin";
import { Routes } from "@/lib/routes";

export const addToAlbum = async (
  albumId: string,
  ids: string[],
): Promise<string[]> => {
  if (!(await getAdminUser())) {
    throw new Error("Unauthorized");
  }

  await addPhotosToAlbum(albumId, ids);

  revalidatePath(Routes.ADMIN);

  return ids;
};

export const removeFromAlbum = async (
  albumId: string,
  ids: string[],
): Promise<string[]> => {
  if (!(await getAdminUser())) {
    throw new Error("Unauthorized");
  }

  await removePhotosFromAlbum(albumId, ids);

  revalidatePath(Routes.ADMIN);

  return ids;
};

export const createAlbumAction = async (data: NewAlbumData): Promise<Album> => {
  if (!(await getAdminUser())) {
    throw new Error("Unauthorized");
  }

  const album = await createAlbum(data);

  revalidatePath(Routes.ADMIN);

  return album;
};
