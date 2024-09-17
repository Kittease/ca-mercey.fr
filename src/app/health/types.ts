export type WeightRecord = {
  id: string;
  weight: number;
  recorded_at: string;
};

export type FitnessRecord = {
  id: string;
  swimming_distance: number | null;
  crawl_swimming_distance: number | null;
  breaststroke_swimming_distance: number | null;
  backstroke_swimming_distance: number | null;
  freestyle_swimming_distance: number | null;
  biking_distance: number | null;
  rowing_distance: number | null;
  running_distance: number | null;
  day: string;
};

export type DayData = {
  weight?: number | undefined;
  crawlSwimmingDistance?: number | null;
  breaststrokeSwimmingDistance?: number | null;
  backstrokeSwimmingDistance?: number | null;
  freestyleSwimmingDistance?: number | null;
  totalSwimmingDistance?: number | null;
  bikingDistance: number | null;
  rowingDistance: number | null;
  runningDistance: number | null;
  date: string;
};
