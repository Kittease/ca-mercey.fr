import { HTMLAttributes } from "react";

import { SimplifiedAlbum } from "@/domain/spotify/services/album/types";

export type AlbumProps = HTMLAttributes<HTMLDivElement> & {
  album: SimplifiedAlbum;
  isFavorite?: boolean;
} & (
    | {
        action: undefined;
      }
    | {
        action: {
          handler: () => void | Promise<void>;
          state:
            | {
                pending: false;
              }
            | {
                pending: true;
                albumId: string;
              };
        };
      }
  );
