import type {
  RawSpotifyBaseObject,
  SpotifyBaseObject,
  SpotifyImage,
} from "@/domain/spotify/types";

export type RawSimplifiedArtist = RawSpotifyBaseObject & {
  type: "artist";
  name: string;
};

export type SimplifiedArtist = SpotifyBaseObject & {
  name: string;
};

export type RawArtist = RawSimplifiedArtist & {
  images: SpotifyImage[];
  genres: string[];
  popularity: number;
  followers: {
    href: null;
    total: number;
  };
};

export type Artist = SimplifiedArtist & {
  images: SpotifyImage[];
  genres: string[];
};
