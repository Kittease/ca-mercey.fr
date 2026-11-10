"use client";

import { ImagesIcon, Loader2Icon } from "lucide-react";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import {
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
} from "@/app/_components/ui/responsive-alert-dialog";
import {
  addToGallery,
  removeFromGallery,
} from "@/app/admin/_components/gallery-photos/actions";
import { usePhotoSelection } from "@/app/admin/_components/photo-wrapper/select/context";
import { useUpload } from "@/app/admin/_components/upload/context";

const pluralize = (count: number, word: string) =>
  count === 1 ? word : `${word}s`;

const GalleryPhotos = () => {
  const { selectedPhotos, selectedPhotoCount, clearSelection } =
    usePhotoSelection();
  const { photos, setPhotosGalleryStatus } = useUpload();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const allInGallery = useMemo(() => {
    const galleryIds = new Set(
      photos.filter((photo) => photo.inGallery).map((photo) => photo.id),
    );

    return selectedPhotos.every(({ id }) => galleryIds.has(id));
  }, [photos, selectedPhotos]);

  const handleAdd = () => {
    const ids = selectedPhotos.map(({ id }) => id);

    startTransition(async () => {
      try {
        await addToGallery(ids);

        setPhotosGalleryStatus(ids, true);
        clearSelection();

        toast.success(
          `${ids.length} ${pluralize(ids.length, "photo")} added to the gallery`,
        );
      } catch {
        toast.error("Failed to add photos to the gallery");
      }
    });
  };

  const handleOpenChange = (next: boolean) => {
    if (isPending) {
      return;
    }

    if (!next) {
      setError(null);
    }

    setOpen(next);
  };

  const handleRemove = () => {
    const ids = selectedPhotos.map(({ id }) => id);

    setError(null);

    startTransition(async () => {
      try {
        await removeFromGallery(ids);

        setPhotosGalleryStatus(ids, false);
        clearSelection();
        setOpen(false);

        toast.success(
          `${ids.length} ${pluralize(ids.length, "photo")} removed from the gallery`,
        );
      } catch {
        setError("Something went wrong while removing. Please try again.");

        toast.error("Failed to remove photos from the gallery");
      }
    });
  };

  const noun = pluralize(selectedPhotoCount, "photo");

  if (allInGallery) {
    return (
      <>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setOpen(true)}
          aria-label={`Remove ${selectedPhotoCount} selected ${noun} from the gallery`}
        >
          <ImagesIcon />
          Remove from gallery
        </Button>

        <ResponsiveAlertDialog open={open} onOpenChange={handleOpenChange}>
          <ResponsiveAlertDialogContent>
            <ResponsiveAlertDialogHeader>
              <ResponsiveAlertDialogTitle>
                Remove {selectedPhotoCount} {noun} from the gallery?
              </ResponsiveAlertDialogTitle>

              <ResponsiveAlertDialogDescription>
                This hides the selected {noun} from the public gallery. You can
                add them back at any time.
              </ResponsiveAlertDialogDescription>
            </ResponsiveAlertDialogHeader>

            {error ? (
              <p className="px-4 text-sm text-destructive sm:px-0">{error}</p>
            ) : null}

            <ResponsiveAlertDialogFooter className="flex-col-reverse">
              <ResponsiveAlertDialogCancel disabled={isPending}>
                Cancel
              </ResponsiveAlertDialogCancel>

              <ResponsiveAlertDialogAction
                disabled={isPending}
                onClick={handleRemove}
              >
                {isPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <ImagesIcon />
                )}
                Remove from gallery
              </ResponsiveAlertDialogAction>
            </ResponsiveAlertDialogFooter>
          </ResponsiveAlertDialogContent>
        </ResponsiveAlertDialog>
      </>
    );
  }

  return (
    <Button
      type="button"
      variant="secondary"
      disabled={isPending}
      onClick={handleAdd}
      aria-label={`Add ${selectedPhotoCount} selected ${noun} to the gallery`}
    >
      {isPending ? <Loader2Icon className="animate-spin" /> : <ImagesIcon />}
      Add to gallery
    </Button>
  );
};

export default GalleryPhotos;
