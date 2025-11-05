"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";

import type { ReactNode } from "react";

import type { Picture } from "@/domain/photography/services/pictures/types";

interface GalleryJustifiedLayoutProps {
  pictures: Picture[];
  PictureComponent: (
    picture: Picture,
    width: number,
    height: number
  ) => ReactNode;
}

const GalleryJustifiedLayout = ({
  pictures,
  PictureComponent,
}: GalleryJustifiedLayoutProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const roRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }

    const w =
      node.clientWidth ||
      node.getBoundingClientRect().width ||
      (typeof window !== "undefined" ? window.innerWidth : 1024);
    if (w && w !== containerWidth) {
      setContainerWidth(Math.round(w));
    }

    if (!roRef.current) {
      const ro = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? node.clientWidth ?? 0;
        const resolved =
          width || (typeof window !== "undefined" ? window.innerWidth : 1024);
        setContainerWidth(Math.round(resolved));
      });
      ro.observe(node);
      roRef.current = ro;
    }

    return () => {
      if (roRef.current) {
        roRef.current.disconnect();
      }
      roRef.current = null;
    };
  }, []);

  type RowItem = { picture: Picture; width: number };
  type Row = { height: number; items: Array<RowItem> };

  const rows: Array<Row> = useMemo(() => {
    const gap = 8; // px between items
    const viewportWidth =
      typeof window !== "undefined" ? window.innerWidth : containerWidth;
    const isMobile = (containerWidth || viewportWidth) < 640; // Tailwind sm breakpoint
    const targetRowHeight = isMobile ? 192 : 384; // desired height (mobile vs desktop)
    const minScale = 0.75; // allow smaller rows

    const effectiveWidth = containerWidth > 0 ? containerWidth : 1024;

    const DEFAULT_AR = 1.5;

    // Fallback for pictures without metadata
    const itemsWithFallback = pictures.map((p) => ({
      picture: p,
      ar:
        p.metadata?.width && p.metadata?.height
          ? p.metadata.width / p.metadata.height
          : DEFAULT_AR,
    }));

    const result: Array<Row> = [];
    let current: Array<{ picture: Picture; ar: number }> = [];
    let sumAR = 0;

    const finalize = (isLast: boolean) => {
      if (current.length === 0) {
        return;
      }
      const totalGaps = gap * (current.length - 1);
      let height = (effectiveWidth - totalGaps) / sumAR;
      if (height > targetRowHeight) {
        height = targetRowHeight;
      }
      if (!isLast && height < targetRowHeight * minScale) {
        height = targetRowHeight * minScale;
      }
      const rowItems: Array<RowItem> = current.map(({ picture, ar }) => ({
        picture,
        width: Math.round(ar * height),
      }));
      if (!isLast) {
        // Balance rounding by adjusting last item to fill the row
        const used =
          rowItems.reduce((acc, it) => acc + it.width, 0) + totalGaps;
        const delta = effectiveWidth - used;
        if (rowItems.length > 0 ? (delta !== 0 ? true : false) : false) {
          rowItems[rowItems.length - 1].width += delta;
        }
      }
      result.push({ height: Math.round(height), items: rowItems });
      current = [];
      sumAR = 0;
    };

    for (const it of itemsWithFallback) {
      current.push(it);
      sumAR += it.ar;
      const heightIfFinal =
        (effectiveWidth - gap * (current.length - 1)) / sumAR;
      if (heightIfFinal <= targetRowHeight) {
        finalize(false);
      }
    }
    finalize(true);
    return result;
  }, [pictures, containerWidth]);

  if (pictures.length === 0) {
    return <div className="text-sm text-stone-600">No pictures found.</div>;
  }

  return (
    <div ref={containerRef} className="space-y-2">
      {rows.map(({ items, height }, rowIndex) => (
        <div key={rowIndex} className="flex gap-2">
          {items.map(({ picture, width }) => (
            <Fragment key={picture.name}>
              {PictureComponent(picture, width, height)}
            </Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

export default GalleryJustifiedLayout;
