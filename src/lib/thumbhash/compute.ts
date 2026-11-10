import "server-only";

import sharp from "sharp";
import { rgbaToThumbHash } from "thumbhash";

export const computeThumbhash = async (buffer: Buffer): Promise<string> => {
  const { data, info } = await sharp(buffer)
    .resize(100, 100, { fit: "inside" })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const hash = rgbaToThumbHash(info.width, info.height, data);

  return Buffer.from(hash).toString("base64");
};
