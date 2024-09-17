import { format } from "date-fns";

import prisma from "@/lib/prisma";

import Graph from "./_components/graph";
import { DayData, WeightRecord } from "./types";

const HealthPage = async () => {
  const weight = await prisma.$queryRaw<
    WeightRecord[]
  >`SELECT * FROM health.weight ORDER BY recorded_at ASC;`;

  const data = weight.reduce((acc, record) => {
    const date = format(record.recorded_at, "yyyy-MM-dd");
    acc[date] = {
      weight: record.weight,
      date,
    };
    return acc;
  }, {} as Record<string, DayData>);

  return (
    <Graph
      data={Object.values(data)}
      latestWeight={weight[weight.length - 1].weight}
    />
  );
};

export default HealthPage;
