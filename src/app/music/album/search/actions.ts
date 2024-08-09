"use server";

import { getAlbum, saveAlbum } from "@/domain/spotify/services/album";

export const saveFavoriteAlbum = async (albumId: string) => {
  const album = await getAlbum(albumId);
  return saveAlbum(album);
};
