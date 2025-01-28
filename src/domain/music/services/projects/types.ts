import {
  Artists,
  ProjectArtists,
  Projects,
  TrackArtists,
  Tracks,
} from "@prisma/client";

export type RawProject = Projects & {
  artists: ({
    artist: Artists;
  } & ProjectArtists)[];
  tracks: ({
    artists: ({
      artist: Artists;
    } & TrackArtists)[];
  } & Tracks)[];
};

export type ProjectTrack = {
  id: string;
  name: string;
  duration: number;
  explicit: boolean;
  projectId: string;
  discNumber: number;
  trackNumber: number;
  artists: {
    id: string;
    name: string;
    profilePictureUrl: string | null;
  }[];
  audioPreviewUrl: string | null;
};

export type Project = {
  id: string;
  name: string;
  type: "ALBUM" | "COMPILATION" | "SINGLE";
  coverUrl: string | null;
  releaseYear: string;
  releaseMonth: string | null;
  releaseDay: string | null;
  artists: {
    id: string;
    name: string;
    profilePictureUrl: string | null;
  }[];
  tracks: ProjectTrack[];
};
