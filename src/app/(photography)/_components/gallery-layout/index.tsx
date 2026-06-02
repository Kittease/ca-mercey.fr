"use client";

import PhotoLayout from "@/app/admin/_components/photo-layout";
import { Photo } from "@/domain/photography/services/photos/types";

interface GalleryLayoutProps {
  photos: Photo[];
}

const GalleryLayout = ({ photos }: GalleryLayoutProps) => {
  return <PhotoLayout photos={photos} />;
};

export default GalleryLayout;
