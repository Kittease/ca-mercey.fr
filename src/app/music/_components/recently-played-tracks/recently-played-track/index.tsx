import { millisecondsToSeconds } from "date-fns";
import Image from "next/image";

import { RecentlyPlayedTrack as RecentlyPlayedTrackType } from "@/domain/statsfm/services/tracks/types";
import { formatDuration, formatRelativeTime } from "@/lib/date";

interface RecentlyPlayedTrackProps {
  track: RecentlyPlayedTrackType;
}

const RecentlyPlayedTrack = ({ track }: RecentlyPlayedTrackProps) => {
  return (
    <div className="flex flex-row gap-x-4 md:gap-x-6">
      <Image
        src={track.image}
        alt={track.album}
        width={768}
        height={768}
        className="w-12 md:w-16"
      />

      <div className="flex w-full flex-row justify-between overflow-hidden">
        <div className="flex flex-col overflow-hidden">
          <p className="truncate text-lg md:text-2xl">{track.name}</p>

          <p className="flex flex-row gap-x-1 truncate text-sm text-stone-400 md:gap-x-2 md:text-lg">
            <span>{track.artist}</span>
            <span>-</span>
            <span>{track.album}</span>
          </p>
        </div>

        <span className="hidden flex-col items-end text-lg text-stone-400 md:flex">
          <p>{formatRelativeTime(track.playEndTime)}</p>
          <p>{formatDuration(millisecondsToSeconds(track.duration))}</p>
        </span>
      </div>
    </div>
  );
};

export default RecentlyPlayedTrack;
