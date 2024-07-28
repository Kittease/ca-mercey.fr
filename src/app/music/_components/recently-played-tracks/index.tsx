import { getRecentlyPlayedTracks } from "@/domain/statsfm/services/tracks";

import RecentlyPlayedTrack from "./recently-played-track";

const RecentlyPlayedTracks = async () => {
  const recentlyPlayedTracks = await getRecentlyPlayedTracks();

  return (
    <div className="flex flex-col gap-y-6 rounded-xl border border-stone-600 bg-gradient-to-br from-stone-900/80 to-stone-900/40 p-8 backdrop-blur-md md:gap-y-12 md:px-16 md:py-12">
      <h2 className="text-lg md:text-2xl">Les derniers titres écoutés</h2>

      {recentlyPlayedTracks.map((recentlyPlayedTrack) => (
        <RecentlyPlayedTrack
          key={recentlyPlayedTrack.id}
          track={recentlyPlayedTrack}
        />
      ))}
    </div>
  );
};

export default RecentlyPlayedTracks;
