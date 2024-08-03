export type RawSimplifiedArtist = {
  id: string;
  type: "artist";
  name: string;
  href: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
};

export type SimplifiedArtist = Omit<RawSimplifiedArtist, "external_urls"> & {
  externalUrls: RawSimplifiedArtist["external_urls"];
};
