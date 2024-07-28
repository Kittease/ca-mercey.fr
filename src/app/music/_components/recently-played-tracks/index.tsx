import { getRecentlyPlayedTracks } from "@/domain/statsfm/services/tracks";

import RecentlyPlayedTrack from "./recently-played-track";

const RecentlyPlayedTracks = async () => {
  const recentlyPlayedTracks = await getRecentlyPlayedTracks();

  return (
    <div className="flex flex-col gap-y-12 rounded-xl border border-stone-600 bg-gradient-to-tr from-stone-900/80 to-stone-900/40 px-16 py-12 backdrop-blur-md">
      <h2 className="text-2xl">Les derniers titres écoutés</h2>

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
