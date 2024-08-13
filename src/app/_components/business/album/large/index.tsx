"use client";

import { Disc3, Heart, HeartOff } from "lucide-react";
import Image from "next/image";

import type { AlbumProps } from "@/app/_components/business/album/types";
import { getHighestDefinitionSpotifyImage } from "@/domain/spotify/utils";
import { cn } from "@/lib/tailwind";

const AlbumLarge = ({
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
        "group/album relative flex w-fit flex-col gap-y-6 rounded-lg bg-stone-900 p-6",
        action ? "pr-28" : "pr-12",
        className
      )}
      {...rest}
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
          <span>{album.releaseYear}</span>

          <span>•</span>

          <span className="flex flex-row gap-x-2">
            {album.artists.map(({ id, name }) => (
              <span key={id}>{name}</span>
            ))}
          </span>
        </p>
      </div>

      {action ? (
        <button
          type="button"
          disabled={action.state.pending}
          onClick={action.handler}
          className={cn(
            "absolute bottom-6 right-6 size-fit rounded-full bg-green-500 p-4 drop-shadow-md transition-all duration-150 disabled:bg-green-600",
            "pointer-events-none group-hover/album:pointer-events-auto group-hover/album:opacity-100",
            "group/cta m-1 hover:m-0",
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
                <HeartOff className="size-8 text-stone-950 transition-all duration-150 group-hover/cta:size-10" />
              ) : (
                <Heart className="size-8 fill-stone-950 text-stone-950 transition-all duration-150 group-hover/cta:size-10" />
              )
            ) : (
              <Disc3 className="size-8 animate-spin text-green-950 transition-all group-hover/cta:size-10" />
            )
          }
        </button>
      ) : null}
    </div>
  );
};

export default AlbumLarge;
