import prisma from "@/lib/prisma";

export const saveGenres = async (genres: string[]) => {
  const existingGenreRecords = await prisma.genres.findMany({
    where: {
      name: {
        in: genres,
      },
    },
  });

  const newGenreRecords = await prisma.genres.createManyAndReturn({
    data: genres
      .filter(
        (genre) => !existingGenreRecords.some(({ name }) => name === genre)
      )
      .map((genre) => ({ name: genre })),
  });

  return [...existingGenreRecords, ...newGenreRecords];
};
