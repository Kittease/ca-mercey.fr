import createJustifiedLayout from "justified-layout";

import type {
  Picture,
  PublicPicture,
} from "@/domain/photography/services/pictures/types";

export type LayoutGridOptions = {
  containerWidth: number;
  targetRowHeight: number;
  targetRowHeightTolerance: number;
  gridGap: number | { horizontal: number; vertical: number };
  fillLastLine?: boolean;
};

export const useLayoutGrid = (
  pictures: Picture[],
  options: LayoutGridOptions
): PublicPicture[] => {
  const layout = createJustifiedLayout(
    pictures.map((picture) => ({
      width: picture.metadata?.width ?? 0,
      height: picture.metadata?.height ?? 0,
    })),
    {
      containerWidth: options.containerWidth,
      targetRowHeight: options.targetRowHeight,
      targetRowHeightTolerance: options.targetRowHeightTolerance,
      boxSpacing: options.gridGap,
      widowLayoutStyle: options.fillLastLine ? "justify" : "left",
    }
  );

  return pictures.map((picture, index) => ({
    id: picture.id,
    name: picture.name,
    publicUrl: picture.publicUrl,
    thumbnailUrl: picture.thumbnailUrl,
    width: layout.boxes[index].width,
    height: layout.boxes[index].height,
  }));
};
