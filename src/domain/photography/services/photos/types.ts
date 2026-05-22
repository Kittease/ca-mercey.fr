import { Photos } from "@prisma/client";

export type RawPhoto = Photos & {
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  };
};

export type Photo = {
  id: string;
  shortId: string;
  src: string;
  thumbnailSrc: string;
  width: number;
  height: number;
  metadata: {
    camera?: string;
    lens?: string;
    focalLength?: number;
    aperture?: number;
    exposureTime?: {
      numerator: number;
      denominator: number;
    };
    iso?: number;
    locationName?: string;
    locationCoordinates?: {
      latitude: number;
      longitude: number;
    };
  };
};

export type NewPhotoData = {
  name: string;
  width: number;
  height: number;
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: number;
  exposureTimeNumerator?: number;
  exposureTimeDenominator?: number;
  iso?: number;
  locationCoordinates?: { latitude: number; longitude: number };
  captureTime?: Date;
};
