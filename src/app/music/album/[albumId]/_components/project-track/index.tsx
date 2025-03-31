"use client";

import { PauseIcon, PlayIcon } from "lucide-react";

import { type ProjectTrack as ProjectTrackType } from "@/domain/music/services/projects/types";
import { formatTime } from "@/lib/math";
import { cn } from "@/lib/tailwind";
import { useAudio } from "@/lib/use-audio";

interface ProjectTrackProps {
  track: ProjectTrackType;
}

// FIXME: If the audio_preview_url is null, do not

const ProjectTrack = ({ track }: ProjectTrackProps) => {
  const audio =
    typeof window !== "undefined" && track.audioPreviewUrl
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useAudio(track.audioPreviewUrl)
      : null;

  return (
    <button
      onClick={audio ? audio.playPause : () => undefined}
      type="button"
      className={cn(
        "relative col-span-3 grid grid-cols-subgrid items-center justify-start overflow-hidden rounded-lg px-6 py-4",
        audio ? "cursor-pointer hover:bg-stone-50/5" : "cursor-default",
        audio &&
          audio.currentTime !== 0 && [
            "bg-stone-50/5",
            "before:absolute before:inset-x-0 before:bottom-px before:z-0 before:h-0.5 before:bg-stone-700",
            "after:absolute after:bottom-px after:left-0 after:z-10 after:h-0.5 after:w-[var(--progress)] after:bg-green-400",
          ]
      )}
      style={
        audio
          ? ({
              "--progress": `${(audio.currentTime / audio.duration) * 100}%`,
            } as React.CSSProperties)
          : undefined
      }
    >
      <span className="row-span-2">
        {
          // eslint-disable-next-line no-nested-ternary
          audio && audio.currentTime !== 0 ? (
            audio.isPlaying ? (
              <PauseIcon className="size-4 text-stone-50" />
            ) : (
              <PlayIcon className="size-4 text-stone-50" />
            )
          ) : (
            <p className="font-bold">{track.trackNumber}</p>
          )
        }
      </span>

      <p className="text-left font-bold text-stone-50">{track.name}</p>

      <ul className="col-start-2 row-start-2 flex flex-row text-left font-bold text-stone-400">
        {track.artists.map((artist, i) => (
          <>
            <li key={artist.id}>{artist.name}</li>
            {i < track.artists.length - 1 ? <span>,&nbsp;</span> : null}
          </>
        ))}
      </ul>

      <p className="col-start-3 row-span-2 flex flex-row justify-end gap-x-1 font-bold">
        {audio && audio.currentTime !== 0 ? (
          <>
            <span>{formatTime(audio.currentTime)}</span>
            <span>/</span>
            <span>{formatTime(audio.duration)}</span>
          </>
        ) : (
          formatTime(track.duration / 1000)
        )}
      </p>
    </button>
  );
};

export default ProjectTrack;
