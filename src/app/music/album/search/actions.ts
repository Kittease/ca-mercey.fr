"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import {
  addFavoriteProject,
  removeFavoriteProject,
} from "@/domain/music/services/favorite-projects";
import { getAlbum, saveAlbum } from "@/domain/spotify/services/album";
import { getAdminUser } from "@/lib/auth/admin";
import { FetchTags } from "@/lib/cache/types";
import { Routes } from "@/lib/routes";

export const saveFavoriteAlbum = async (albumId: string) => {
  if (!(await getAdminUser())) {
    throw new Error("Unauthorized");
  }

  const album = await getAlbum(albumId);
  await saveAlbum(album);
  await addFavoriteProject(albumId);

  revalidateTag(FetchTags.SpotifyAlbumSearch, "default");
  revalidatePath(Routes.FAVORITE_PROJECTS);
};

export const removeFavoriteAlbum = async (albumId: string) => {
  if (!(await getAdminUser())) {
    throw new Error("Unauthorized");
  }

  await removeFavoriteProject(albumId);

  revalidateTag(FetchTags.SpotifyAlbumSearch, "default");
  revalidatePath(Routes.FAVORITE_PROJECTS);
};
