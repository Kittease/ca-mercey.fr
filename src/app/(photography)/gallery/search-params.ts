import { parseAsStringLiteral } from "nuqs";

export const galleryOrderDirections = ["asc", "desc"] as const;

export type GalleryOrderDirection = (typeof galleryOrderDirections)[number];

export const galleryDirectionParser = parseAsStringLiteral(
  galleryOrderDirections,
).withDefault("desc");
