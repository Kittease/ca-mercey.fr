import { Album, RawAlbum } from "./types";

export const transformRawAlbumToAlbum = (rawAlbum: RawAlbum): Album => {
  return {
    id: rawAlbum.id,
    shortId: rawAlbum.shortId,
    name: rawAlbum.name,
    description: rawAlbum.description,
    privacy: rawAlbum.privacy,
    coverThumbnailSrc: rawAlbum.coverPhoto
      ? `/photos/${rawAlbum.coverPhoto}/thumbnail`
      : null,
  };
};
