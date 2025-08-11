import { Artists, ProjectArtists, Projects, Tracks } from "@prisma/client";

export const favoriteProjectsOrderBy = [
  "date",
  "name",
  "artist",
  "duration",
] as const;
export type FavoriteProjectsOrderBy = (typeof favoriteProjectsOrderBy)[number];

export const favoriteProjectsOrderDirection = ["asc", "desc"] as const;
export type FavoriteProjectsOrderDirection =
  (typeof favoriteProjectsOrderDirection)[number];

export type RawFavoriteProject = Projects & {
  artists: ({
    artist: Artists;
  } & ProjectArtists)[];
  tracks: Tracks[];
};

export type FavoriteProject = {
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
  tracks: {
    id: string;
    name: string;
    duration: number;
    explicit: boolean;
    projectId: string;
    discNumber: number;
    trackNumber: number;
    audioPreviewUrl: string | null;
  }[];
};
