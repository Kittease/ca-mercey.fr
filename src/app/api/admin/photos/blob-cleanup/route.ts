import { del, list } from "@vercel/blob";

import { config } from "@/lib/config";
import logger from "@/lib/logger";

const STALE_AFTER_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request): Promise<Response> {
  const authorization = request.headers.get("authorization");
  if (authorization !== `Bearer ${config.cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const cutoff = Date.now() - STALE_AFTER_MS;
  let cursor: string | undefined;
  let scanned = 0;
  let deleted = 0;

  do {
    const page = await list({ prefix: "uploads/", cursor });
    scanned += page.blobs.length;

    const staleUrls = page.blobs
      .filter((blob) => blob.uploadedAt.getTime() < cutoff)
      .map((blob) => blob.url);

    if (staleUrls.length > 0) {
      await del(staleUrls);
      deleted += staleUrls.length;
    }

    cursor = page.cursor;
  } while (cursor);

  logger.info(
    "[PHOTOS] Blob cleanup completed: scanned ${inspected} blobs, deleted ${deleted}",
  );

  return Response.json({ scanned, deleted });
}
