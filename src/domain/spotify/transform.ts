import { RawSpotifyBaseObject, SpotifyBaseObject } from "./types";

export const transformRawSpotifyBaseObjectToSpotifyBaseObject = <T>(
  obj: RawSpotifyBaseObject & T
): SpotifyBaseObject & T => {
  return {
    ...obj,
    externalUrls: obj.external_urls,
  };
};
