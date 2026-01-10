"use client";

import * as motion from "motion/react-client";
import { Portal } from "radix-ui";
import { type CSSProperties, type RefObject, useContext } from "react";

import { cn } from "@/lib/tailwind";

import CameraCursorContext from "./context";
import { type CameraCursorOptions } from "./types";

interface CameraCursorProps {
  options?: CameraCursorOptions;
  ref?: RefObject<HTMLDivElement | null>;
}

const CameraCursor = ({ options, ref }: CameraCursorProps) => {
  const { hoveredElementData } = useContext(CameraCursorContext);

  const cameraFocusPointSize = options?.cameraFocusPointSize ?? 18;

  const cameraCornerSize = options?.cameraCornerSize ?? 16;
  const cameraCornerWeight = options?.cameraCornerWeight ?? 6;
  const cameraCornerOffset = options?.cameraCornerOffset ?? 12;

  // 2/3 camera size
  const cameraWidth =
    options?.cameraWidth ?? 6 * cameraCornerSize - 2 * cameraCornerOffset;
  const cameraHeight =
    options?.cameraHeight ?? 4 * cameraCornerSize - 2 * cameraCornerOffset;

  return (
    <Portal.Root
      ref={ref}
      style={
        {
          "--cursor-width": `${cameraWidth}px`,
          "--cursor-height": `${cameraHeight}px`,
          "--corner-size": `${cameraCornerSize}px`,
          "--corner-weight": `${cameraCornerWeight}px`,
          "--border-offset": `${cameraCornerOffset}px`,
          "--dot-size": `${cameraFocusPointSize}px`,
          "--cursor-x": `calc(var(--left-cursor-offset) + var(--scroll-offset-x, 0px))`,
          "--cursor-y": `calc(var(--top-cursor-offset) + var(--scroll-offset-y, 0px))`,
        } as CSSProperties
      }
    >
      <motion.div
        key="top-right"
        layout
        className={cn(
          "pointer-events-none z-99 absolute size-(--corner-size) border-t-(length:--corner-weight) border-r-(length:--corner-weight) border-stone-50"
        )}
        style={{
          top: hoveredElementData
            ? `calc(${hoveredElementData.offsetY}px - var(--border-offset))`
            : "calc(var(--cursor-y) - var(--corner-size) - var(--cursor-height) / 2)",
          left: hoveredElementData
            ? `calc(${
                hoveredElementData.offsetX + hoveredElementData.width
              }px - var(--corner-size) + var(--border-offset))`
            : "calc(var(--cursor-x) + var(--cursor-width) / 2)",
        }}
      />

      <motion.div
        key="bottom-right"
        layout
        className={cn(
          "pointer-events-none z-99 absolute size-(--corner-size) border-b-(length:--corner-weight) border-r-(length:--corner-weight) border-stone-50"
        )}
        style={{
          top: hoveredElementData
            ? `calc(${
                hoveredElementData.offsetY + hoveredElementData.height
              }px - var(--corner-size) + var(--border-offset))`
            : "calc(var(--cursor-y) + var(--cursor-height) / 2)",
          left: hoveredElementData
            ? `calc(${
                hoveredElementData.offsetX + hoveredElementData.width
              }px - var(--corner-size) + var(--border-offset))`
            : "calc(var(--cursor-x) + var(--cursor-width) / 2)",
        }}
      />

      <motion.div
        key="bottom-left"
        layout
        className={cn(
          "pointer-events-none z-99 absolute size-(--corner-size) border-b-(length:--corner-weight) border-l-(length:--corner-weight) border-stone-50"
        )}
        style={{
          top: hoveredElementData
            ? `calc(${
                hoveredElementData.offsetY + hoveredElementData.height
              }px - var(--corner-size) + var(--border-offset))`
            : "calc(var(--cursor-y) + var(--cursor-height) / 2)",
          left: hoveredElementData
            ? `calc(${hoveredElementData.offsetX}px - var(--border-offset))`
            : "calc(var(--cursor-x) - var(--corner-size) - var(--cursor-width) / 2)",
        }}
      />

      <motion.div
        key="top-left"
        layout
        className={cn(
          "pointer-events-none z-99 absolute size-(--corner-size) border-t-(length:--corner-weight) border-l-(length:--corner-weight) border-stone-50"
        )}
        style={{
          top: hoveredElementData
            ? `calc(${hoveredElementData.offsetY}px - var(--border-offset))`
            : "calc(var(--cursor-y) - var(--corner-size) - var(--cursor-height) / 2)",
          left: hoveredElementData
            ? `calc(${hoveredElementData.offsetX}px - var(--border-offset))`
            : "calc(var(--cursor-x) - var(--corner-size) - var(--cursor-width) / 2)",
        }}
      />

      <motion.div
        key="dot"
        layout
        data-minimized={!!hoveredElementData}
        className={cn(
          "pointer-events-none z-99 absolute bg-stone-50 rounded-full size-(--dot-size)",
          "data-[minimized=true]:opacity-50 data-[minimized=true]:scale-33",
          "data-[minimized=false]:opacity-100 data-[minimized=false]:scale-100"
        )}
        style={{
          top: `calc(var(--cursor-y) - var(--dot-size) / 2)`,
          left: `calc(var(--cursor-x) - var(--dot-size) / 2)`,
        }}
      />
    </Portal.Root>
  );
};

export default CameraCursor;
