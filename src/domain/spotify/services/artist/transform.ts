import { transformRawSpotifyBaseObjectToSpotifyBaseObject } from "@/domain/spotify/transform";

import {
  Artist,
  RawArtist,
  RawSimplifiedArtist,
  SimplifiedArtist,
} from "./types";

export const transformRawSimplifiedArtistToSimplifiedArtist = ({
  // eslint-disable-next-line unused-imports/no-unused-vars
  type,
  ...rest
}: RawSimplifiedArtist): SimplifiedArtist =>
  transformRawSpotifyBaseObjectToSpotifyBaseObject(rest);

export const transformRawArtistToArtist = ({
  images,
  genres,
  // eslint-disable-next-line unused-imports/no-unused-vars
  popularity,
  // eslint-disable-next-line unused-imports/no-unused-vars
  followers,
  ...rest
}: RawArtist): Artist => ({
  images,
  genres,
  ...transformRawSimplifiedArtistToSimplifiedArtist(rest),
});
