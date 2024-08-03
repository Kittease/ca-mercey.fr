import { RawSimplifiedArtist, SimplifiedArtist } from "./types";

export const transformRawSimplifiedArtistToSimplifiedArtist = ({
  external_urls,
  ...rest
}: RawSimplifiedArtist): SimplifiedArtist => ({
  externalUrls: external_urls,
  ...rest,
});
