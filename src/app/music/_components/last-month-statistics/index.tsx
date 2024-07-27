import { millisecondsToMinutes } from "date-fns";

import { getStatistics } from "@/domain/statsfm/services/statistics";
import { formatNumber } from "@/lib/math";

import Statistic from "./statistic";

const LastMonthStats = async () => {
  const statistics = await getStatistics();

  return (
    <div className="flex flex-col gap-y-12 rounded-xl border border-stone-600 bg-gradient-to-br from-stone-900/80 to-stone-900/40 px-16 py-12 backdrop-blur-md">
      <h2 className="text-2xl">
        Statistiques sur les 30 derniers jours (vs 12 derniers mois)
      </h2>

      <div className="grid grid-cols-4 gap-x-16 gap-y-12">
        <Statistic
          label="Nombre d'écoutes"
          stat={formatNumber(statistics.count.value)}
          diff={statistics.count.diff}
          className="col-start-1"
        />

        <Statistic
          label="Minutes écoutées"
          stat={formatNumber(millisecondsToMinutes(statistics.duration.value))}
          diff={statistics.duration.diff}
        />

        <Statistic
          label="Titres différents"
          stat={formatNumber(statistics.tracks.value)}
          diff={statistics.tracks.diff}
          className="col-start-1"
        />

        <Statistic
          label="Artistes différents"
          stat={formatNumber(statistics.artists.value)}
          diff={statistics.artists.diff}
        />

        <Statistic
          label="Albums différents"
          stat={formatNumber(statistics.albums.value)}
          diff={statistics.albums.diff}
        />
      </div>
    </div>
  );
};

export default LastMonthStats;
