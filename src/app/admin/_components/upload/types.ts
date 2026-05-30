import { Photo } from "@/domain/photography/services/photos/types";

export const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export const INGEST_STEPS = [
  "downloading",
  "converting",
  "thumbnailing",
  "parsing-exif",
  "uploading-original",
  "uploading-thumbnail",
  "saving",
  "cleanup",
] as const;

export type IngestStep = (typeof INGEST_STEPS)[number];

export type IngestEvent =
  | { step: IngestStep }
  | { step: "done"; photo: Photo }
  | { step: "error"; message: string };

type UploadStatus = "queued" | "uploading" | "ingesting" | "done" | "error";

export type UploadItem = {
  id: string;
  fileName: string;
  fileSize: number;
  previewUrl: string;
  status: UploadStatus;
  uploadProgress: number;
  step: IngestStep | null;
  completedSteps: IngestStep[];
  error: string | null;
};
