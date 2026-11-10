"use client";

import justifiedLayout from "justified-layout";
import {
  ComponentType,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ProgressiveImage from "@/app/_components/ui/progressive-image";

type Photo = {
  id: string;
  src: string;
  thumbnailSrc: string;
  placeholderUrl: string | null;
  width: number;
  height: number;
};

interface PhotoLayoutProps {
  photos: Photo[];
  PhotoWrapper?: ComponentType<PropsWithChildren<{ photo: Photo }>>;
  disableTopPadding?: boolean;
}

type JustifiedPhoto = {
  id: string;
  src: string;
  thumbnailSrc: string;
  placeholderUrl: string | null;
  top: number;
  left: number;
  width: number;
  height: number;
};

type Layout =
  | { mode: "initializing" }
  | { mode: "justified"; photos: JustifiedPhoto[]; height: number };

const getTargetRowHeightRatio = (width: number) => {
  if (width <= 640) {
    return 0.6;
  }

  if (width >= 1024) {
    return 0.2;
  }

  return 0.6 - 0.4 * ((width - 640) / 384);
};

const PhotoLayout = ({
  photos,
  PhotoWrapper = ({ children }) => children,
  disableTopPadding = false,
}: PhotoLayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) {
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) {
        return;
      }

      setContainerWidth(entry.contentRect.width);
    });

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, []);

  const layout = useMemo((): Layout => {
    if (containerWidth === null) {
      return { mode: "initializing" };
    }

    const gap = Math.round(containerWidth * 0.01);

    const result = justifiedLayout(
      photos.map(({ width, height }) => ({ width, height })),
      {
        containerWidth,
        boxSpacing: gap,
        containerPadding: {
          top: disableTopPadding ? 0 : gap,
          right: gap,
          bottom: gap,
          left: gap,
        },
        targetRowHeight: Math.round(
          containerWidth * getTargetRowHeightRatio(containerWidth),
        ),
        targetRowHeightTolerance: 0.25,
      },
    );

    return {
      mode: "justified",
      height: result.containerHeight,
      photos: result.boxes.flatMap(({ top, left, width, height }, i) => {
        const photo = photos.at(i);

        if (!photo) {
          return [];
        }

        return {
          id: photo.id,
          src: photo.src,
          thumbnailSrc: photo.thumbnailSrc,
          placeholderUrl: photo.placeholderUrl,
          top,
          left,
          width,
          height,
        };
      }),
    };
  }, [containerWidth, photos, disableTopPadding]);

  if (layout.mode === "initializing") {
    return <div ref={containerRef} className="w-full" />;
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${layout.height}px` }}
    >
      {layout.photos.map((photo) => (
        <div
          key={photo.id}
          className="absolute"
          style={{
            top: `${photo.top}px`,
            left: `${photo.left}px`,
            width: `${photo.width}px`,
            height: `${photo.height}px`,
          }}
        >
          <PhotoWrapper photo={photo}>
            <ProgressiveImage
              placeholder={photo.placeholderUrl}
              src={photo.thumbnailSrc}
            />
          </PhotoWrapper>
        </div>
      ))}
    </div>
  );
};

export default PhotoLayout;
