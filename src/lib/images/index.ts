"server only";

import sharp from "sharp";

import type { Preview } from "@/lib/images/types";

interface OptimizeImageOptions {
  maxDimension?: number;
  quality?: number;
}

export const optimizeImage = async (
  imageBuffer: Buffer,
  options: OptimizeImageOptions = {},
) => {
  const { maxDimension = 2048, quality = 100 } = options;

  return sharp(imageBuffer)
    .rotate()
    .resize({
      width: maxDimension,
      height: maxDimension,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
};

export const createPreviews = async (
  imageBuffer: Buffer,
): Promise<Array<Preview>> => {
  const sharpInstance = sharp(imageBuffer);

  const [previewImage, twitterImage] = await Promise.all([
    sharpInstance.resize({ width: 1200, height: 630 }).toBuffer(),
    sharpInstance.resize({ width: 1200, height: 675 }).toBuffer(),
  ]);

  return [
    { name: "preview", image: previewImage },
    { name: "twitter", image: twitterImage },
  ];
};

export const previewVariantNames = ["preview", "twitter"] as const;

export const getImageDimensions = async (
  imageBuffer: Buffer,
): Promise<{ width: number; height: number }> => {
  const metadata = await sharp(imageBuffer).metadata();

  return {
    width: metadata.width,
    height: metadata.height,
  };
};
