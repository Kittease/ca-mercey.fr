"use server";

import exifr from "exifr";
import { customAlphabet } from "nanoid";

import {
  addPicture,
  deletePicture,
} from "@/domain/photography/services/pictures";
import {
  createPreviews,
  optimizeImage,
  getImageDimensions,
} from "@/lib/images";
import { deleteFile, uploadFile } from "@/lib/storage";

export const uploadPictureAction = async (formData: FormData) => {
  const file = formData.get("file") as File;
  if (!file) {
    throw new Error("No file provided");
  }

  const id = customAlphabet("abcdefghijkmnpqrtwxyz346789", 24)();

  const arrayBuffer = await file.arrayBuffer();
  const originalBuffer = Buffer.from(arrayBuffer);

  const [thumbnailBuffer, previews, dimensions, exif] = await Promise.all([
    optimizeImage(originalBuffer, { maxDimension: 768, quality: 90 }),
    createPreviews(originalBuffer),
    getImageDimensions(originalBuffer),
    exifr.parse(originalBuffer),
  ]).catch();

  await Promise.all([
    uploadFile({
      directoryPath: "/Photography/pictures",
      fileName: `${id}.jpg`,
      fileBody: originalBuffer,
    }),
    uploadFile({
      directoryPath: "/Photography/thumbnails",
      fileName: `${id}.jpg`,
      fileBody: thumbnailBuffer,
    }),
    ...previews.map(({ name, image }) =>
      uploadFile({
        directoryPath: "/Photography/previews",
        fileName: `${id}_${name}.jpg`,
        fileBody: image,
      })
    ),
    addPicture({ id, name: file.name, dimensions, exif }),
  ]);
};

export async function deletePictureAction(id: string): Promise<void> {
  await Promise.all([
    deleteFile(`/Photography/pictures/${id}.jpg`),
    deleteFile(`/Photography/thumbnails/${id}.jpg`),
    deleteFile(`/Photography/previews/${id}_preview.jpg`),
    deleteFile(`/Photography/previews/${id}_twitter.jpg`),
    deletePicture(id),
  ]);
}
