import { transformRawSimplifiedArtistToSimplifiedArtist } from "@/domain/spotify/services/artist/transform";

import { RawSimplifiedAlbum, SimplifiedAlbum } from "./types";

export const transformRawSimplifiedAlbumToSimplifiedAlbum = ({
  album_type,
  artists,
  total_tracks,
  release_date,
  release_date_precision,
  available_markets,
  external_urls,
  ...rest
}: RawSimplifiedAlbum): SimplifiedAlbum => ({
  albumType: album_type,
  artists: artists.map((artist) =>
    transformRawSimplifiedArtistToSimplifiedArtist(artist)
  ),
  totalTracks: total_tracks,
  releaseDate: release_date,
  releaseDatePrecision: release_date_precision,
  availableMarkets: available_markets,
  externalUrls: external_urls,
  ...rest,
});
