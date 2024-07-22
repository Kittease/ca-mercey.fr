import spotifyApiClientInstance from "@/lib/spotify-client";

import { transformRawSimplifiedAlbumToSimplifiedAlbum } from "./transform";
import { RawSimplifiedAlbum, SimplifiedAlbum } from "./types";

export const searchAlbums = async (
  search: string
): Promise<SimplifiedAlbum[]> => {
  const res = await spotifyApiClientInstance.fetch(
    `/search?type=album&q=${search}`
  );

  if (res.error) {
    throw new Error(res.error.message);
  }

  return res.albums.items.map((album: RawSimplifiedAlbum) =>
    transformRawSimplifiedAlbumToSimplifiedAlbum(album)
  );
};
