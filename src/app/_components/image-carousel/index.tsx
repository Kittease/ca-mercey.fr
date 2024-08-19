import Image from "next/image";
import { ComponentProps, CSSProperties } from "react";

import { cn } from "@/lib/tailwind";

type ImageProps = ComponentProps<typeof Image>;

interface ImageCarouselProps {
  imageUrls: string[];
  imageProps?: Partial<Omit<ImageProps, "src" | "alt" | "role">>;
  speed?: number;
  reverse?: boolean;
  defaultState?: "running" | "paused";
  className?: string;
}

const ImageCarousel = ({
  imageUrls,
  imageProps,
  speed = 5,
  reverse = false,
  defaultState = "running",
  className,
}: ImageCarouselProps) => {
  const animationDuration = (1 / speed) * 2 * imageUrls.length;

  return (
    <div
      style={
        {
          "--speed": `${animationDuration}s`,
        } as CSSProperties
      }
      className={cn(
        "relative flex shrink-0",
        {
          running: "sm:group-hover:[&>div]:paused",
          paused: "[&>div]:paused sm:group-hover:[&>div]:running",
        }[defaultState],
        className
      )}
    >
      <div
        className={cn(
          "flex shrink-0 flex-row gap-x-4 pr-4",
          reverse
            ? "animate-carousel-scroll-reverse"
            : "animate-carousel-scroll",
          "whitespace-nowrap animation-delay-[var(--speed)] animation-duration-carousel-[var(--speed)]"
        )}
      >
        {imageUrls.map((imageUrl) => (
          <Image
            key={imageUrl}
            src={imageUrl}
            alt=""
            role="presentation"
            className={cn("transition-5", imageProps?.className)}
            {...imageProps}
          />
        ))}
      </div>

      <div
        className={cn(
          "flex shrink-0 flex-row gap-x-4 pr-4",
          reverse
            ? "animate-carousel-scroll-continuous-reverse"
            : "animate-carousel-scroll-continuous",
          "whitespace-nowrap animation-delay-halved-[var(--speed)] animation-duration-carousel-[var(--speed)]"
        )}
      >
        {imageUrls.map((imageUrl) => (
          <Image
            key={imageUrl}
            src={imageUrl}
            alt=""
            role="presentation"
            className={cn("transition-5", imageProps?.className)}
            {...imageProps}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
