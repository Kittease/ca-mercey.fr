"use client";

import { useQuery } from "@tanstack/react-query";

import { CameraCursorFocusableElement } from "@/app/test/_components/camera-cursor";
import { cn } from "@/lib/tailwind";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutGridOptions,
  useLayoutGrid,
} from "@/app/test/_components/picture-grid/hooks";
import { getAllPictures } from "@/domain/photography/services/pictures";
import { getPictures } from "@/app/test/_components/picture-grid/actions";
import { PublicPicture } from "@/domain/photography/services/pictures/types";

const PictureGrid = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["pictures"],
    queryFn: getPictures,
    enabled: containerWidth > 0,
  });

  const layoutGridOptions = useMemo<LayoutGridOptions>(
    () => ({
      containerWidth,
      targetRowHeight: 320,
      targetRowHeightTolerance: 0.1,
      gridGap: 32,
      fillLastLine: true,
    }),
    [containerWidth]
  );

  const pictures = useMemo<PublicPicture[]>(() => {
    return data ? useLayoutGrid(data, layoutGridOptions) : [];
  }, [data, layoutGridOptions]);

  useEffect(() => {
    const handleResize = () => {
      if (ref.current) {
        setContainerWidth(ref.current.getBoundingClientRect().width);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "flex w-full flex-row flex-wrap gap-(--grid-gap)",
        "has-[*:hover]:[&>.in-view]:blur-xs has-[*:hover]:[&>.in-view]:opacity-50"
      )}
      style={
        { "--grid-gap": `${layoutGridOptions.gridGap}px` } as CSSProperties
      }
    >
      {isPending ? (
        <div>Loading...</div>
      ) : isError ? (
        <div>Error: {error.message}</div>
      ) : (
        pictures.map(({ width, height, thumbnailUrl, name }, index) => (
          <CameraCursorFocusableElement
            key={index}
            className="transition-all duration-300 hover:!blur-none hover:!opacity-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnailUrl}
              alt={name}
              style={{
                width: width,
                height: height,
              }}
            />
          </CameraCursorFocusableElement>
        ))
      )}
    </div>
  );
};

export default PictureGrid;
