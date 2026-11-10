import { format, isSameDay, isSameMonth, isSameYear, max, min } from "date-fns";
import { fr } from "date-fns/locale";
import { MapIcon } from "lucide-react";
import Link from "next/link";

import ProgressiveImage from "@/app/_components/ui/progressive-image";
import { AlbumWithPhotos } from "@/domain/photography/services/albums/types";
import { cn } from "@/lib/tailwind";

import type { Route } from "next";

const formatFr = (date: Date, pattern: string) =>
  format(date, pattern, { locale: fr });

const formatDateRange = (firstDate: Date, lastDate: Date) => {
  if (isSameDay(firstDate, lastDate)) {
    return formatFr(firstDate, "dd MMMM yyyy");
  }

  if (isSameMonth(firstDate, lastDate)) {
    return `${formatFr(firstDate, "dd")} - ${formatFr(lastDate, "dd MMMM yyyy")}`;
  }

  if (isSameYear(firstDate, lastDate)) {
    return `${formatFr(firstDate, "dd MMMM")} - ${formatFr(lastDate, "dd MMMM yyyy")}`;
  }

  return `${formatFr(firstDate, "dd MMMM yyyy")} - ${formatFr(lastDate, "dd MMMM yyyy")}`;
};

interface AlbumHeaderProps {
  album: AlbumWithPhotos;
  worldviewPath: string;
}

const AlbumHeader = ({ album, worldviewPath }: AlbumHeaderProps) => {
  const captureTimes = album.photos.flatMap(({ metadata: { captureTime } }) =>
    captureTime ? [captureTime] : [],
  );

  const hasLocatedPhoto = album.photos.some(
    ({ metadata: { locationCoordinates } }) => locationCoordinates,
  );

  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "px-8 pt-28 pb-12",
        "sm:px-24 sm:pt-56 sm:pb-24",
        "md:px-[25%]",
      )}
    >
      {album.coverThumbnailSrc ? (
        <div
          className={cn(
            "absolute -inset-8 z-[-1]",
            "after:absolute after:inset-0 after:bg-linear-to-t after:to-background/0 after:to-75%",
            "after:from-background",
            "sm:after:from-background/75",
          )}
        >
          <ProgressiveImage
            placeholder={album.coverPlaceholderUrl}
            src={album.coverThumbnailSrc}
            className="object-cover blur-sm"
          />
        </div>
      ) : null}

      <div
        className={cn(
          "flex flex-col items-center justify-center text-center",
          "gap-y-1",
          "sm:gap-y-2",
        )}
      >
        <h1
          className={cn("font-medium", "mb-0 text-3xl", "sm:mb-1 sm:text-6xl")}
        >
          {album.name}
        </h1>

        {album.description ? (
          <p className={cn("text-base", "sm:text-xl")}>{album.description}</p>
        ) : null}

        {captureTimes.length > 0 ? (
          <p
            className={cn(
              "rounded-full bg-foreground/25 backdrop-blur-xs",
              "px-2 py-0.75 text-xs",
              "sm:px-3 sm:py-1 sm:text-sm",
            )}
          >
            {formatDateRange(min(captureTimes), max(captureTimes))}
          </p>
        ) : null}

        {hasLocatedPhoto ? (
          <Link
            href={worldviewPath as Route}
            aria-label="Voir la carte"
            className={cn(
              "rounded-full px-3 py-2 transition-all",
              "hover:bg-foreground/25 hover:backdrop-blur-xs",
            )}
          >
            <MapIcon />
          </Link>
        ) : null}
      </div>
    </div>
  );
};

export default AlbumHeader;
