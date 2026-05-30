"use client";

import { CheckIcon } from "lucide-react";
import { KeyboardEvent, PropsWithChildren } from "react";

import { cn } from "@/lib/tailwind";

import { usePhotoSelection } from "./context";

interface PhotoWrapperProps {
  photo: {
    id: string;
  };
}

const PhotoWrapper = ({
  children,
  photo,
}: PropsWithChildren<PhotoWrapperProps>) => {
  const { isPhotoSelected, togglePhoto, selectedPhotoCount } =
    usePhotoSelection();

  const handlePhotoClick = () => {
    if (selectedPhotoCount > 0) {
      togglePhoto(photo);
    }
  };

  const handlePhotoButtonClick = () => {
    if (selectedPhotoCount === 0) {
      togglePhoto(photo);
    }
  };

  const handlePhotoButtonKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    handlePhotoClick();
  };

  return (
    <div
      role="button"
      tabIndex={selectedPhotoCount > 0 ? 0 : -1}
      data-selection={selectedPhotoCount > 0}
      data-selected={isPhotoSelected(photo.id)}
      onClick={handlePhotoClick}
      onKeyDown={handlePhotoButtonKeyDown}
      className={cn(
        "group/photo",
        "[--selected-pad:--spacing(3)]",
        "absolute inset-0 cursor-pointer bg-foreground/15 transition-all hover:bg-foreground/20",
        "[&_img]:transition-all data-[selected=false]:[&_img]:inset-0 data-[selected=false]:[&_img]:size-full data-[selected=true]:[&_img]:inset-(--selected-pad) data-[selected=true]:[&_img]:size-[calc(100%-2*var(--selected-pad))]",
        "after:absolute after:inset-0 after:z-10 after:h-24 after:bg-gradient-to-b after:from-background/50 after:to-background/0",
        "after:opacity-0 after:transition-all hover:data-[selected=false]:after:opacity-100",
      )}
    >
      <button
        type="button"
        aria-pressed={isPhotoSelected(photo.id)}
        onClick={(event) => {
          event.stopPropagation();
          if (selectedPhotoCount > 0) {
            handlePhotoClick();
            return;
          }

          handlePhotoButtonClick();
        }}
        className="absolute top-2 left-2 z-20 size-5"
      >
        <svg
          viewBox="0 0 20 20"
          className={cn(
            "absolute top-0 left-0 rounded-full transition-all",
            "text-foreground/0 group-hover/photo:group-data-[selected=false]/photo:text-foreground/50 group-data-[selected=false]/photo:hover:text-foreground/100",
            "border-foreground/50 group-hover/photo:border-0! group-data-[selection=true]/photo:group-data-[selected=false]/photo:border-2",
            "group-data-[selected=true]/photo:text-green-600",
          )}
        >
          <mask id="check-icon-mask" maskUnits="userSpaceOnUse">
            <circle cx="10" cy="10" r="10" fill="white" />

            <CheckIcon
              x={2}
              y={2}
              width={16}
              height={16}
              className="stroke-black"
              strokeWidth={3}
            />
          </mask>

          <circle
            cx="10"
            cy="10"
            r="10"
            fill="currentColor"
            mask="url(#check-icon-mask)"
          />
        </svg>
      </button>

      {children}
    </div>
  );
};

export default PhotoWrapper;
