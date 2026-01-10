"use client";

import { inView } from "motion/react";
import {
  type CSSProperties,
  type ReactNode,
  useContext,
  useEffect,
  useId,
} from "react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/tailwind";

import CameraCursorContext from "./context";

const PHOTO_SCALE_FACTOR_ON_HOVER = 1.1;

interface CameraCursorFocusableElementProps {
  children?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
}

const CameraCursorFocusableElement = ({
  children,
  id,
  className,
  style,
}: CameraCursorFocusableElementProps) => {
  const elementId = id ?? useId();

  const [ref, bounds] = useMeasure();

  const { setHoveredElementData } = useContext(CameraCursorContext);

  const handleMouseEnter = () => {
    const scaledWidth = bounds.width * PHOTO_SCALE_FACTOR_ON_HOVER;
    const scaledHeight = bounds.height * PHOTO_SCALE_FACTOR_ON_HOVER;

    setHoveredElementData({
      offsetX: bounds.x - (scaledWidth - bounds.width) / 2,
      offsetY: bounds.y - (scaledHeight - bounds.height) / 2,
      width: scaledWidth,
      height: scaledHeight,
    });
  };

  const handleMouseLeave = () => {
    setHoveredElementData(null);
  };

  // Make sure to run the inView callback only when the component is loaded in
  // a browser environment
  useEffect(() => {
    inView(`#${elementId}`, (element) => {
      element.classList.add("in-view");
      return () => element.classList.remove("in-view");
    });
  }, []);

  return (
    <div
      ref={ref}
      id={elementId}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "transition-transform duration-300 hover:scale-(--scale-factor)",
        className
      )}
      style={
        {
          "--scale-factor": PHOTO_SCALE_FACTOR_ON_HOVER,
          ...style,
        } as CSSProperties
      }
    >
      {children}
    </div>
  );
};

export default CameraCursorFocusableElement;
