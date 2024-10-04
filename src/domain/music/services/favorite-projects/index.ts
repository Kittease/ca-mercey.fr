import prisma from "@/lib/prisma";

import { transformRawFavoriteProjectsToFavoriteProjects } from "./transform";
import {
  FavoriteProject,
  FavoriteProjectsOrderBy,
  FavoriteProjectsOrderDirection,
} from "./types";

export const addFavoriteProject = async (projectId: string) => {
  await prisma.favoriteProjects.create({
    data: { projectId },
  });
};

export const removeFavoriteProject = async (projectId: string) => {
  await prisma.favoriteProjects.delete({
    where: { projectId },
  });
};

export const getFavoriteProjects = async (
  orderBy: FavoriteProjectsOrderBy,
  direction?: FavoriteProjectsOrderDirection
): Promise<FavoriteProject[]> => {
  const rawProjects = await prisma.projects.findMany({
    where: { FavoriteProjects: { some: {} } },
    include: {
      artists: { include: { artist: true } },
      tracks: true,
    },
    orderBy:
      orderBy === "date"
        ? [
            { releaseYear: direction ?? "desc" },
            { releaseMonth: direction ?? "desc" },
            { releaseDay: direction ?? "desc" },
          ]
        : { name: "asc" },
  });

  const projects = transformRawFavoriteProjectsToFavoriteProjects(rawProjects);

  switch (orderBy) {
    case "date": {
      return projects;
    }

    case "name": {
      return projects.sort(
        (a, b) =>
          a.name.localeCompare(b.name, undefined, {
            sensitivity: "base",
          }) * (direction === "desc" ? -1 : 1)
      );
    }

    case "artist": {
      return projects.sort(
        (a, b) =>
          a.artists[0].name.localeCompare(b.artists[0].name, undefined, {
            sensitivity: "base",
          }) * (direction === "desc" ? -1 : 1)
      );
    }

    case "duration": {
      const projectDurations: Record<string, number> = {};
      projects.forEach((project) => {
        projectDurations[project.id] = project.tracks.reduce(
          (acc, track) => acc + track.duration,
          0
        );
      });

      return projects.sort(
        (a, b) =>
          (projectDurations[a.id] - projectDurations[b.id]) *
          (direction === "desc" ? -1 : 1)
      );
    }

    default:
      throw new Error(`Unreachable orderBy: ${orderBy satisfies never}`);
  }
};

export const getRandomCovers = async (count: number) => {
  const projectCovers = (
    await prisma.$queryRaw<{ cover_url: string }[]>`
      SELECT projects.cover_url
      FROM music.favorite_projects
      LEFT JOIN music.projects ON favorite_projects.project_id = projects.id
      WHERE cover_url IS NOT NULL
      ORDER BY RANDOM()
      LIMIT ${count};
  `
  ).map(({ cover_url }) => cover_url);

  if (projectCovers.length === count) {
    return projectCovers;
  }

  const initCovers = [...projectCovers];

  while (projectCovers.length < count) {
    projectCovers.push(
      projectCovers[Math.floor(Math.random() * initCovers.length)]
    );
  }

  return projectCovers;
};
