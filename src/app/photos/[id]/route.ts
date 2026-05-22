import { lookup } from "mime-types";

import {
  getAllPhotos,
  getPhotoPath,
  getStorageKeyFromId,
} from "@/domain/photography/services/photos";
import { readFile } from "@/lib/storage";

export async function generateStaticParams() {
  const pictures = await getAllPhotos();
  return pictures.map(({ id }) => ({ id }));
}

export async function GET(
  _request: Request,
  context: RouteContext<"/photos/[id]">,
): Promise<Response> {
  const { id } = await context.params;

  let storageKey;
  try {
    storageKey = await getStorageKeyFromId(id);
  } catch {
    return new Response("Image not found", { status: 404 });
  }

  try {
    const buffer = await readFile(getPhotoPath(storageKey));
    const body = new Uint8Array(buffer);

    return new Response(body, {
      headers: {
        "Content-Type": lookup(storageKey) || "application/octet-stream",
        "Content-Length": buffer.byteLength.toString(),
      },
    });
  } catch {
    return new Response("File not found", { status: 404 });
  }
}
