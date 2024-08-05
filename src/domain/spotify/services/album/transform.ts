import { transformRawSimplifiedArtistToSimplifiedArtist } from "@/domain/spotify/services/artist/transform";
import { transformRawSimplifiedTrackToSimplifiedTrack } from "@/domain/spotify/services/track/transform";
import { transformRawSpotifyBaseObjectToSpotifyBaseObject } from "@/domain/spotify/transform";
import { getAlbumReleaseDateObject } from "@/domain/spotify/utils";

import { Album, RawAlbum, RawSimplifiedAlbum, SimplifiedAlbum } from "./types";

export const transformRawSimplifiedAlbumToSimplifiedAlbum = ({
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/naming-convention
  type,
  album_type,
  artists,
  total_tracks,
  release_date,
  release_date_precision,
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/naming-convention
  available_markets,
  // eslint-disable-next-line unused-imports/no-unused-vars, @typescript-eslint/naming-convention
  restrictions,
  ...rest
}: RawSimplifiedAlbum): SimplifiedAlbum => {
  const { year, month, day } = getAlbumReleaseDateObject(
    release_date,
    release_date_precision
  );

  return transformRawSpotifyBaseObjectToSpotifyBaseObject({
    albumType: album_type,
    artists: artists.map((artist) =>
      transformRawSimplifiedArtistToSimplifiedArtist(artist)
    ),
    totalTracks: total_tracks,
    releaseYear: year,
    releaseMonth: month,
    releaseDay: day,
    ...rest,
  });
};

export const transformRawAlbumToAlbum = ({
  tracks,
  genres,
  label,
  ...simplifiedAlbum
}: RawAlbum): Album => ({
  tracks: tracks.items.map((track) =>
    transformRawSimplifiedTrackToSimplifiedTrack(track)
  ),
  genres,
  label,
  ...transformRawSimplifiedAlbumToSimplifiedAlbum(simplifiedAlbum),
});
