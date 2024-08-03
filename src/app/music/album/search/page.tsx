import { searchAlbums } from "@/domain/spotify/services/album";
import { SimplifiedAlbum } from "@/domain/spotify/services/album/types";

import Results from "./_components/results";
import SearchBar from "./_components/search-bar";

interface AlbumSearchProps {
  searchParams?: {
    query?: string;
  };
}

const AlbumSearch = async ({ searchParams }: AlbumSearchProps) => {
  let albums: SimplifiedAlbum[] | null = null;
  if (searchParams?.query) {
    try {
      albums = await searchAlbums(searchParams.query);
    } catch (error) {
      albums = null;
    }
  }

  return (
    <div className="flex w-4/5 flex-col gap-y-16 px-32 py-16">
      <SearchBar />

      {albums !== null ? (
        <Results albums={albums} searchTerms={searchParams?.query ?? ""} />
      ) : null}
    </div>
  );
};

export default AlbumSearch;
