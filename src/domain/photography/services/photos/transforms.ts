import { RawPhoto, Photo } from "./types";

export const transformRawPhotoToPhoto = (rawPhoto: RawPhoto): Photo => {
  return {
    id: rawPhoto.id,
    shortId: rawPhoto.shortId,
    src: `/photos/${rawPhoto.id}`,
    thumbnailSrc: `/photos/${rawPhoto.id}/thumbnail`,
    width: rawPhoto.width,
    height: rawPhoto.height,
    metadata: {
      camera: rawPhoto.camera ?? undefined,
      lens: rawPhoto.lens ?? undefined,
      focalLength: rawPhoto.focalLength ?? undefined,
      aperture: rawPhoto.aperture ?? undefined,
      exposureTime:
        rawPhoto.exposureTimeNumerator && rawPhoto.exposureTimeDenominator
          ? {
              numerator: rawPhoto.exposureTimeNumerator,
              denominator: rawPhoto.exposureTimeDenominator,
            }
          : undefined,
      iso: rawPhoto.iso ?? undefined,
      locationName: rawPhoto.locationName ?? undefined,
      locationCoordinates: rawPhoto.locationCoordinates ?? undefined,
    },
  };
};
