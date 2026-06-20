import { AlbumPhoto, AlbumPrivacy, Albums, Photos } from "@prisma/client";

import { Photo } from "@/domain/photography/services/photos/types";

export type RawAlbum = Albums & {
  cover?: Photos | null;
};

export type Album = {
  id: string;
  shortId: string;
  name: string;
  description: string | null;
  privacy: AlbumPrivacy;
  coverThumbnailSrc: string | null;
  coverPlaceholderUrl: string | null;
};

export type RawAlbumWithPhotos = RawAlbum & {
  photos: (AlbumPhoto & { photo: Photos })[];
};

export type AlbumWithPhotos = Album & {
  photos: Photo[];
};

export type NewAlbumData = {
  name: string;
  description?: string;
  privacy?: AlbumPrivacy;
};
