import type {
  Picture,
  RawPicture,
} from "@/domain/photography/services/pictures/types";

export const transformRawPictureToPicture = (
  rawPicture: RawPicture
): Picture => {
  return {
    id: rawPicture.id,
    name: rawPicture.name,
    publicUrl: `/pictures/${rawPicture.id}.jpg`,
    thumbnailUrl: `/pictures/thumbnail/${rawPicture.id}.jpg`,
    metadata: rawPicture.PictureMetadata,
  };
};
