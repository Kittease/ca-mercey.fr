import logger from "@/lib/logger";
import prisma from "@/lib/prisma";

import { transformRawProjectToProject } from "./transform";

export const getProject = async (projectId: string) => {
  const rawProject = await prisma.projects.findUnique({
    where: { id: projectId },
    include: {
      artists: { include: { artist: true } },
      tracks: {
        include: { artists: { include: { artist: true } } },
        orderBy: [{ discNumber: "asc" }, { trackNumber: "asc" }],
      },
    },
  });

  if (!rawProject) {
    throw new Error(`Unkwnown project id ${projectId}`);
  }

  logger.info(rawProject);

  return transformRawProjectToProject(rawProject);
};
