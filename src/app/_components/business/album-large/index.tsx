import { Heart } from "lucide-react";
import Image from "next/image";
import { HTMLAttributes } from "react";

import { SimplifiedAlbum } from "@/domain/spotify/services/album/types";
import {
  getAlbumReleaseDateObject,
  getHighestDefinitionSpotifyImage,
} from "@/domain/spotify/utils";
import { cn } from "@/lib/tailwind";

interface AlbumLargeProps extends HTMLAttributes<HTMLDivElement> {
  album: SimplifiedAlbum;
  canFavorite?: boolean;
}

const AlbumLarge = ({
  album,
  className,
  canFavorite = false,
  ...linkProps
}: AlbumLargeProps) => {
  const cover = getHighestDefinitionSpotifyImage(album.images);
  const { year } = getAlbumReleaseDateObject(
    album.releaseDate,
    album.releaseDatePrecision
  );

  return (
    <div
      className={cn(
        "group/album relative flex w-fit flex-col gap-y-6 rounded-lg bg-stone-900 p-6",
        canFavorite ? "pr-28" : "pr-12",
        className
      )}
      {...linkProps}
    >
      {cover ? (
        <Image
          src={cover.url}
          alt={`${album.name} cover`}
          width={cover.width}
          height={cover.height}
          className="size-32 rounded-md drop-shadow-xl"
        />
      ) : null}

      <div className="flex flex-col gap-y-1">
        <p className="text-4xl font-bold">{album.name}</p>

        <p className="flex flex-row gap-x-1 text-xl text-stone-400">
          {year ? (
            <>
              <span>{year}</span>
              <span>•</span>
            </>
          ) : null}

          <span className="flex flex-row gap-x-2">
            {album.artists.map(({ id, name }) => (
              <span key={id}>{name}</span>
            ))}
          </span>
        </p>
      </div>

      {canFavorite ? (
        <div
          className={cn(
            "absolute bottom-6 right-6 size-fit cursor-pointer rounded-full bg-green-500 p-4 drop-shadow-md transition-all duration-150",
            "pointer-events-none opacity-0 group-hover/album:pointer-events-auto group-hover/album:opacity-100",
            "group/cta m-1 hover:m-0"
          )}
        >
          <Heart className="size-8 fill-stone-950 text-stone-950 transition-all duration-150 group-hover/cta:size-10" />
        </div>
      ) : null}
    </div>
  );
};

export default AlbumLarge;
