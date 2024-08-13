"use client";

import { Disc3, Heart, HeartOff } from "lucide-react";
import Image from "next/image";

import { AlbumProps } from "@/app/_components/business/album/types";
import { getHighestDefinitionSpotifyImage } from "@/domain/spotify/utils";
import { cn } from "@/lib/tailwind";

const AlbumSmall = ({
  album,
  isFavorite = false,
  className,
  action,
  ...rest
}: AlbumProps) => {
  const cover = getHighestDefinitionSpotifyImage(album.images);

  return (
    <div
      className={cn(
        "group/album flex w-52 flex-col gap-y-2 rounded-lg bg-stone-900 p-2",
        className
      )}
      {...rest}
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

        {action ? (
          <button
            type="button"
            disabled={action.state.pending}
            onClick={action.handler}
            className={cn(
              "absolute bottom-4 right-4 rounded-full bg-green-500 p-3 drop-shadow-md transition-all duration-150 disabled:bg-green-600",
              "pointer-events-none group-hover/album:pointer-events-auto group-hover/album:opacity-100",
              "group/cta m-0.5 hover:m-0",
              (action.state.pending && action.state.albumId === album.id) ||
                isFavorite
                ? "opacity-100"
                : "opacity-0"
            )}
          >
            {
              // eslint-disable-next-line no-nested-ternary
              !action.state.pending ? (
                isFavorite ? (
                  <HeartOff className="size-6 text-stone-950 transition-all duration-150 group-hover/cta:size-7" />
                ) : (
                  <Heart className="size-6 fill-stone-950 text-stone-950 transition-all duration-150 group-hover/cta:size-7" />
                )
              ) : (
                <Disc3 className="size-6 animate-spin text-green-950 transition-all group-hover/cta:size-7" />
              )
            }
          </button>
        ) : null}
      </div>

      <div className="flex flex-col">
        <p className="truncate">{album.name}</p>

        <p className="truncate text-sm text-stone-400">
          <span>{album.releaseYear}</span>

          <span> • </span>

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
