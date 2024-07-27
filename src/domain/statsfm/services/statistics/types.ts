export type RawStatisticsResponse = {
  items: {
    count: number; // streams
    durationMs: number; // minutes streamed
    playedMs: {
      percentiles: {
        values: {
          "1.0": number;
          "5.0": number;
          "25.0": number;
          "50.0": number;
          "75.0": number;
          "95.0": number;
          "99.0": number;
        };
      };
      count: number; // streams
      min: number; // shortest stream duration
      max: number; // longest stream duration
      avg: number; // average stream duration
      sum: number; // minutes streamed
    };
    cardinality: {
      tracks: number; // different tracks
      artists: number; // different artists
      albums: number; // different albums
    };
  };
};

export type Statistic = {
  value: number;
  diff: number;
};

export type Statistics = {
  count: Statistic;
  duration: Statistic;
  tracks: Statistic;
  artists: Statistic;
  albums: Statistic;
};
