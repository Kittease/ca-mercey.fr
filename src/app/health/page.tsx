import { format } from "date-fns";

import logger from "@/lib/logger";
import prisma from "@/lib/prisma";

import Graph from "./_components/graph";
import { DayData, FitnessRecord, WeightRecord } from "./types";

const HealthPage = async () => {
  const weight = await prisma.$queryRaw<
    WeightRecord[]
  >`SELECT * FROM health.weight ORDER BY recorded_at ASC;`;

  const fitness = await prisma.$queryRaw<
    FitnessRecord[]
  >`SELECT * FROM health.fitness ORDER BY day ASC;`;

  const data = weight.reduce((acc, record) => {
    const date = format(record.recorded_at, "yyyy-MM-dd");
    acc[date] = {
      weight: record.weight,
      date,
      bikingDistance: null,
      rowingDistance: null,
      runningDistance: null,
    };
    return acc;
  }, {} as Record<string, DayData>);

  logger.info(fitness);

  fitness.forEach((record) => {
    const date = format(record.day, "yyyy-MM-dd");

    const swimmingDistance = record.swimming_distance
      ? {
          totalSwimmingDistance: record.swimming_distance,
        }
      : {
          crawlSwimmingDistance: record.crawl_swimming_distance,
          breaststrokeSwimmingDistance: record.breaststroke_swimming_distance,
          backstrokeSwimmingDistance: record.backstroke_swimming_distance,
          freestyleSwimmingDistance: record.freestyle_swimming_distance,
        };

    const fitnessData = {
      bikingDistance: record.biking_distance,
      rowingDistance: record.rowing_distance,
      runningDistance: record.running_distance,
    };

    if (data[date]) {
      data[date] = {
        ...swimmingDistance,
        ...fitnessData,
        ...data[date],
      };
    } else {
      data[date] = {
        ...swimmingDistance,
        ...fitnessData,
        date,
      };
    }
  });

  return (
    <Graph
      data={Object.values(data)}
      latestWeight={weight[weight.length - 1].weight}
    />
  );
};

export default HealthPage;
