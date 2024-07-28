import { RawRecentlyPlayedTrack, RecentlyPlayedTrack } from "./types";

export const transformRawRecentlyPlayedTrackToRecentlyPlayedTrack = ({
  track,
  durationMs,
  endTime,
}: RawRecentlyPlayedTrack): RecentlyPlayedTrack => ({
  id: track.externalIds.spotify[0],
  name: track.name,
  artist: track.artists[0].name,
  album: track.albums[0].name,
  image: track.albums[0].image,
  duration: durationMs,
  playEndTime: new Date(endTime),
});
