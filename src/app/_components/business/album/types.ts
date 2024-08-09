import { HTMLAttributes } from "react";

import { SimplifiedAlbum } from "@/domain/spotify/services/album/types";

export type AlbumProps = HTMLAttributes<HTMLDivElement> & {
  album: SimplifiedAlbum;
} & (
    | {
        action: undefined;
      }
    | {
        action: {
          handler: VoidFunction;
          isPending: boolean;
        };
      }
  );
