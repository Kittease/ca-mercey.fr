import { del } from "@vercel/blob";
import exifr from "exifr";
import path from "node:path";
import sharp from "sharp";
import { z } from "zod";

import { IngestEvent } from "@/app/admin/_components/upload/types";
import {
  createPhoto,
  getPhotoPath,
  getThumbnailPath,
} from "@/domain/photography/services/photos";
import { transformRawPhotoToPhoto } from "@/domain/photography/services/photos/transforms";
import { NewPhotoData } from "@/domain/photography/services/photos/types";
import { getAdminUser } from "@/lib/auth/admin";
import logger from "@/lib/logger";
import { uploadFile } from "@/lib/storage";
import { computeThumbhash } from "@/lib/thumbhash/compute";

export const runtime = "nodejs";
export const maxDuration = 60;

const SUPPORTED_FORMATS = new Set(["jpeg", "png", "webp"]);

const ingestRequestSchema = z.object({
  id: z.uuidv4(),
  blobUrl: z.url(),
});

interface ParsedExif {
  Make?: string;
  Model?: string;
  LensModel?: string;
  LensInfo?: string | unknown;
  FocalLength?: number;
  FNumber?: number;
  ExposureTime?: number;
  ISO?: number;
  DateTimeOriginal?: Date;
  latitude?: number;
  longitude?: number;
}

const mapExif = (
  raw: ParsedExif | undefined,
): Omit<NewPhotoData, "id" | "width" | "height"> => {
  if (!raw) {
    return {};
  }

  const make = typeof raw.Make === "string" ? raw.Make.trim() : "";
  const model = typeof raw.Model === "string" ? raw.Model.trim() : "";
  const camera =
    !make || model.toLowerCase().startsWith(make.toLowerCase())
      ? model || undefined
      : `${make} ${model}`.trim() || undefined;

  const lens =
    typeof raw.LensModel === "string" && raw.LensModel.length > 0
      ? raw.LensModel
      : typeof raw.LensInfo === "string" && raw.LensInfo.length > 0
        ? raw.LensInfo
        : undefined;

  const locationCoordinates =
    Number.isFinite(raw.latitude) && Number.isFinite(raw.longitude)
      ? { latitude: raw.latitude as number, longitude: raw.longitude as number }
      : undefined;

  return {
    camera,
    lens,
    focalLength:
      typeof raw.FocalLength === "number" ? raw.FocalLength : undefined,
    aperture: typeof raw.FNumber === "number" ? raw.FNumber : undefined,
    exposureTime:
      typeof raw.ExposureTime === "number" ? raw.ExposureTime : undefined,
    iso: typeof raw.ISO === "number" ? raw.ISO : undefined,
    captureTime:
      raw.DateTimeOriginal instanceof Date ? raw.DateTimeOriginal : undefined,
    locationCoordinates,
  };
};

export async function POST(request: Request): Promise<Response> {
  if (!(await getAdminUser())) {
    return new Response("Unauthorized", { status: 401 });
  }

  let body: { id: string; blobUrl: string };
  try {
    body = ingestRequestSchema.parse(await request.json());
  } catch (err) {
    return new Response(
      err instanceof Error ? err.message : "Invalid request body",
      { status: 400 },
    );
  }

  const { id, blobUrl } = body;

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder();
      const emit = (event: IngestEvent) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      try {
        emit({ step: "downloading" });

        const blobResponse = await fetch(blobUrl);
        if (!blobResponse.ok) {
          throw new Error(
            `Failed to download blob (status ${blobResponse.status})`,
          );
        }

        const inputBuffer = Buffer.from(await blobResponse.arrayBuffer());

        const metadata = await sharp(inputBuffer).metadata();
        if (!metadata.format || !SUPPORTED_FORMATS.has(metadata.format)) {
          throw new Error(`Unsupported image format: ${metadata.format}`);
        }

        let originalBuffer: Buffer;
        let width: number;
        let height: number;

        if (metadata.format === "jpeg") {
          originalBuffer = inputBuffer;

          if (
            typeof metadata.width !== "number" ||
            typeof metadata.height !== "number"
          ) {
            throw new Error("Image is missing width/height metadata");
          }

          width = metadata.width;
          height = metadata.height;
        } else {
          emit({ step: "converting" });

          const { data, info } = await sharp(inputBuffer)
            .withMetadata()
            .jpeg({ quality: 100, chromaSubsampling: "4:4:4", mozjpeg: false })
            .toBuffer({ resolveWithObject: true });

          originalBuffer = data;

          width = info.width;
          height = info.height;
        }

        emit({ step: "thumbnailing" });

        const thumbnailBuffer = await sharp(inputBuffer)
          .rotate()
          .resize({ height: 480, withoutEnlargement: true })
          .jpeg({ quality: 100 })
          .toBuffer();

        const thumbhash = await computeThumbhash(thumbnailBuffer);

        emit({ step: "parsing-exif" });

        const exif = (await exifr
          .parse(inputBuffer, { gps: true })
          .catch(() => undefined)) as ParsedExif | undefined;

        emit({ step: "uploading-original" });

        const photoPath = getPhotoPath(id);
        await uploadFile({
          directoryPath: path.posix.dirname(photoPath),
          fileName: path.posix.basename(photoPath),
          fileBody: originalBuffer,
        });

        emit({ step: "uploading-thumbnail" });

        const thumbnailPath = getThumbnailPath(id);
        await uploadFile({
          directoryPath: path.posix.dirname(thumbnailPath),
          fileName: path.posix.basename(thumbnailPath),
          fileBody: thumbnailBuffer,
        });

        emit({ step: "saving" });

        const stored = await createPhoto({
          id,
          width,
          height,
          thumbhash,
          ...mapExif(exif),
        });

        emit({ step: "cleanup" });

        try {
          await del(blobUrl);
        } catch (cleanupError) {
          logger.warn(
            { err: cleanupError, blobUrl },
            "[PHOTOS] Failed to delete staging blob",
          );
        }

        const photo = transformRawPhotoToPhoto({
          ...stored,
          locationCoordinates: mapExif(exif).locationCoordinates,
        });

        emit({ step: "done", photo });
      } catch (err) {
        logger.error({ err, id, blobUrl }, "[PHOTOS] Ingest failed");

        emit({
          step: "error",
          message:
            err instanceof Error ? err.message : "Unknown error during ingest",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
