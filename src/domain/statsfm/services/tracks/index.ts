import statsfmFetch from "@/lib/statsfm-client";

import { transformRawRecentTrackToRecentTrack } from "./transform";
import { RawRecentlyPlayedTracksResponse, RecentlyPlayedTrack } from "./types";

export const getRecentlyPlayedTracks = async (): Promise<
  RecentlyPlayedTrack[]
> => {
  const { items } = await statsfmFetch<RawRecentlyPlayedTracksResponse>(
    "/streams/recent"
  );

  return items.map((item) => transformRawRecentTrackToRecentTrack(item));
};
