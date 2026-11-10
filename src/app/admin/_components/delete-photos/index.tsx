"use client";

import { Loader2Icon, Trash2Icon } from "lucide-react";
import { useState, useTransition } from "react";
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
import { deletePhotos } from "@/app/admin/_components/delete-photos/actions";
import { usePhotoSelection } from "@/app/admin/_components/photo-wrapper/select/context";
import { useUpload } from "@/app/admin/_components/upload/context";

const pluralize = (count: number, word: string) =>
  count === 1 ? word : `${word}s`;

const DeletePhotos = () => {
  const { selectedPhotos, selectedPhotoCount, clearSelection, togglePhoto } =
    usePhotoSelection();
  const { removePhotos } = useUpload();

  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleOpenChange = (next: boolean) => {
    if (isPending) {
      return;
    }

    if (!next) {
      setError(null);
    }

    setOpen(next);
  };

  const handleTriggerClick = () => {
    setError(null);
    setOpen(true);
  };

  const handleConfirm = () => {
    const ids = selectedPhotos.map(({ id }) => id);

    setError(null);

    startTransition(async () => {
      try {
        const { deletedIds, failedIds } = await deletePhotos(ids);

        removePhotos(deletedIds);

        if (failedIds.length === 0) {
          clearSelection();

          setOpen(false);

          toast.success(
            `${deletedIds.length} ${pluralize(deletedIds.length, "photo")} deleted`,
          );

          return;
        }

        for (const id of deletedIds) {
          togglePhoto({ id });
        }

        setError(
          `Couldn't delete ${failedIds.length} ${pluralize(failedIds.length, "photo")}. Please try again.`,
        );

        toast.error(`${deletedIds.length} deleted, ${failedIds.length} failed`);
      } catch {
        setError("Something went wrong while deleting. Please try again.");

        toast.error("Failed to delete photos");
      }
    });
  };

  const noun = pluralize(selectedPhotoCount, "photo");

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        onClick={handleTriggerClick}
        aria-label={`Delete ${selectedPhotoCount} selected ${noun}`}
      >
        <Trash2Icon />
        Delete
      </Button>

      <ResponsiveAlertDialog open={open} onOpenChange={handleOpenChange}>
        <ResponsiveAlertDialogContent>
          <ResponsiveAlertDialogHeader>
            <ResponsiveAlertDialogTitle>
              Delete {selectedPhotoCount} {noun}?
            </ResponsiveAlertDialogTitle>

            <ResponsiveAlertDialogDescription>
              This permanently deletes the selected {noun}. This can&apos;t be
              undone.
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
              variant="destructive"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <Trash2Icon />
              )}
              Delete
            </ResponsiveAlertDialogAction>
          </ResponsiveAlertDialogFooter>
        </ResponsiveAlertDialogContent>
      </ResponsiveAlertDialog>
    </>
  );
};

export default DeletePhotos;
