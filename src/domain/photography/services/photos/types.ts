import { GalleryPhoto, Photos } from "@prisma/client";

export type RawPhoto = Photos & {
  locationCoordinates?: {
    latitude: number;
    longitude: number;
  };
  galleryEntry?: GalleryPhoto | null;
  albums?: { albumId: string }[];
};

export type Photo = {
  id: string;
  shortId: string;
  src: string;
  thumbnailSrc: string;
  width: number;
  height: number;
  placeholderUrl: string | null;
  inGallery: boolean;
  albumIds: string[];
  metadata: {
    camera?: string;
    lens?: string;
    focalLength?: number;
    aperture?: number;
    exposureTime?: number;
    iso?: number;
    locationName?: string;
    locationCoordinates?: {
      latitude: number;
      longitude: number;
    };
    captureTime?: Date;
  };
};

export type NewPhotoData = {
  id: string;
  width: number;
  height: number;
  thumbhash?: string;
  camera?: string;
  lens?: string;
  focalLength?: number;
  aperture?: number;
  exposureTime?: number;
  iso?: number;
  locationCoordinates?: { latitude: number; longitude: number };
  captureTime?: Date;
};
