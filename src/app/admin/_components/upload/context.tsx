"use client";

import { upload } from "@vercel/blob/client";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

import { Photo } from "@/domain/photography/services/photos/types";

import { consumeIngestStream } from "./pipeline";
import { ALLOWED_MIME_TYPES, UploadItem } from "./types";

const CONCURRENCY = 2;

interface UploadContextValue {
  photos: Photo[];
  uploads: UploadItem[];
  hasActiveUploads: boolean;
  sheetOpen: boolean;
  setSheetOpen: (open: boolean) => void;
  addFiles: (files: FileList | File[]) => void;
  retryUpload: (uploadId: string) => void;
  dismissUpload: (uploadId: string) => void;
  removePhotos: (ids: string[]) => void;
}

const UploadContext = createContext<UploadContextValue | null>(null);

const generateId = () => {
  if (typeof crypto === "undefined" || !("randomUUID" in crypto)) {
    throw new Error("crypto.randomUUID is not available");
  }

  return crypto.randomUUID();
};

interface UploadProviderProps {
  initialPhotos: Photo[];
}

export const UploadProvider = ({
  initialPhotos,
  children,
}: PropsWithChildren<UploadProviderProps>) => {
  const [photos, setPhotos] = useState<Photo[]>(initialPhotos);
  const [uploads, setUploads] = useState<UploadItem[]>([]);

  const [sheetOpen, setSheetOpenState] = useState(false);

  const filesRef = useRef(new Map<string, File>());
  const inFlightRef = useRef(0);
  const queueRef = useRef<string[]>([]);
  const pumpRef = useRef<() => void>(() => undefined);

  const updateUpload = useCallback((id: string, patch: Partial<UploadItem>) => {
    setUploads((current) =>
      current.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  }, []);

  const runUpload = useCallback(
    async (uploadId: string) => {
      const file = filesRef.current.get(uploadId);
      if (!file) {
        return;
      }

      updateUpload(uploadId, {
        status: "uploading",
        uploadProgress: 0,
        step: null,
        completedSteps: [],
        error: null,
      });

      try {
        const blob = await upload(
          `uploads/${uploadId}.${file.type.split("/")[1] ?? "bin"}`,
          file,
          {
            access: "public",
            handleUploadUrl: "/api/admin/photos/blob-token",
            contentType: file.type,
            onUploadProgress: ({ percentage }) => {
              updateUpload(uploadId, { uploadProgress: percentage });
            },
          },
        );

        updateUpload(uploadId, { status: "ingesting", uploadProgress: 100 });

        const response = await fetch("/api/admin/photos/ingest", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: uploadId, blobUrl: blob.url }),
        });

        if (!response.ok) {
          throw new Error(
            `Ingest failed: ${response.status} ${response.statusText}`,
          );
        }

        let finalPhoto: Photo | null = null;
        let streamError: string | null = null;

        await consumeIngestStream(response, (event) => {
          if (event.step === "done") {
            finalPhoto = event.photo;
            return;
          }

          if (event.step === "error") {
            streamError = event.message;
            return;
          }

          setUploads((current) =>
            current.map((item) => {
              if (item.id !== uploadId) {
                return item;
              }

              return {
                ...item,
                step: event.step,
                completedSteps: item.step
                  ? [...item.completedSteps, item.step]
                  : item.completedSteps,
              };
            }),
          );
        });

        if (streamError !== null) {
          throw new Error(streamError);
        }

        if (finalPhoto === null) {
          throw new Error("Ingest finished without a photo");
        }

        const photo: Photo = finalPhoto;

        setPhotos((current) => [photo, ...current]);

        updateUpload(uploadId, { status: "done", step: null });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Unknown upload error";

        updateUpload(uploadId, { status: "error", error: message });

        toast.error(`Failed to upload ${file.name}: ${message}`);
      }
    },
    [updateUpload],
  );

  useEffect(() => {
    pumpRef.current = () => {
      while (inFlightRef.current < CONCURRENCY && queueRef.current.length > 0) {
        const nextId = queueRef.current.shift();
        if (!nextId) {
          return;
        }

        inFlightRef.current += 1;

        runUpload(nextId).finally(() => {
          inFlightRef.current -= 1;
          pumpRef.current();
        });
      }
    };
  }, [runUpload]);

  const enqueue = useCallback((uploadId: string) => {
    queueRef.current.push(uploadId);
    pumpRef.current();
  }, []);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const incoming = Array.from(files);
      const accepted: UploadItem[] = [];
      let rejected = 0;

      for (const file of incoming) {
        if (!ALLOWED_MIME_TYPES.has(file.type)) {
          rejected += 1;
          continue;
        }

        const uploadId = generateId();

        filesRef.current.set(uploadId, file);

        accepted.push({
          id: uploadId,
          fileName: file.name,
          fileSize: file.size,
          previewUrl: URL.createObjectURL(file),
          status: "queued",
          uploadProgress: 0,
          step: null,
          completedSteps: [],
          error: null,
        });
      }

      if (rejected > 0) {
        toast.error(
          rejected === 1
            ? "1 file was skipped — only JPEG, PNG and WebP are supported."
            : `${rejected} files were skipped — only JPEG, PNG and WebP are supported.`,
        );
      }

      if (accepted.length === 0) {
        return;
      }

      setUploads((current) => [...accepted, ...current]);

      setSheetOpenState(true);

      for (const item of accepted) {
        enqueue(item.id);
      }
    },
    [enqueue],
  );

  const retryUpload = useCallback(
    (uploadId: string) => {
      if (!filesRef.current.has(uploadId)) {
        return;
      }

      updateUpload(uploadId, {
        status: "queued",
        uploadProgress: 0,
        step: null,
        completedSteps: [],
        error: null,
      });

      enqueue(uploadId);
    },
    [enqueue, updateUpload],
  );

  const removePhotos = useCallback((ids: string[]) => {
    const removed = new Set(ids);

    setPhotos((current) => current.filter((photo) => !removed.has(photo.id)));
  }, []);

  const setSheetOpen = useCallback(
    (open: boolean) => {
      setSheetOpenState(open);

      if (
        open ||
        uploads.length === 0 ||
        uploads.some((item) => item.status !== "done")
      ) {
        return;
      }

      for (const item of uploads) {
        URL.revokeObjectURL(item.previewUrl);
      }

      filesRef.current.clear();

      setUploads([]);
    },
    [uploads],
  );

  const dismissUpload = useCallback((uploadId: string) => {
    setUploads((current) => {
      const item = current.find((entry) => entry.id === uploadId);

      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }

      return current.filter((entry) => entry.id !== uploadId);
    });

    filesRef.current.delete(uploadId);
  }, []);

  useEffect(() => {
    const filesMap = filesRef.current;

    return () => {
      for (const item of uploads) {
        URL.revokeObjectURL(item.previewUrl);
      }

      filesMap.clear();
    };
    // Intentionally only on unmount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasActiveUploads = useMemo(
    () =>
      uploads.some(
        (item) =>
          item.status === "queued" ||
          item.status === "uploading" ||
          item.status === "ingesting",
      ),
    [uploads],
  );

  const value = useMemo<UploadContextValue>(
    () => ({
      photos,
      uploads,
      hasActiveUploads,
      sheetOpen,
      setSheetOpen,
      addFiles,
      retryUpload,
      dismissUpload,
      removePhotos,
    }),
    [
      addFiles,
      dismissUpload,
      hasActiveUploads,
      photos,
      removePhotos,
      retryUpload,
      setSheetOpen,
      sheetOpen,
      uploads,
    ],
  );

  return (
    <UploadContext.Provider value={value}>{children}</UploadContext.Provider>
  );
};

export const useUpload = () => {
  const context = useContext(UploadContext);

  if (!context) {
    throw new Error("useUpload must be used within an UploadProvider.");
  }

  return context;
};
