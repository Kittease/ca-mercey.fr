"use client";

import { formatDuration } from "date-fns";
import { XIcon } from "lucide-react";
import { customAlphabet } from "nanoid";
import { useCallback, useEffect, useRef, useState } from "react";

import Input from "@/app/_components/ui/input";
import Label from "@/app/_components/ui/label";
import Progress from "@/app/_components/ui/progress";
import { uploadPictureAction } from "@/app/admin/actions";

import type { ChangeEvent } from "react";

type SelectedFile = {
  id: string;
  file: File;
  previewUrl: string;
};

const generateLocalId = customAlphabet("abcdefghijkmnpqrtwxyz346789", 8);

interface UploadFormProps {
  onOptimisticAdd?: (tempName: string, url: string) => void;
  onUploadComplete?: () => void;
  onPendingChange?: (pending: boolean) => void;
}

const UploadForm = ({
  onOptimisticAdd,
  onUploadComplete,
  onPendingChange,
}: UploadFormProps) => {
  const [selected, setSelected] = useState<Array<SelectedFile>>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [pending, setPending] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [remaining, setRemaining] = useState(0);

  const timerRef = useRef<number | null>(null);
  const remainingCountdownRef = useRef<number | null>(null);

  const syncInputFiles = useCallback((files: Array<File>) => {
    if (!inputRef.current) {
      return;
    }
    const dataTransfer = new DataTransfer();
    files.forEach((f) => dataTransfer.items.add(f));
    inputRef.current.files = dataTransfer.files;
  }, []);

  const onFilesSelected = (event: ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files ? Array.from(event.target.files) : [];
    const newSelected = fileList.map((file) => ({
      id: generateLocalId(),
      file,
      previewUrl: URL.createObjectURL(file),
    }));

    const combined = [...selected, ...newSelected];
    setSelected(combined);
    syncInputFiles(combined.map((s) => s.file));
  };

  const removeSelected = (id: string) => {
    const toRemove = selected.find((s) => s.id === id);
    const next = selected.filter((s) => s.id !== id);
    setSelected(next);
    syncInputFiles(next.map((s) => s.file));
    if (toRemove) {
      URL.revokeObjectURL(toRemove.previewUrl);
    }
  };

  useEffect(() => {
    return () => {
      selected.forEach((s) => URL.revokeObjectURL(s.previewUrl));
    };
  }, [selected]);

  const uploadSelected = async () => {
    if (selected.length === 0 || pending) {
      return;
    }

    setPending(true);
    onPendingChange?.(true);
    setCompleted(0);
    setElapsed(0);
    setRemaining(selected.length * 10);

    const start = Date.now();

    if (timerRef.current) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setElapsed(Math.round((Date.now() - start) / 1000));
    }, 100);

    if (remainingCountdownRef.current) {
      window.clearInterval(remainingCountdownRef.current);
    }
    remainingCountdownRef.current = window.setInterval(() => {
      setRemaining((prev) => (prev > 0 ? Math.max(prev - 1, 0) : 0));
    }, 1000);

    try {
      let avgPerFileMs = 0;
      for (let i = 0; i < selected.length; i += 1) {
        const item = selected[i];
        const fileStart = Date.now();
        onOptimisticAdd?.(item.id, item.previewUrl);
        // No per-file progress available with server actions; we emulate based on elapsed time
        const formData = new FormData();
        formData.append("file", item.file);
        await uploadPictureAction(formData);

        // Update remaining time only between files
        const fileTime = Date.now() - fileStart;
        setCompleted((prev) => prev + 1);
        avgPerFileMs =
          completed === 1
            ? fileTime
            : Math.round(
                (avgPerFileMs * (completed - 1) + fileTime) / completed
              );
        const remainingFiles = selected.length - completed;
        setRemaining(
          remainingFiles > 0 ? (avgPerFileMs / 1000) * remainingFiles : 0
        );
      }
      setSelected([]);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } finally {
      setPending(false);
      onPendingChange?.(false);
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
      }
      timerRef.current = null;
      if (remainingCountdownRef.current) {
        window.clearInterval(remainingCountdownRef.current);
      }
      remainingCountdownRef.current = null;
    }
    onUploadComplete?.();
  };

  const progress = Math.round((completed / selected.length) * 100);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="files">Upload images</Label>

        <Input
          ref={inputRef}
          id="files"
          name="files"
          type="file"
          accept="image/*"
          multiple
          required
          onChange={onFilesSelected}
        />
      </div>

      {selected.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {selected.map((item) => (
            <div
              key={item.id}
              className="relative overflow-hidden rounded-md border"
            >
              {
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.previewUrl}
                  alt="preview"
                  className="aspect-square h-auto w-full object-cover"
                />
              }

              <button
                type="button"
                onClick={() => removeSelected(item.id)}
                className="absolute top-1 right-1 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white shadow-xs transition-colors hover:bg-black/85 dark:bg-white/70 dark:text-black dark:hover:bg-white/85"
                aria-label="Remove"
                title="Remove"
              >
                <XIcon width={16} height={16} />
              </button>
            </div>
          ))}
        </div>
      ) : null}

      <div className="space-y-2">
        {pending ? (
          <div className="space-y-1">
            <Progress value={progress} />

            <div className="text-xs text-stone-600 dark:text-stone-300">
              {`${progress}% (${completed}/${
                selected.length
              }) • ${formatDuration({
                seconds: elapsed,
              })} elapsed • ${formatDuration({
                seconds: remaining,
              })} remaining`}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={uploadSelected}
          disabled={pending ? true : selected.length === 0 ? true : false}
          className="inline-flex items-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors hover:bg-black/90 focus-visible:ring-2 focus-visible:ring-black focus-visible:outline-hidden disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-white/90 dark:focus-visible:ring-white"
        >
          {pending ? "Uploading..." : "Upload"}
        </button>
      </div>
    </div>
  );
};

export default UploadForm;
