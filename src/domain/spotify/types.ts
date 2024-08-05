export type SpotifyPaginatedApiResponse<T> = {
  items: T[];
  limit: number;
  offset: number;
  total: number;
  href: string;
  next: string | null;
  previous: string | null;
};

export type RawSpotifyBaseObject = {
  id: string;
  href: string;
  uri: string;
  external_urls: SpotifyExternalUrls;
};

export type SpotifyBaseObject = {
  id: string;
  href: string;
  uri: string;
  externalUrls: SpotifyExternalUrls;
};

export type SpotifyImage = {
  url: string;
  width: number;
  height: number;
};

export type SpotifyExternalUrls = {
  spotify: string;
};

export type SpotifyAvailableMarkets = string[];

export type SpotifyRestrictions = {
  reason: "market" | "product" | "explicit";
};
