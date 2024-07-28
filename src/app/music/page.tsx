import LastMonthStats from "./_components/last-month-statistics";
import RecentlyPlayedTracks from "./_components/recently-played-tracks";

const MusicPage = () => {
  return (
    <div className="flex flex-col gap-y-16 py-24">
      <h1 className="text-center text-8xl">Musique</h1>

      <LastMonthStats />

      <RecentlyPlayedTracks />
    </div>
  );
};

export default MusicPage;
