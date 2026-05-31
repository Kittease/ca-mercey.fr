import { AlbumPrivacy, Albums } from "@prisma/client";

export type RawAlbum = Albums;

export type Album = {
  id: string;
  shortId: string;
  name: string;
  description: string | null;
  privacy: AlbumPrivacy;
  coverThumbnailSrc: string | null;
};

export type NewAlbumData = {
  name: string;
  description?: string;
  privacy?: AlbumPrivacy;
};
