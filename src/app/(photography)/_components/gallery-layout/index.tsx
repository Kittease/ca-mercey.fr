"use client";

import { motion } from "motion/react";
import { PropsWithChildren, useCallback, useState } from "react";

import Lightbox from "@/app/(photography)/_components/lightbox";
import PhotoLayout from "@/app/admin/_components/photo-layout";
import { Photo } from "@/domain/photography/services/photos/types";

type OpenState = {
  index: number;
  origin: DOMRect;
};

interface GalleryLayoutProps {
  photos: Photo[];
}

const GalleryLayout = ({ photos }: GalleryLayoutProps) => {
  const [open, setOpen] = useState<OpenState | null>(null);

  const PhotoWrapper = useCallback(
    ({ photo, children }: PropsWithChildren<{ photo: { id: string } }>) => (
      <motion.div
        data-photo-id={photo.id}
        onClick={(event) =>
          setOpen({
            index: photos.findIndex((p) => p.id === photo.id),
            origin: event.currentTarget.getBoundingClientRect(),
          })
        }
        className="absolute inset-0 cursor-pointer"
      >
        {children}
      </motion.div>
    ),
    [photos],
  );

  const openPhoto = open ? photos[open.index] : undefined;

  return (
    <>
      <PhotoLayout photos={photos} PhotoWrapper={PhotoWrapper} />

      {open !== null && openPhoto ? (
        <Lightbox
          photos={photos}
          index={open.index}
          photo={openPhoto}
          origin={open.origin}
          onClose={() => setOpen(null)}
          onNavigate={(index) =>
            setOpen((current) => (current ? { ...current, index } : current))
          }
        />
      ) : null}
    </>
  );
};

export default GalleryLayout;
