import Image from "next/image";

import { FavoriteProject } from "@/domain/music/services/favorite-projects/types";
import { cn } from "@/lib/tailwind";

interface AlbumFancyProps {
  project: FavoriteProject;
}

const AlbumFancy = ({ project }: AlbumFancyProps) => {
  const coverUrl = project.coverUrl ? project.coverUrl : "/vinyl.png";

  const totalTime = project.tracks.reduce(
    (acc, track) => acc + track.duration,
    0
  );

  const hours = Math.floor(totalTime / 3600000);
  const minutes = Math.floor((totalTime % 3600000) / 60000);
  const seconds = Math.floor((totalTime % 60000) / 1000);

  return (
    <div className="group flex size-64 flex-col overflow-hidden">
      <div className="relative flex h-2/3 w-full items-center justify-center">
        <div
          className={cn(
            "absolute inset-0 z-0",
            "after:absolute after:inset-0 after:backdrop-blur-xl"
          )}
        >
          <Image
            src={coverUrl}
            alt=""
            className={cn(
              "size-64",
              !project.coverUrl ? "bg-cyan-500" : undefined
            )}
            width={256}
            height={256}
          />
        </div>

        <Image
          src={coverUrl}
          alt=""
          className={cn(
            "z-10 size-32 scale-100 drop-shadow-lg transition-all duration-300 ease-in-out group-hover:scale-105 group-hover:drop-shadow-xl",
            !project.coverUrl ? "bg-cyan-500" : undefined
          )}
          width={128}
          height={128}
        />
      </div>

      <div className="relative flex h-1/3 w-full items-center p-4">
        <div
          className={cn(
            "absolute inset-0 z-0",
            "after:absolute after:inset-0 after:bg-black/40 after:backdrop-blur-xl"
          )}
        >
          <Image
            src={coverUrl}
            alt=""
            className={cn(
              "size-64 -scale-100",
              !project.coverUrl ? "bg-cyan-500" : undefined
            )}
            width={256}
            height={256}
          />
        </div>

        <div className="z-10 max-w-full">
          <p className="truncate text-stone-50/95" title={project.name}>
            {project.name}
          </p>
          <p className="flex flex-row gap-x-1 text-xs text-stone-50/65">
            <span
              className="shrink truncate"
              title={project.artists.map((artist) => artist.name).join(", ")}
            >
              {project.artists.map((artist) => artist.name).join(", ")}
            </span>
            <span className="shrink-0">•</span>
            <span className="shrink-0">
              {project.releaseYear}
              {project.releaseMonth ? `-${project.releaseMonth}` : null}
              {project.releaseDay ? `-${project.releaseDay}` : null}
            </span>
          </p>
          <p className="flex flex-row gap-x-1 text-xs text-stone-50/65">
            <span>{project.tracks.length} tracks</span>
            <span>•</span>
            <span>
              {hours > 0
                ? `${hours} hr ${minutes} min`
                : `${minutes} min ${seconds} sec`}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlbumFancy;
