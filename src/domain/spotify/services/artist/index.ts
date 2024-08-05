import { saveGenres } from "@/domain/spotify/services/genre";
import { getHighestDefinitionSpotifyImage } from "@/domain/spotify/utils";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import spotifyApiClientInstance from "@/lib/spotify-client";

import { transformRawArtistToArtist } from "./transform";
import { Artist, RawArtist } from "./types";

export const getArtist = async (artistId: string): Promise<Artist> => {
  logger.info(`[ARTIST] Getting artist with id ${artistId}`);

  const response = await spotifyApiClientInstance.fetch<RawArtist>(
    `/artists/${artistId}`
  );

  if (response.kind === "error") {
    throw new Error(response.error.message);
  }

  return transformRawArtistToArtist(response.data);
};

export const saveArtist = async ({ id, name, images, genres }: Artist) => {
  logger.info(`[ARTIST] Saving artist with id ${id} (${name})`);

  const artist = await prisma.artists.upsert({
    where: { id },
    create: {
      id,
      name,
      profilePictureUrl: getHighestDefinitionSpotifyImage(images)?.url,
    },
    update: {},
  });

  const genreRecords = await saveGenres(genres);

  const existingArtistGenreIds = (
    await prisma.artistGenres.findMany({
      where: {
        artistId: id,
        genreId: { in: genreRecords.map(({ id: genreId }) => genreId) },
      },
      select: { genreId: true },
    })
  ).map(({ genreId }) => genreId);

  await prisma.artistGenres.createMany({
    data: genreRecords
      .filter(({ id: genreId }) => !existingArtistGenreIds.includes(genreId))
      .map(({ id: genreId }) => ({
        artistId: id,
        genreId,
      })),
  });

  return artist;
};

export const createMissingArtists = async (artistIds: string[]) => {
  const existingArtistIds = (
    await prisma.artists.findMany({
      where: { id: { in: artistIds } },
      select: { id: true },
    })
  ).map(({ id }) => id);

  const artistIdsToCreate = artistIds.filter(
    (id) => !existingArtistIds.includes(id)
  );

  // eslint-disable-next-line no-restricted-syntax
  for await (const id of artistIdsToCreate) {
    const artist = await getArtist(id);
    await saveArtist(artist);
  }
};
