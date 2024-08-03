import AlbumLarge from "@/app/_components/business/album-large";
import AlbumSmall from "@/app/_components/business/small-album";
import { SimplifiedAlbum } from "@/domain/spotify/services/album/types";

interface ResultsProps {
  albums: SimplifiedAlbum[];
  searchTerms: string;
}

const Results = ({ albums, searchTerms }: ResultsProps) => {
  if (albums.length === 0) {
    return (
      <h1 className="text-4xl font-bold">
        Aucun résultat pour &quot;{searchTerms}&quot;.
      </h1>
    );
  }

  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold">Meilleur résultat</h1>

        <AlbumLarge album={albums[0]} canFavorite />
      </div>

      <div className="flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold">Autres albums</h1>

        <div className="flex flex-row gap-x-4 overflow-x-scroll">
          {albums.slice(1).map((album) => (
            <AlbumSmall key={album.id} album={album} canFavorite />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
