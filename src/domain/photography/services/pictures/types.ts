import type { PictureMetadata, Pictures } from "@prisma/client";

export type RawPicture = Pictures & { PictureMetadata: PictureMetadata | null };

export type Picture = {
  id: string;
  name: string;
  publicUrl: string;
  thumbnailUrl: string;
  metadata: PictureMetadata | null;
};

export type PublicPicture = Pick<
  Picture,
  "id" | "name" | "publicUrl" | "thumbnailUrl"
> & {
  width: number;
  height: number;
};
