"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/tailwind";

interface ProgressiveImageProps {
  placeholder: string | null;
  src: string;
  alt?: string;
  className?: string;
  draggable?: boolean;
  onLoad?: () => void;
}

const ProgressiveImage = ({
  placeholder,
  src,
  alt = "",
  className,
  draggable,
  onLoad,
}: ProgressiveImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;

    if (img?.complete && img.naturalWidth > 0) {
      setLoaded(true);
    } else {
      setLoaded(false);
    }
  }, [src]);

  return (
    <>
      {placeholder ? (
        <img
          src={placeholder}
          alt=""
          aria-hidden
          draggable={draggable}
          className={cn("absolute inset-0 size-full", className)}
        />
      ) : null}

      <img
        ref={imgRef}
        src={src}
        alt={alt}
        draggable={draggable}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        data-loaded={loaded}
        className={cn(
          "absolute inset-0 size-full transition-opacity duration-300",
          "opacity-0 data-[loaded='true']:opacity-100",
          className,
        )}
      />
    </>
  );
};

export default ProgressiveImage;
