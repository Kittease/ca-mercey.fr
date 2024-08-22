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
  let prismaOrderBy: NonNullable<
    Parameters<typeof prisma.projects.findMany>[0]
  >["orderBy"] = [];

  if (orderBy === "date") {
    prismaOrderBy = [
      { releaseYear: direction ?? "desc" },
      { releaseMonth: direction ?? "desc" },
      { releaseDay: direction ?? "desc" },
    ];
  }

  const rawProjects = await prisma.projects.findMany({
    where: { FavoriteProjects: { some: {} } },
    include: {
      artists: { include: { artist: true } },
      tracks: true,
    },
    orderBy: prismaOrderBy,
  });

  const projects = transformRawFavoriteProjectsToFavoriteProjects(rawProjects);

  if (orderBy === "name") {
    const sortedProjectIds = (
      await prisma.$queryRaw<{ id: string }[]>`
        SELECT projects.id
        FROM music.favorite_projects
        LEFT JOIN music.projects ON music.favorite_projects.project_id = music.projects.id
        ORDER BY music.unaccent(LOWER(projects.name)) ASC;
      `
    ).map(({ id }) => id);

    const sortedProjects = sortedProjectIds.map(
      (projectId) => projects.find(({ id }) => id === projectId)!
    );

    if (direction === "desc") {
      return sortedProjects.reverse();
    }

    return sortedProjects;
  }

  if (orderBy === "artist") {
    return projects.sort((a, b) => {
      if (
        a.artists[0].name.toLocaleLowerCase() >
        b.artists[0].name.toLocaleLowerCase()
      ) {
        if (direction === "desc") {
          return -1;
        }
        return 1;
      }

      if (direction === "desc") {
        return 1;
      }
      return -1;
    });
  }

  return projects;
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
