import { createMissingArtists } from "@/domain/spotify/services/artist";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import spotifyApiClientInstance from "@/lib/spotify-client";

import { transformRawTrackToTrack } from "./transform";
import { RawTrack, Track } from "./types";

export const getTrack = async (trackId: string): Promise<Track> => {
  logger.info(`[TRACK] Getting track with id ${trackId}`);

  const response = await spotifyApiClientInstance.fetch<RawTrack>(
    `/tracks/${trackId}`
  );

  if (response.kind === "error") {
    throw new Error(response.error.message);
  }

  return transformRawTrackToTrack(response.data);
};

export const saveTrack = async ({
  id,
  name,
  durationMs,
  explicit,
  albumId,
  discNumber,
  trackNumber,
  previewUrl,
  artists: simplifiedArtists,
}: Track) => {
  logger.info(`[TRACK] Saving track with id ${id} (${name})`);

  const track = await prisma.tracks.upsert({
    where: { id },
    create: {
      id,
      name,
      duration: durationMs,
      explicit,
      projectId: albumId,
      discNumber,
      trackNumber,
      audioPreviewUrl: previewUrl,
    },
    update: {},
  });

  const artistIds = simplifiedArtists.map(({ id: artistId }) => artistId);

  await createMissingArtists(artistIds);

  const existingTrackArtistIds = (
    await prisma.trackArtists.findMany({
      where: {
        trackId: id,
        artistId: { in: artistIds },
      },
      select: { artistId: true },
    })
  ).map(({ artistId }) => artistId);

  await prisma.trackArtists.createMany({
    data: artistIds
      .filter((artistId) => !existingTrackArtistIds.includes(artistId))
      .map((artistId) => ({
        trackId: id,
        artistId,
      })),
  });

  return track;
};
