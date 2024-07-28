import { millisecondsToMinutes } from "date-fns";
import {
  AudioLines,
  DiscAlbum,
  ListMusic,
  Timer,
  UserRound,
} from "lucide-react";

import { getStatistics } from "@/domain/statsfm/services/statistics";
import { formatNumber } from "@/lib/math";

import Statistic from "./statistic";

const LastMonthStats = async () => {
  const statistics = await getStatistics();

  return (
    <div className="flex flex-col gap-y-6 rounded-xl border border-stone-600 bg-gradient-to-br from-stone-900/80 to-stone-900/40 p-8 backdrop-blur-md md:gap-y-12 md:px-16 md:py-12">
      <h2 className="text-lg md:text-2xl">
        Statistiques sur les 30 derniers jours (vs 12 derniers mois)
      </h2>

      <div className="flex grid-cols-3 flex-col gap-x-16 gap-y-6 md:grid md:gap-y-12">
        <Statistic
          label="Nombre d'écoutes"
          stat={formatNumber(statistics.count.value)}
          diff={statistics.count.diff}
          Icon={AudioLines}
        />

        <Statistic
          label="Minutes écoutées"
          stat={formatNumber(millisecondsToMinutes(statistics.duration.value))}
          diff={statistics.duration.diff}
          Icon={Timer}
        />

        <Statistic
          label="Titres différents"
          stat={formatNumber(statistics.tracks.value)}
          diff={statistics.tracks.diff}
          Icon={ListMusic}
          className="col-start-1"
        />

        <Statistic
          label="Artistes différents"
          stat={formatNumber(statistics.artists.value)}
          diff={statistics.artists.diff}
          Icon={UserRound}
        />

        <Statistic
          label="Albums différents"
          stat={formatNumber(statistics.albums.value)}
          diff={statistics.albums.diff}
          Icon={DiscAlbum}
        />
      </div>
    </div>
  );
};

export default LastMonthStats;
