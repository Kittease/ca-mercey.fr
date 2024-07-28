import { millisecondsToSeconds } from "date-fns";
import Image from "next/image";

import { RecentlyPlayedTrack as RecentlyPlayedTrackType } from "@/domain/statsfm/services/tracks/types";
import { formatDuration, formatRelativeTime } from "@/lib/date";

interface RecentlyPlayedTrackProps {
  track: RecentlyPlayedTrackType;
}

const RecentlyPlayedTrack = ({ track }: RecentlyPlayedTrackProps) => {
  return (
    <div className="flex flex-row gap-x-6">
      <Image
        src={track.image}
        alt={track.album}
        width={768}
        height={768}
        className="w-16"
      />

      <div className="flex w-full flex-row justify-between">
        <div className="flex flex-col">
          <p className="text-2xl">{track.name}</p>

          <p className="flex flex-row gap-x-2 text-lg text-stone-400">
            <span>{track.artist}</span>
            <span>-</span>
            <span>{track.album}</span>
          </p>
        </div>

        <span className="flex flex-col items-end text-lg text-stone-400">
          <p>{formatRelativeTime(track.playEndTime)}</p>
          <p>{formatDuration(millisecondsToSeconds(track.duration))}</p>
        </span>
      </div>
    </div>
  );
};

export default RecentlyPlayedTrack;
