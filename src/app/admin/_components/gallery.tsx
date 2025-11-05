"use client";

import { CheckIcon } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/tailwind";

import PictureDetailsPanel from "@/app/_components/business/photography/picture-details-panel";
import Button from "@/app/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog";
import GalleryJustifiedLayout from "@/app/admin/_components/gallery-justified-layout";
import UploadPanel from "@/app/admin/_components/upload-panel";
import { deletePictureAction } from "@/app/admin/actions";

import type { MouseEvent } from "react";

import type { Picture } from "@/domain/photography/services/pictures/types";

interface GalleryProps {
  pictures: Picture[];
}

const Gallery = ({ pictures: initialPictures }: GalleryProps) => {
  const [pictures, setPictures] = useState<Array<Picture>>(initialPictures);

  const [preview, setPreview] = useState<Picture | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [lastClick, setLastClick] = useState<{
    index: number;
    action: "select" | "unselect";
  } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const deleteSelected = async () => {
    if (selected.size === 0) {
      return;
    }

    await Promise.all(Array.from(selected).map(deletePictureAction));
    setPictures((prev) => prev.filter((p) => !selected.has(p.id)));
    setSelected(new Set());
  };

  const onCheckboxClick = (
    event: MouseEvent<HTMLButtonElement>,
    id: string
  ) => {
    event.stopPropagation();

    const index = pictures.findIndex((p) => p.id === id);

    const isSelected = selected.has(id);

    if (event.shiftKey) {
      if (isSelected) {
        // Shift+click on selected: unselect it
        setSelected((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });

        setLastClick({ index, action: "unselect" });
        return;
      }

      // Shift+click on unselected
      if (!lastClick || lastClick.action === "unselect") {
        // Previous action was unselect (or none): only add current
        setSelected((prev) => new Set(prev).add(id));
        setLastClick({ index, action: "select" });
        return;
      }

      // Previous action was select: select range between last and current (inclusive)
      const start = Math.min(lastClick.index, index);
      const end = Math.max(lastClick.index, index);
      setSelected((prev) => {
        const next = new Set(prev);
        for (let i = start; i <= end; i += 1) {
          next.add(pictures[i].id);
        }
        return next;
      });
      setLastClick({ index, action: "select" });
      return;
    }

    // Plain click: toggle only this item
    if (isSelected) {
      setSelected((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      setLastClick({ index, action: "unselect" });
    } else {
      setSelected((prev) => new Set(prev).add(id));
      setLastClick({ index, action: "select" });
    }
  };

  return (
    <div className="mx-auto w-full max-w-9/10 p-6">
      <div className="sticky top-0 z-40 mb-4 flex items-center justify-between border-b border-stone-400 bg-stone-950 py-3">
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">
            {`${pictures.length} pictures`}
          </h1>

          {selected.size > 0 ? (
            <p className="text-sm">{selected.size} selected</p>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {selected.size > 0 ? (
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setSelected(new Set())}
                variant="secondary"
              >
                Unselect all
              </Button>

              <Button
                onClick={() => setConfirmOpen(true)}
                variant="destructive"
              >
                Delete selected ({selected.size})
              </Button>
            </div>
          ) : null}

          <UploadPanel />
        </div>
      </div>

      <GalleryJustifiedLayout
        pictures={pictures}
        PictureComponent={(picture, width, height) => (
          <div
            data-selected={selected.has(picture.id)}
            className={cn(
              "[--border-width:1px] [--outer-radius:var(--radius-md)]",
              "[--inner-radius:calc(var(--outer-radius)-var(--border-width))]",
              "group relative rounded-(--outer-radius) border-(length:--border-width) border-black/20",
              "after:pointer-events-none after:absolute after:inset-x-0 after:top-0 after:h-1/5 after:rounded-t-(--inner-radius) after:bg-gradient-to-b after:from-black after:to-transparent",
              "after:transition-all after:duration-150",
              "after:opacity-0 hover:after:opacity-20 data-[selected=true]:after:opacity-0"
            )}
            style={{ width, height }}
            suppressHydrationWarning
          >
            <button
              type="button"
              className={cn(
                "absolute overflow-hidden",
                "transition-all duration-150",
                "inset-0 group-data-[selected=true]:inset-3",
                "rounded-(--inner-radius) group-data-[selected=true]:rounded-xs"
              )}
              onClick={() => {
                setPreview(picture);
                setPreviewOpen(true);
              }}
            >
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={picture.thumbnailUrl}
                  alt={picture.name}
                  className="h-full w-full object-cover"
                />
              }
            </button>

            <button
              type="button"
              aria-label="Select"
              onClick={(e) => onCheckboxClick(e, picture.id)}
              className={cn(
                "absolute top-2 left-2 flex size-4 items-center justify-center rounded-full",
                "transition-all duration-150",
                "bg-white group-data-[selected=true]:bg-blue-600",
                "text-black group-data-[selected=true]:text-white",
                "opacity-0 group-hover:opacity-50 group-data-[selected=true]:opacity-100 hover:opacity-100"
              )}
            >
              <CheckIcon size={12} className="size-3 stroke-3" />
            </button>
          </div>
        )}
      />

      {preview ? (
        <PictureDetailsPanel
          picture={preview}
          isOpen={previewOpen}
          handleOpen={setPreviewOpen}
        />
      ) : null}

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>

            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              selected files.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button onClick={() => setConfirmOpen(false)} variant="secondary">
              Cancel
            </Button>

            <Button
              onClick={async () => {
                await deleteSelected();
                setConfirmOpen(false);
              }}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Gallery;
