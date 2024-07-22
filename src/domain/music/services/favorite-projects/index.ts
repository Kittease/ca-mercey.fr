import prisma from "@/lib/prisma";

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
