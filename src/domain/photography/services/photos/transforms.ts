import { RawPhoto, Photo } from "./types";

export const transformRawPhotoToPhoto = (rawPhoto: RawPhoto): Photo => {
  return {
    id: rawPhoto.id,
    shortId: rawPhoto.shortId,
    src: `/photos/${rawPhoto.id}`,
    thumbnailSrc: `/photos/${rawPhoto.id}/thumbnail`,
    width: rawPhoto.width,
    height: rawPhoto.height,
    inGallery: Boolean(rawPhoto.galleryEntry),
    albumIds: (rawPhoto.albums ?? []).map((album) => album.albumId),
    metadata: {
      camera: rawPhoto.camera ?? undefined,
      lens: rawPhoto.lens ?? undefined,
      focalLength: rawPhoto.focalLength ?? undefined,
      aperture: rawPhoto.aperture ?? undefined,
      exposureTime: rawPhoto.exposureTime ?? undefined,
      iso: rawPhoto.iso ?? undefined,
      locationName: rawPhoto.locationName ?? undefined,
      locationCoordinates: rawPhoto.locationCoordinates ?? undefined,
      captureTime: rawPhoto.captureTime ?? undefined,
    },
  };
};
