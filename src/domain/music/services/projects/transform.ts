import { Project, RawProject } from "./types";

export const transformRawProjectToProject = ({
  artists,
  tracks,
  ...projectRest
}: RawProject): Project => ({
  ...projectRest,
  artists: artists.map(({ artist }) => artist),
  tracks: tracks.map((track) => ({
    ...track,
    artists: track.artists.map(({ artist }) => artist),
  })),
});

export const transformRawProjectsToProjects = (
  rawProjects: RawProject[]
): Project[] =>
  rawProjects.map((rawProject) => transformRawProjectToProject(rawProject));
