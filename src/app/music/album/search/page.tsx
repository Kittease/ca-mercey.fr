import { searchAlbums } from "@/domain/spotify/services/album";
import { SearchResult } from "@/domain/spotify/services/album/types";
import logger from "@/lib/logger";

import Results from "./_components/results";
import SearchBar from "./_components/search-bar";

interface AlbumSearchProps {
  searchParams?: {
    query?: string;
  };
}

const AlbumSearch = async ({ searchParams }: AlbumSearchProps) => {
  let searchResults: SearchResult[] | null = null;
  if (searchParams?.query) {
    try {
      searchResults = await searchAlbums(searchParams.query);
    } catch (error) {
      logger.error(error);
      searchResults = null;
    }
  }

  return (
    <div className="flex w-4/5 flex-col gap-y-16 px-32 py-16">
      <SearchBar />

      {searchResults !== null ? (
        <Results
          searchResults={searchResults}
          searchTerms={searchParams?.query ?? ""}
        />
      ) : null}
    </div>
  );
};

export default AlbumSearch;
