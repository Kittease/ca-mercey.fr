import { RawFavoriteProject } from "./types";

export const transformRawFavoriteProjectsToFavoriteProjects = (
  rawProjects: RawFavoriteProject[]
) =>
  rawProjects.map(({ artists, ...projectRest }) => ({
    ...projectRest,
    artists: artists.map(({ artist }) => artist),
  }));
