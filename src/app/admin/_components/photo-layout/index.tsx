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

type Photo = {
  id: string;
  src: string;
  thumbnailSrc: string;
  width: number;
  height: number;
};

interface PhotoLayoutProps {
  photos: Photo[];
  PhotoWrapper?: ComponentType<PropsWithChildren<{ photo: Photo }>>;
}

type JustifiedPhoto = {
  id: string;
  src: string;
  thumbnailSrc: string;
  top: number;
  left: number;
  width: number;
  height: number;
};

type Layout =
  | { mode: "initializing" }
  | { mode: "stack"; photos: Photo[] }
  | { mode: "justified"; photos: JustifiedPhoto[]; height: number };

const PhotoLayout = ({
  photos,
  PhotoWrapper = ({ children }) => children,
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

    if (containerWidth <= 640) {
      return {
        mode: "stack",
        photos,
      };
    }

    const gap = Math.round(containerWidth * 0.01);

    const result = justifiedLayout(
      photos.map(({ width, height }) => ({ width, height })),
      {
        containerWidth,
        boxSpacing: gap,
        containerPadding: gap,
        targetRowHeight: Math.round(containerWidth * 0.2),
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
          top,
          left,
          width,
          height,
        };
      }),
    };
  }, [containerWidth, photos]);

  if (layout.mode === "initializing") {
    return <div ref={containerRef} className="w-full" />;
  }

  if (layout.mode === "stack") {
    return (
      <div ref={containerRef} className="flex flex-col gap-y-4 p-4">
        {layout.photos.map((photo) => (
          <div
            key={photo.id}
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          >
            <PhotoWrapper photo={photo}>
              <img
                src={photo.thumbnailSrc}
                alt=""
                className="absolute inset-0 size-full"
              />
            </PhotoWrapper>
          </div>
        ))}
      </div>
    );
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
            <img
              src={photo.thumbnailSrc}
              alt=""
              className="absolute inset-0 size-full"
            />
          </PhotoWrapper>
        </div>
      ))}
    </div>
  );
};

export default PhotoLayout;
