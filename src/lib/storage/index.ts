"server only";

import { FilenSDK } from "@filen/sdk";

import { config } from "@/lib/config";

/*
 * Filen.io client
 */

let filenInstance: FilenSDK | null = null;
const getFilenClient = async (): Promise<FilenSDK> => {
  if (filenInstance) {
    return filenInstance;
  }

  const filen = new FilenSDK({ metadataCache: true, connectToSocket: true });

  await filen.login({
    email: config.filen.email,
    password: config.filen.password,
  });

  filenInstance = filen;
  return filen;
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
  if (fileBody instanceof Buffer) {
    buffer = fileBody;
  } else if (fileBody instanceof Blob) {
    buffer = Buffer.from(await fileBody.arrayBuffer());
  } else {
    buffer = Buffer.from(fileBody, "utf-8");
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
