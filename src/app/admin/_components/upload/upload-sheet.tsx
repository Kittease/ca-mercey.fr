"use client";

import {
  CheckIcon,
  ImageIcon,
  Loader2Icon,
  RefreshCwIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/app/_components/ui/button";
import Progress from "@/app/_components/ui/progress";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";
import { cn } from "@/lib/tailwind";

import { useUpload } from "./context";
import { INGEST_STEPS, UploadItem, type IngestStep } from "./types";

const STEP_LABELS: Record<IngestStep, string> = {
  downloading: "Downloading from staging",
  converting: "Converting to JPEG",
  thumbnailing: "Generating thumbnail",
  "parsing-exif": "Reading EXIF metadata",
  "uploading-original": "Uploading original",
  "uploading-thumbnail": "Uploading thumbnail",
  saving: "Saving photo",
  cleanup: "Cleaning up staging",
};

const formatBytes = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

interface UploadRowProps {
  item: UploadItem;
  onRetry: () => void;
  onDismiss: () => void;
}

const VISIBLE_STEP_COUNT = 3;

const UploadRow = ({ item, onRetry, onDismiss }: UploadRowProps) => {
  const currentStepIndex = item.step ? INGEST_STEPS.indexOf(item.step) : 0;

  const visibleStepStart = Math.min(
    Math.max(currentStepIndex - 1, 0),
    Math.max(INGEST_STEPS.length - VISIBLE_STEP_COUNT, 0),
  );

  const visibleSteps = INGEST_STEPS.slice(
    visibleStepStart,
    visibleStepStart + VISIBLE_STEP_COUNT,
  );

  return (
    <li className="flex flex-col gap-y-3 rounded-lg border border-border bg-card p-3">
      <div className="flex items-start gap-3">
        <img
          src={item.previewUrl}
          alt=""
          className="size-14 shrink-0 rounded-md object-cover"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-y-0.5">
          <p className="truncate text-sm font-medium">{item.fileName}</p>

          <p className="text-xs text-muted-foreground">
            {formatBytes(item.fileSize)}
          </p>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <XIcon />
        </Button>
      </div>

      {item.status === "uploading" ? (
        <div className="flex flex-col gap-y-1">
          <Progress value={item.uploadProgress} />

          <p className="text-xs text-muted-foreground">
            Uploading... {Math.round(item.uploadProgress)}%
          </p>
        </div>
      ) : item.status === "error" ? (
        <div className="flex flex-col gap-2">
          <div className="text-xs text-destructive">
            {item.error ?? "Upload failed"}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="self-start"
          >
            <RefreshCwIcon />
            Retry
          </Button>
        </div>
      ) : item.status === "ingesting" ? (
        <ul className="flex flex-col gap-y-1 text-xs">
          {visibleSteps.map((step) => {
            const isCompleted =
              item.completedSteps.includes(step) ||
              (item.step !== null &&
                INGEST_STEPS.indexOf(step) < INGEST_STEPS.indexOf(item.step));

            const isCurrent = item.step === step;

            return (
              <li
                key={step}
                className={cn(
                  "flex flex-row items-center gap-x-2",
                  isCompleted || isCurrent
                    ? "text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {isCompleted ? (
                  <CheckIcon className="size-3.5 text-primary" />
                ) : isCurrent ? (
                  <Loader2Icon className="size-3.5 animate-spin" />
                ) : (
                  <span className="size-3.5 rounded-full border border-muted-foreground/40" />
                )}

                <span>{STEP_LABELS[step]}</span>
              </li>
            );
          })}
        </ul>
      ) : item.status === "done" ? (
        <div className="flex flex-row items-center gap-x-2 text-xs">
          <CheckIcon className="size-3.5 text-success" />

          <span className="text-foreground">Done</span>
        </div>
      ) : null}
    </li>
  );
};

interface UploadSheetTriggerProps {
  className?: string;
}

export const UploadSheetTrigger = ({ className }: UploadSheetTriggerProps) => {
  const { uploads, hasActiveUploads, setSheetOpen } = useUpload();

  const inFlightCount = uploads.filter(
    (item) =>
      item.status === "queued" ||
      item.status === "uploading" ||
      item.status === "ingesting",
  ).length;

  if (uploads.length === 0) {
    return null;
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon-lg"
      aria-label="Show uploads"
      onClick={() => setSheetOpen(true)}
      className={cn("relative", className)}
    >
      <ImageIcon />

      {inFlightCount > 0 && (
        <span
          aria-hidden
          className={cn(
            "absolute top-1 right-1 inline-flex min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground",
            hasActiveUploads ? "animate-pulse" : undefined,
          )}
        >
          {inFlightCount}
        </span>
      )}
    </Button>
  );
};

const UploadSheet = () => {
  const { uploads, retryUpload, dismissUpload, sheetOpen, setSheetOpen } =
    useUpload();

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent side="right" className="flex flex-col gap-0">
        <SheetHeader>
          <SheetTitle>Uploads</SheetTitle>

          <SheetDescription>
            {uploads.length === 0
              ? "No uploads in this session yet."
              : `${uploads.length} ${uploads.length === 1 ? "file" : "files"}`}
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 pb-4">
          {uploads.length === 0 ? (
            <p className="flex h-32 items-center justify-center text-sm text-muted-foreground">
              Drop or pick files to start uploading.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {uploads.map((item) => (
                <UploadRow
                  key={item.id}
                  item={item}
                  onRetry={() => retryUpload(item.id)}
                  onDismiss={() => dismissUpload(item.id)}
                />
              ))}
            </ul>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default UploadSheet;
