"use client";

import {
  type MouseEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/tailwind";

import CameraCursorContext, {
  type CameraCursorContextInterface,
} from "./context";
import CameraCursor from "./cursor";
import { type CameraCursorOptions } from "./types";

interface CameraCursorProviderProps {
  className?: string;
  children: ReactNode;
  options?: CameraCursorOptions;
}

const CameraCursorProvider = ({
  className,
  children,
  options,
}: CameraCursorProviderProps) => {
  const [measureRef, bounds] = useMeasure();
  const cameraCursorRef = useRef<HTMLDivElement>(null);

  const [hoveredElementData, setHoveredElementData] =
    useState<CameraCursorContextInterface["hoveredElementData"]>(null);

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!cameraCursorRef.current) {
      return;
    }

    const left = event.clientX - bounds.left;
    const top = event.clientY - bounds.top;

    cameraCursorRef.current.style.setProperty(
      "--left-cursor-offset",
      `${left}px`
    );
    cameraCursorRef.current.style.setProperty(
      "--top-cursor-offset",
      `${top}px`
    );
  };

  const handleScroll = () => {
    if (!cameraCursorRef.current) {
      return;
    }

    cameraCursorRef.current.style.setProperty(
      "--scroll-offset-x",
      `${window.scrollX}px`
    );
    cameraCursorRef.current.style.setProperty(
      "--scroll-offset-y",
      `${window.scrollY}px`
    );
  };

  useEffect(() => {
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <CameraCursorContext.Provider
      value={{
        hoveredElementData,
        setHoveredElementData,
      }}
    >
      <div
        ref={measureRef}
        onMouseMove={handleMouseMove}
        className={cn("relative cursor-none", className)}
      >
        {children}
      </div>

      <CameraCursor ref={cameraCursorRef} options={options} />
    </CameraCursorContext.Provider>
  );
};

export default CameraCursorProvider;
