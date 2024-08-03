import { Heart } from "lucide-react";
import Image from "next/image";
import { HTMLAttributes } from "react";

import { SimplifiedAlbum } from "@/domain/spotify/services/album/types";
import {
  getAlbumReleaseDateObject,
  getHighestDefinitionSpotifyImage,
} from "@/domain/spotify/utils";
import { cn } from "@/lib/tailwind";

interface AlbumSmallProps extends HTMLAttributes<HTMLDivElement> {
  album: SimplifiedAlbum;
  canFavorite?: boolean;
}

const AlbumSmall = ({
  album,
  className,
  canFavorite = false,
  ...linkProps
}: AlbumSmallProps) => {
  const cover = getHighestDefinitionSpotifyImage(album.images);
  const { year } = getAlbumReleaseDateObject(
    album.releaseDate,
    album.releaseDatePrecision
  );

  return (
    <div
      className={cn(
        "group/album flex w-52 flex-col gap-y-2 rounded-lg bg-stone-900 p-2",
        className
      )}
      {...linkProps}
    >
      <div className="relative size-48">
        {cover ? (
          <Image
            src={cover.url}
            alt={`${album.name} cover`}
            width={cover.width}
            height={cover.height}
            className="rounded-md"
          />
        ) : null}

        {canFavorite ? (
          <div
            className={cn(
              "absolute bottom-4 right-4 cursor-pointer rounded-full bg-green-500 p-3 drop-shadow-md transition-all duration-150",
              "pointer-events-none opacity-0 group-hover/album:pointer-events-auto group-hover/album:opacity-100",
              "group/cta m-0.5 hover:m-0"
            )}
          >
            <Heart className="size-6 fill-stone-950 text-stone-950 transition-all duration-150 group-hover/cta:size-7" />
          </div>
        ) : null}
      </div>

      <div className="flex flex-col">
        <p className="truncate">{album.name}</p>

        <p className="truncate text-sm text-stone-400">
          {year ? (
            <>
              <span>{year}</span>
              <span> • </span>
            </>
          ) : null}

          {album.artists.map(({ id, name }, index) => (
            <>
              <span key={id}>{name}</span>
              {index < album.artists.length - 1 ? <span>, </span> : null}
            </>
          ))}
        </p>
      </div>
    </div>
  );
};

export default AlbumSmall;
