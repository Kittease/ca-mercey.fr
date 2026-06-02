import { BookImageIcon } from "lucide-react";

import { Album } from "@/domain/photography/services/albums/types";

interface AlbumRowProps {
  album: Album;
}

const AlbumRow = ({ album }: AlbumRowProps) => {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      {album.coverThumbnailSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={album.coverThumbnailSrc}
          alt=""
          width={40}
          height={40}
          className="size-10 shrink-0 object-cover"
        />
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
