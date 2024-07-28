import statsfmFetch from "@/lib/statsfm-client";

import { transformRawRecentlyPlayedTrackToRecentlyPlayedTrack } from "./transform";
import { RawRecentlyPlayedTracksResponse, RecentlyPlayedTrack } from "./types";

export const getRecentlyPlayedTracks = async (): Promise<
  RecentlyPlayedTrack[]
> => {
  const { items } = await statsfmFetch<RawRecentlyPlayedTracksResponse>(
    "/streams/recent"
  );

  return items.map((item) =>
    transformRawRecentlyPlayedTrackToRecentlyPlayedTrack(item)
  );
};
