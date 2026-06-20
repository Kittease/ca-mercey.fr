import { BookImageIcon } from "lucide-react";

import ProgressiveImage from "@/app/_components/ui/progressive-image";
import { Album } from "@/domain/photography/services/albums/types";

interface AlbumRowProps {
  album: Album;
}

const AlbumRow = ({ album }: AlbumRowProps) => {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      {album.coverThumbnailSrc ? (
        <span className="relative block size-10 shrink-0 overflow-hidden">
          <ProgressiveImage
            placeholder={album.coverPlaceholderUrl}
            src={album.coverThumbnailSrc}
            className="object-cover"
          />
        </span>
      ) : (
        <span className="flex size-10 shrink-0 items-center justify-center bg-muted text-muted-foreground">
          <BookImageIcon className="size-4" />
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block truncate font-medium">{album.name}</span>

        {album.description ? (
          <span className="block truncate text-xs text-muted-foreground">
            {album.description}
          </span>
        ) : null}
      </span>
    </span>
  );
};

export default AlbumRow;
