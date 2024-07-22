import { getRandomCovers } from "@/domain/music/services/favorite-projects";

import LastMonthStats from "./_components/last-month-statistics";
import FavoriteProjectsButton from "./_components/page-button/favorite-projects";
import YearlyRestrospectivesButton from "./_components/page-button/yearly-restrospectives";
import RecentlyPlayedTracks from "./_components/recently-played-tracks";

// Revalidate the page cache every 5 minutes
export const dynamic = "force-dynamic";
export const revalidate = 300;

const MusicPage = async () => {
  const favoriteProjectCovers = await getRandomCovers(40);

  return (
    <div className="flex w-full flex-col gap-y-8 p-8 md:w-fit md:gap-y-16 md:px-0 md:py-24">
      <h1 className="my-4 text-center text-4xl md:my-0 md:text-8xl">Musique</h1>

      <LastMonthStats />

      <div className="grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
        <FavoriteProjectsButton covers={favoriteProjectCovers} />
        <YearlyRestrospectivesButton />
      </div>

      <RecentlyPlayedTracks />
    </div>
  );
};

export default MusicPage;
