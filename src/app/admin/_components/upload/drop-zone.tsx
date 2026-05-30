"use client";

import { ImageIcon } from "lucide-react";
import { DragEvent, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/tailwind";

import { useUpload } from "./context";

const containsFiles = (event: DragEvent | globalThis.DragEvent) => {
  return Array.from(event.dataTransfer?.types ?? []).includes("Files");
};

const DropZone = () => {
  const { addFiles } = useUpload();

  const depthRef = useRef(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleEnter = (event: globalThis.DragEvent) => {
      if (!containsFiles(event)) {
        return;
      }

      event.preventDefault();
      depthRef.current += 1;

      setIsActive(true);
    };

    const handleOver = (event: globalThis.DragEvent) => {
      if (!containsFiles(event)) {
        return;
      }

      event.preventDefault();

      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "copy";
      }
    };

    const handleLeave = (event: globalThis.DragEvent) => {
      if (!containsFiles(event)) {
        return;
      }

      event.preventDefault();
      depthRef.current = Math.max(0, depthRef.current - 1);

      if (depthRef.current === 0) {
        setIsActive(false);
      }
    };

    const handleDrop = (event: globalThis.DragEvent) => {
      if (!containsFiles(event)) {
        return;
      }

      event.preventDefault();
      depthRef.current = 0;

      setIsActive(false);

      if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        addFiles(event.dataTransfer.files);
      }
    };

    window.addEventListener("dragenter", handleEnter);
    window.addEventListener("dragover", handleOver);
    window.addEventListener("dragleave", handleLeave);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleEnter);
      window.removeEventListener("dragover", handleOver);
      window.removeEventListener("dragleave", handleLeave);
      window.removeEventListener("drop", handleDrop);
    };
  }, [addFiles]);

  return (
    <div
      aria-hidden={!isActive}
      className={cn(
        "pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-150",
        isActive ? "opacity-100" : "opacity-0",
      )}
    >
      <div className="flex flex-col items-center gap-y-3 rounded-2xl border-2 border-dashed border-primary/60 bg-card/80 px-12 py-10 text-center shadow-lg">
        <ImageIcon size={40} className="size-10 text-primary" />

        <p className="text-lg font-medium">Drop to upload photos</p>

        <p className="text-sm text-muted-foreground">
          JPEG, PNG or WebP — multiple files supported
        </p>
      </div>
    </div>
  );
};

export default DropZone;
