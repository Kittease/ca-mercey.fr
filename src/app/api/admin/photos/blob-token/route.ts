import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

import { getAdminUser } from "@/lib/auth/admin";

const ALLOWED_CONTENT_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(request: Request): Promise<Response> {
  if (!(await getAdminUser())) {
    return new Response("Unauthorized", { status: 401 });
  }

  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ALLOWED_CONTENT_TYPES,
        addRandomSuffix: false,
        allowOverwrite: true,
      }),
    });

    return Response.json(result);
  } catch (err) {
    return new Response(
      err instanceof Error ? err.message : "Failed to issue upload token",
      { status: 400 },
    );
  }
}
