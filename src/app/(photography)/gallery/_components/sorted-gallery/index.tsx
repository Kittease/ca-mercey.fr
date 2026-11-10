"use client";

import { useQueryState } from "nuqs";
import { useMemo } from "react";

import GalleryLayout from "@/app/(photography)/_components/gallery-layout";
import {
  galleryDirectionParser,
  GalleryOrderDirection,
} from "@/app/(photography)/gallery/search-params";
import { Photo } from "@/domain/photography/services/photos/types";

const sortByCaptureTime = (photos: Photo[], direction: GalleryOrderDirection) =>
  [...photos].sort((a, b) => {
    const aTime = a.metadata.captureTime?.getTime();
    const bTime = b.metadata.captureTime?.getTime();

    // Photos without a capture time always come last.
    if (aTime === undefined || bTime === undefined) {
      return (aTime === undefined ? 1 : 0) - (bTime === undefined ? 1 : 0);
    }

    return direction === "asc" ? aTime - bTime : bTime - aTime;
  });

interface SortedGalleryProps {
  photos: Photo[];
  worldviewPath: string;
}

const SortedGallery = ({ photos, worldviewPath }: SortedGalleryProps) => {
  const [direction] = useQueryState("direction", galleryDirectionParser);

  const sortedPhotos = useMemo(
    () => sortByCaptureTime(photos, direction),
    [photos, direction],
  );

  return (
    <GalleryLayout
      photos={sortedPhotos}
      worldviewPath={worldviewPath}
      disableTopPadding
    />
  );
};

export default SortedGallery;
