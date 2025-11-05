import { lookup } from "mime-types";

import { readFile } from "@/lib/storage";

export async function GET(
  request: Request,
  context: RouteContext<"/pictures/thumbnail/[id]">
): Promise<Response> {
  const { id } = await context.params;

  try {
    const buffer = await readFile(`/Photography/thumbnails/${id}`);

    return new Response(buffer, {
      headers: {
        "Content-Type": lookup(id) || "application/octet-stream",
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch {
    return new Response("Image not found", { status: 404 });
  }
}
