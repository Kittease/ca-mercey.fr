import {
  getAllPhotos,
  getPhotoPath,
} from "@/domain/photography/services/photos";
import { readFile } from "@/lib/storage";

export async function generateStaticParams() {
  const photos = await getAllPhotos();
  return photos.map(({ id }) => ({ id }));
}

export async function GET(
  _request: Request,
  context: RouteContext<"/photos/[id]">,
): Promise<Response> {
  const { id } = await context.params;

  try {
    const buffer = await readFile(getPhotoPath(id));
    const body = new Uint8Array(buffer);

    return new Response(body, {
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Length": buffer.byteLength.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Image not found", { status: 404 });
  }
}
