export type WeightRecord = {
  id: string;
  weight: number;
  recorded_at: string;
};

export type DayData = {
  weight?: number | undefined;
  date: string;
};
