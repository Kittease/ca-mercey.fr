import { searchAlbums } from "@/domain/spotify/services/album";
import { SearchResult } from "@/domain/spotify/services/album/types";
import logger from "@/lib/logger";
import { cn } from "@/lib/tailwind";

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
    <div
      className={cn(
        "flex flex-col",
        "w-full gap-y-12 p-12",
        "sm:w-4/5 sm:gap-y-16 sm:px-32 sm:py-16"
      )}
    >
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
