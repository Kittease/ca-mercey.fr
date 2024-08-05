import type {
  RawSimplifiedAlbum,
  SimplifiedAlbum,
} from "@/domain/spotify/services/album/types";
import type {
  RawSimplifiedArtist,
  SimplifiedArtist,
} from "@/domain/spotify/services/artist/types";
import type {
  SpotifyExternalUrls,
  SpotifyAvailableMarkets,
  SpotifyRestrictions,
  RawSpotifyBaseObject,
  SpotifyBaseObject,
} from "@/domain/spotify/types";

export type RawSimplifiedTrack = RawSpotifyBaseObject & {
  type: "track";
  name: string;
  duration_ms: number;
  explicit: boolean;
  disc_number: number;
  track_number: number;
  preview_url: string | null;
  artists: RawSimplifiedArtist[];
  available_markets: SpotifyAvailableMarkets;
  linked_from?: {
    id: string;
    type: "track";
    href: string;
    uri: string;
    external_urls: SpotifyExternalUrls;
  };
  restrictions?: SpotifyRestrictions;
  is_local: boolean;
  is_playable?: boolean;
};

export type SimplifiedTrack = SpotifyBaseObject & {
  name: string;
  durationMs: number;
  explicit: boolean;
  discNumber: number;
  trackNumber: number;
  previewUrl: string | null;
  artists: SimplifiedArtist[];
};

export type RawTrack = RawSimplifiedTrack & {
  album: RawSimplifiedAlbum;
  popularity: number;
  external_ids: {
    isrc?: string;
    ean?: string;
    upc?: string;
  };
};

export type Track = SimplifiedTrack & {
  albumId: SimplifiedAlbum["id"];
};
