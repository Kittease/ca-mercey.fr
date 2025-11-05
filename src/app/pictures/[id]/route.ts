import { lookup } from "mime-types";

import { readFile } from "@/lib/storage";

export async function GET(
  request: Request,
  { params: { id } }: { params: { id: string } }
): Promise<Response> {
  try {
    const buffer = await readFile(`/Photography/pictures/${id}`);

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
