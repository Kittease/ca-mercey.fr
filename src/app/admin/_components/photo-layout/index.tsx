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

const PhotoLayout = ({
  photos,
  PhotoWrapper = ({ children }) => children,
}: PhotoLayoutProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

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

  const layout = useMemo(() => {
    const gap = containerWidth > 400 ? containerWidth * 0.01 : 16;

    const result = justifiedLayout(
      photos.map(({ width, height }) => ({ width, height })),
      {
        containerWidth,
        boxSpacing: gap,
        containerPadding: gap,
        targetRowHeight:
          containerWidth > 400 ? Math.round(containerWidth * 0.2) : 400,
        targetRowHeightTolerance: containerWidth > 400 ? 0.25 : 1,
      },
    );

    return {
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

  return (
    <div
      ref={containerRef}
      className="relative"
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
            <img src={photo.thumbnailSrc} alt="" className="absolute inset-0" />
          </PhotoWrapper>
        </div>
      ))}
    </div>
  );
};

export default PhotoLayout;
