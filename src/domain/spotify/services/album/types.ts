import {
  RawSimplifiedArtist,
  SimplifiedArtist,
} from "@/domain/spotify/services/artist/types";
import { SpotifyImage } from "@/domain/spotify/types";

export type RawSimplifiedAlbum = {
  id: string;
  type: "album";
  album_type: "album" | "single" | "compilation";
  name: string;
  artists: RawSimplifiedArtist[];
  images: SpotifyImage[];
  total_tracks: number;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  available_markets: string[];
  restrictions: {
    reasons: string;
  };
  href: string;
  uri: string;
  external_urls: {
    spotify: string;
  };
};

export type SimplifiedAlbum = Omit<
  RawSimplifiedAlbum,
  | "album_type"
  | "artists"
  | "total_tracks"
  | "release_date"
  | "release_date_precision"
  | "available_markets"
  | "external_urls"
> & {
  albumType: RawSimplifiedAlbum["album_type"];
  artists: SimplifiedArtist[];
  totalTracks: RawSimplifiedAlbum["total_tracks"];
  releaseDate: RawSimplifiedAlbum["release_date"];
  releaseDatePrecision: RawSimplifiedAlbum["release_date_precision"];
  availableMarkets: RawSimplifiedAlbum["available_markets"];
  externalUrls: RawSimplifiedAlbum["external_urls"];
};
