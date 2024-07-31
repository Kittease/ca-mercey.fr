import LastMonthStats from "./_components/last-month-statistics";
import RecentlyPlayedTracks from "./_components/recently-played-tracks";

// Revalidate the page cache every 5 minutes
export const dynamic = "force-dynamic";
export const revalidate = 300;

const MusicPage = () => {
  return (
    <div className="flex w-full flex-col gap-y-8 p-8 md:w-fit md:gap-y-16 md:px-0 md:py-24">
      <h1 className="my-4 text-center text-4xl md:my-0 md:text-8xl">Musique</h1>

      <LastMonthStats />

      <RecentlyPlayedTracks />
    </div>
  );
};

export default MusicPage;
