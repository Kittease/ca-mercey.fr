export type RawRecentlyPlayedTracksResponse = {
  items: RawRecentlyPlayedTrack[];
};

export type RawRecentlyPlayedTrack = {
  endTime: string;
  platform: "SPOTIFY"; // I don't know the key for Apple Music (:
  track: Track;
  albumId: number;
  albumReleaseId: number;
  trackReleaseId: number;
  contextId: string;
  durationMs: number;
};

type Track = {
  id: number;
  name: string;
  artists: Artist[];
  albums: Album[];
  durationMs: number;
  explicit: boolean;
  externalIds: {
    spotify: string[];
    appleMusic: string[];
  };
  spotifyPopularity: number;
  spotifyPreview: string;
  appleMusicPreview: string;
};

type Artist = {
  id: number;
  image: string;
  name: string;
};

type Album = {
  id: number;
  image: string;
  name: string;
};

export type RecentlyPlayedTrack = {
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  duration: number;
  playEndTime: Date;
};
