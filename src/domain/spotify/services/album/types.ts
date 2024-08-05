import type {
  RawSimplifiedArtist,
  SimplifiedArtist,
} from "@/domain/spotify/services/artist/types";
import type {
  RawSimplifiedTrack,
  SimplifiedTrack,
} from "@/domain/spotify/services/track/types";
import type {
  SpotifyImage,
  SpotifyPaginatedApiResponse,
  SpotifyAvailableMarkets,
  SpotifyRestrictions,
  RawSpotifyBaseObject,
  SpotifyBaseObject,
} from "@/domain/spotify/types";

export type SearchAlbumsResponse = {
  albums: SpotifyPaginatedApiResponse<RawSimplifiedAlbum>;
};

export type RawSimplifiedAlbum = RawSpotifyBaseObject & {
  type: "album";
  album_type: "album" | "single" | "compilation";
  name: string;
  artists: RawSimplifiedArtist[];
  images: SpotifyImage[];
  total_tracks: number;
  release_date: string;
  release_date_precision: "year" | "month" | "day";
  available_markets: SpotifyAvailableMarkets;
  restrictions?: SpotifyRestrictions;
};

export type SimplifiedAlbum = SpotifyBaseObject & {
  albumType: "album" | "single" | "compilation";
  name: string;
  artists: SimplifiedArtist[];
  images: SpotifyImage[];
  totalTracks: number;
  releaseYear: string;
  releaseMonth?: string;
  releaseDay?: string;
};

export type RawAlbum = RawSimplifiedAlbum & {
  tracks: SpotifyPaginatedApiResponse<RawSimplifiedTrack>;
  genres: string[];
  label: string;
  popularity: number;
  copyrights: {
    type: "C" | "P";
    text: string;
  }[];
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
};

export type Album = SimplifiedAlbum & {
  tracks: SimplifiedTrack[];
  genres: string[];
  label: string;
};

export type SearchResult = {
  album: SimplifiedAlbum;
  isFavorite: boolean;
};
