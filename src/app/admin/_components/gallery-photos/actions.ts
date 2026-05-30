"use server";

import { revalidatePath } from "next/cache";

import {
  addPhotosToGallery,
  removePhotosFromGallery,
} from "@/domain/photography/services/photos";
import { getAdminUser } from "@/lib/auth/admin";
import { Routes } from "@/lib/routes";

export const addToGallery = async (ids: string[]): Promise<string[]> => {
  if (!(await getAdminUser())) {
    throw new Error("Unauthorized");
  }

  await addPhotosToGallery(ids);

  revalidatePath(Routes.ADMIN);

  return ids;
};

export const removeFromGallery = async (ids: string[]): Promise<string[]> => {
  if (!(await getAdminUser())) {
    throw new Error("Unauthorized");
  }

  await removePhotosFromGallery(ids);

  revalidatePath(Routes.ADMIN);

  return ids;
};
