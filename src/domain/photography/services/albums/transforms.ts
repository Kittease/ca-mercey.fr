import { transformRawPhotoToPhoto } from "@/domain/photography/services/photos/transforms";

import { Album, AlbumWithPhotos, RawAlbum, RawAlbumWithPhotos } from "./types";

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

export const transformRawAlbumWithPhotosToAlbumWithPhotos = ({
  photos: rawPhotos,
  ...rawAlbum
}: RawAlbumWithPhotos): AlbumWithPhotos => {
  return {
    ...transformRawAlbumToAlbum(rawAlbum),
    photos: rawPhotos
      .map(({ photo: rawPhoto }) => transformRawPhotoToPhoto(rawPhoto))
      .sort(
        (
          { metadata: { captureTime: aCaptureTime } },
          { metadata: { captureTime: bCaptureTime } },
        ) =>
          aCaptureTime && bCaptureTime
            ? aCaptureTime > bCaptureTime
              ? 1
              : aCaptureTime < bCaptureTime
                ? -1
                : 0
            : 0,
      ),
  };
};
