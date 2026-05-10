import { transformRawSimplifiedArtistToSimplifiedArtist } from "@/domain/spotify/services/artist/transform";
import { transformRawSpotifyBaseObjectToSpotifyBaseObject } from "@/domain/spotify/transform";

import { RawSimplifiedTrack, RawTrack, SimplifiedTrack, Track } from "./types";

export const transformRawSimplifiedTrackToSimplifiedTrack = ({
  duration_ms,
  disc_number,
  track_number,
  preview_url,
  artists,
  // eslint-disable-next-line unused-imports/no-unused-vars
  type,
  // eslint-disable-next-line unused-imports/no-unused-vars
  available_markets,
  // eslint-disable-next-line unused-imports/no-unused-vars
  linked_from,
  // eslint-disable-next-line unused-imports/no-unused-vars
  restrictions,
  // eslint-disable-next-line unused-imports/no-unused-vars
  is_local,
  // eslint-disable-next-line unused-imports/no-unused-vars
  is_playable,
  ...rest
}: RawSimplifiedTrack): SimplifiedTrack =>
  transformRawSpotifyBaseObjectToSpotifyBaseObject({
    durationMs: duration_ms,
    discNumber: disc_number,
    trackNumber: track_number,
    previewUrl: preview_url,
    artists: artists.map((artist) =>
      transformRawSimplifiedArtistToSimplifiedArtist(artist),
    ),
    ...rest,
  });

export const transformRawTrackToTrack = ({
  album,
  // eslint-disable-next-line unused-imports/no-unused-vars
  popularity,
  // eslint-disable-next-line unused-imports/no-unused-vars
  external_ids,
  ...rest
}: RawTrack): Track => ({
  albumId: album.id,
  ...transformRawSimplifiedTrackToSimplifiedTrack(rest),
});
