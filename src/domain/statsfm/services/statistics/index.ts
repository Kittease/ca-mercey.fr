import { subDays } from "date-fns";

import statsfmFetch from "@/lib/statsfm-client";

import { RawStatisticsResponse, Statistics } from "./types";

const MONTH_DURATION = 30;
const YEAR_DURATION = 365;

const getDifference = (a: number, b: number): number =>
  Math.round((a / MONTH_DURATION / (b / YEAR_DURATION)) * 100 - 100);

export const getStatistics = async (): Promise<Statistics> => {
  const now = new Date();
  const aMonthAgo = subDays(now, MONTH_DURATION);
  const aYearAgo = subDays(now, YEAR_DURATION);

  const {
    items: {
      count,
      durationMs,
      cardinality: { tracks, artists, albums },
    },
  } = await statsfmFetch<RawStatisticsResponse>(
    `/streams/stats?after=${aMonthAgo.getTime()}&before=${now.getTime()}`
  );

  const lastYearStatistics = await statsfmFetch<RawStatisticsResponse>(
    `/streams/stats?after=${aYearAgo.getTime()}&before=${now.getTime()}`
  );

  return {
    count: {
      value: count,
      diff: getDifference(count, lastYearStatistics.items.count),
    },
    duration: {
      value: durationMs,
      diff: getDifference(durationMs, lastYearStatistics.items.durationMs),
    },
    tracks: {
      value: tracks,
      diff: getDifference(tracks, lastYearStatistics.items.cardinality.tracks),
    },
    artists: {
      value: artists,
      diff: getDifference(
        artists,
        lastYearStatistics.items.cardinality.artists
      ),
    },
    albums: {
      value: albums,
      diff: getDifference(albums, lastYearStatistics.items.cardinality.albums),
    },
  };
};
