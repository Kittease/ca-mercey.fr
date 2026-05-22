import "server-only";

import { FilenSDK } from "@filen/sdk";

import { config } from "@/lib/config";

/*
 * Filen.io client
 */

let filenClientPromise: Promise<FilenSDK> | null = null;
const getFilenClient = (): Promise<FilenSDK> => {
  if (filenClientPromise) {
    return filenClientPromise;
  }

  const filen = new FilenSDK({ metadataCache: true, connectToSocket: true });

  filenClientPromise = filen
    .login({
      email: config.filen.email,
      password: config.filen.password,
    })
    .then(() => filen)
    .catch((err: unknown) => {
      filenClientPromise = null;
      throw err;
    });

  return filenClientPromise;
};

/*
 * Storage methods
 */

interface UploadFileOptions {
  directoryPath: string;
  fileName: string;
  fileBody: Blob | Buffer | string;
}

export const uploadFile = async ({
  directoryPath,
  fileName,
  fileBody,
}: UploadFileOptions) => {
  const client = await getFilenClient();

  let buffer: Buffer;
  if (typeof fileBody === "string") {
    buffer = Buffer.from(fileBody, "utf-8");
  } else if (fileBody instanceof Blob) {
    buffer = Buffer.from(await fileBody.arrayBuffer());
  } else {
    buffer = fileBody;
  }

  try {
    await client.fs().mkdir({ path: directoryPath });
  } catch {
    /* empty */
  }

  await client.fs().writeFile({
    path: `${directoryPath}/${fileName}`,
    content: buffer,
  });
};

export const readFile = async (filePath: string) => {
  "use cache";

  const client = await getFilenClient();

  return client.fs().readFile({ path: filePath });
};

export const deleteFile = async (filePath: string) => {
  const client = await getFilenClient();

  try {
    await client.fs().unlink({ path: filePath });
  } catch {
    /* empty */
  }
};
