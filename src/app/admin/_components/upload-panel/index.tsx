"use client";

import { useState } from "react";

import Button from "@/app/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet";
import UploadForm from "@/app/admin/_components/upload-form";

import type { Dispatch, SetStateAction } from "react";

import type { Picture } from "@/domain/photography/services/pictures/types";

interface UploadPanelProps {
  updatePictures?: Dispatch<SetStateAction<Picture[]>>;
}

const UploadPanel = ({ updatePictures }: UploadPanelProps) => {
  const [open, setOpen] = useState(false);

  const [busy, setBusy] = useState(false);

  const onOptimisticAdd = (tempName: string, url: string) => {
    // Create a temporary picture object for optimistic updates
    const tempPicture: Picture = {
      id: tempName,
      name: tempName,
      publicUrl: url,
      thumbnailUrl: url,
      metadata: null,
    };
    updatePictures?.((prev) => [tempPicture, ...prev]);
  };

  const handleOpenChange = (value: boolean) => {
    if (!busy) {
      setOpen(value);
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger
        render={(props) => <Button {...props}>Add pictures</Button>}
      />

      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Upload pictures</SheetTitle>
        </SheetHeader>

        <div className="mt-4">
          <UploadForm
            onOptimisticAdd={onOptimisticAdd}
            onUploadComplete={() => setOpen(false)}
            onPendingChange={setBusy}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UploadPanel;
