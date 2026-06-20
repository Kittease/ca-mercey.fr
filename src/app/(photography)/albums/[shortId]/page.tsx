import { AlbumPrivacy } from "@prisma/client";
import {
  format,
  formatDate,
  isSameDay,
  isSameMonth,
  isSameYear,
} from "date-fns";
import { notFound, unauthorized } from "next/navigation";

import GalleryLayout from "@/app/(photography)/_components/gallery-layout";
import ProgressiveImage from "@/app/_components/ui/progressive-image";
import { getAlbumByShortID } from "@/domain/photography/services/albums";
import { getAdminUser } from "@/lib/auth/admin";
import { cn } from "@/lib/tailwind";

const AlbumPage = async ({ params }: PageProps<"/albums/[shortId]">) => {
  const { shortId } = await params;
  const album = await getAlbumByShortID(shortId);
  if (!album) {
    return notFound();
  }

  if (album.privacy === AlbumPrivacy.PRIVATE && !(await getAdminUser())) {
    return unauthorized();
  }

  const firstPhoto = album.photos.at(0);
  if (!firstPhoto) {
    return <p>Album vide</p>;
  }

  const { firstDate, lastDate } = album.photos.reduce(
    (acc, photo) => ({
      firstDate:
        photo.metadata.captureTime && acc.firstDate
          ? photo.metadata.captureTime < acc.firstDate
            ? photo.metadata.captureTime
            : acc.firstDate
          : (photo.metadata.captureTime ?? acc.firstDate),
      lastDate:
        photo.metadata.captureTime && acc.lastDate
          ? photo.metadata.captureTime > acc.lastDate
            ? photo.metadata.captureTime
            : acc.lastDate
          : (photo.metadata.captureTime ?? acc.lastDate),
    }),
    {
      firstDate: firstPhoto.metadata.captureTime,
      lastDate: firstPhoto.metadata.captureTime,
    },
  );

  return (
    <div className="flex w-full flex-col">
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
            className={cn(
              "font-medium",
              "mb-0 text-3xl",
              "sm:mb-1 sm:text-6xl",
            )}
          >
            {album.name}
          </h1>

          {album.description ? (
            <p className={cn("text-base", "sm:text-xl")}>{album.description}</p>
          ) : null}

          {firstDate && lastDate ? (
            <p
              className={cn(
                "rounded-full bg-foreground/25 backdrop-blur-xs",
                "px-2 py-0.75 text-xs",
                "sm:px-3 sm:py-1 sm:text-sm",
              )}
            >
              {isSameDay(firstDate, lastDate)
                ? formatDate(firstDate, "dd MMMM yyyy")
                : isSameMonth(firstDate, lastDate)
                  ? `${format(firstDate, "dd")} - ${format(lastDate, "dd MMMM yyyy")}`
                  : isSameYear(firstDate, lastDate)
                    ? `${format(firstDate, "dd MMMM")} - ${format(lastDate, "dd MMMM yyyy")}`
                    : `${format(firstDate, "dd MMMM yyyyY")} - ${format(lastDate, "dd MMMM yyyy")}`}
            </p>
          ) : null}
        </div>
      </div>

      <GalleryLayout photos={album.photos} />
    </div>
  );
};

export default AlbumPage;
