import { Routes } from "@/lib/routes";
import { generatePath } from "@/lib/routes/utils";
import { thumbhashToDataUrl } from "@/lib/thumbhash/decode";

import { RawPhoto, Photo } from "./types";

export const transformRawPhotoToPhoto = (rawPhoto: RawPhoto): Photo => {
  return {
    id: rawPhoto.id,
    shortId: rawPhoto.shortId,
    src: generatePath(Routes.PHOTO, { id: rawPhoto.id }),
    thumbnailSrc: generatePath(Routes.PHOTO_THUMBNAIL, { id: rawPhoto.id }),
    width: rawPhoto.width,
    height: rawPhoto.height,
    placeholderUrl: thumbhashToDataUrl(rawPhoto.thumbhash),
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
