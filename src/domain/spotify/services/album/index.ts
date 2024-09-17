import { ProjectType } from "@prisma/client";

import { createMissingArtists } from "@/domain/spotify/services/artist";
import { saveGenres } from "@/domain/spotify/services/genre";
import { getTrack, saveTrack } from "@/domain/spotify/services/track";
import { getHighestDefinitionSpotifyImage } from "@/domain/spotify/utils";
import { FetchTags } from "@/lib/cache/types";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import spotifyApiClientInstance from "@/lib/spotify-client";

import {
  transformRawAlbumToAlbum,
  transformRawSimplifiedAlbumToSimplifiedAlbum,
} from "./transform";
import { Album, RawAlbum, SearchAlbumsResponse, SearchResult } from "./types";

export const getAlbum = async (albumId: string): Promise<Album> => {
  logger.info(`[ALBUM] Getting album with id ${albumId}`);

  const response = await spotifyApiClientInstance.fetch<RawAlbum>(
    `/albums/${albumId}`
  );

  if (response.kind === "error") {
    throw new Error(response.error.message);
  }

  return transformRawAlbumToAlbum(response.data);
};

export const saveAlbum = async ({
  id,
  name,
  albumType,
  artists: simplifiedArtists,
  tracks,
  images,
  genres,
  releaseYear,
  releaseMonth,
  releaseDay,
}: Album) => {
  logger.info(`[ALBUM] Saving album with id ${id} (${name})`);

  let type: ProjectType;
  switch (albumType) {
    case "album":
      type = "ALBUM";
      break;
    case "compilation":
      type = "COMPILATION";
      break;
    case "single":
      type = "SINGLE";
      break;
    default:
      throw new Error("Unknow album type");
  }

  const project = await prisma.projects.upsert({
    where: { id },
    create: {
      id,
      name,
      type,
      coverUrl: getHighestDefinitionSpotifyImage(images)?.url,
      releaseYear,
      releaseMonth,
      releaseDay,
    },
    update: {},
  });

  const artistIds = simplifiedArtists.map(({ id: artistId }) => artistId);

  await createMissingArtists(artistIds);

  const existingProjectArtistIds = (
    await prisma.projectArtists.findMany({
      where: {
        projectId: id,
        artistId: { in: artistIds },
      },
      select: { artistId: true },
    })
  ).map(({ artistId }) => artistId);

  await prisma.projectArtists.createMany({
    data: artistIds
      .filter((artistId) => !existingProjectArtistIds.includes(artistId))
      .map((artistId) => ({
        projectId: id,
        artistId,
      })),
  });

  const genreRecords = await saveGenres(genres);

  const existingProjectGenreIds = (
    await prisma.projectGenres.findMany({
      where: {
        projectId: id,
        genreId: { in: genreRecords.map(({ id: genreId }) => genreId) },
      },
      select: { genreId: true },
    })
  ).map(({ genreId }) => genreId);

  await prisma.projectGenres.createMany({
    data: genreRecords
      .filter(({ id: genreId }) => !existingProjectGenreIds.includes(genreId))
      .map(({ id: genreId }) => ({
        projectId: id,
        genreId,
      })),
  });

  const existingTrackIds = (
    await prisma.tracks.findMany({
      where: { id: { in: tracks.map(({ id: trackId }) => trackId) } },
      select: { id: true },
    })
  ).map(({ id: trackId }) => trackId);

  const tracksToCreate = tracks.filter(
    ({ id: trackId }) => !existingTrackIds.includes(trackId)
  );

  // eslint-disable-next-line no-restricted-syntax
  for await (const { id: trackId } of tracksToCreate) {
    const track = await getTrack(trackId);

    // The track can come from another album, make sure it is created before saving the track
    if (track.albumId !== id) {
      const trackAlbum = await getAlbum(track.albumId);
      await saveAlbum(trackAlbum);
    }

    await saveTrack(track);
  }

  return project;
};

export const searchAlbums = async (search: string): Promise<SearchResult[]> => {
  let albumId: string | null = null;

  // Is search term an album link?
  try {
    const url = new URL(search);

    if (
      url.hostname === "open.spotify.com" &&
      url.pathname.startsWith("/album/")
    ) {
      albumId = url.pathname.replace("/album/", "");
    }
  } catch {
    // Search term is not an album URL
  }

  // Does search term looks like an album ID?
  if (albumId === null && /^[A-Za-z0-9]{22}$/.test(search)) {
    albumId = search;
  }

  if (albumId !== null) {
    try {
      const album = await getAlbum(albumId);

      const favorite = await prisma.favoriteProjects.findUnique({
        where: { projectId: albumId },
      });

      return [{ album, isFavorite: favorite !== null }];
    } catch {
      // Search term was probably not an album ID, return search results instead
    }
  }

  const response = await spotifyApiClientInstance.fetch<SearchAlbumsResponse>(
    `/search?type=album&q=${search}`,
    { next: { tags: [FetchTags.SpotifyAlbumSearch] } }
  );

  if (response.kind === "error") {
    throw new Error(response.error.message);
  }

  const searchResultAlbumIds = response.data.albums.items.map(({ id }) => id);

  const albumAlreadyFavedIds = (
    await prisma.favoriteProjects.findMany({
      where: { projectId: { in: searchResultAlbumIds } },
      select: { projectId: true },
    })
  ).map(({ projectId }) => projectId);

  return response.data.albums.items.map((album) => ({
    album: transformRawSimplifiedAlbumToSimplifiedAlbum(album),
    isFavorite: albumAlreadyFavedIds.includes(album.id),
  }));
};
