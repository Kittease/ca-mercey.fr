import { MapIcon } from "lucide-react";
import Link from "next/link";

import DirectionToggle from "@/app/(photography)/gallery/_components/direction-toggle";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

interface GalleryHeaderProps {
  showWorldviewLink: boolean;
}

const GalleryHeader = ({ showWorldviewLink }: GalleryHeaderProps) => {
  return (
    <div
      className={cn(
        "fixed z-40 flex h-fit w-full flex-row items-center justify-between bg-background/65 backdrop-blur-xl",
        "p-8",
        "sm:px-8 sm:py-4",
      )}
    >
      <h1 className="text-2xl font-medium">Mes photos</h1>

      <div className="flex flex-row items-center gap-x-4">
        <DirectionToggle />

        {showWorldviewLink ? (
          <Link href={Routes.GALLERY_WORLDVIEW} aria-label="Voir la carte">
            <MapIcon />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default GalleryHeader;
