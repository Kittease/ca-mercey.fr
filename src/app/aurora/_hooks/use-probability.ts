"use client";

import { useMemo } from "react";

import { lookupOvationProbability } from "../_lib/ovation";
import { computeCloudFactor, computeViewingProbability } from "../_lib/probability";
import { computeDarknessFactor, computeMoonFactor } from "../_lib/solar";

import type {
  HourlyProjection,
  OvationData,
  ProbabilityFactors,
  ProbabilityResult,
} from "../_lib/types";

export function useProbability(
  ovation: OvationData | null,
  lat: number,
  lon: number,
  currentCloud: number,
  hourlyCloud: { time: string; cloud: number }[],
): ProbabilityResult {
  return useMemo(() => {
    const now = new Date();

    const pGeo = ovation ? lookupOvationProbability(ovation, lat, lon) : 0;
    const fCloud = computeCloudFactor(currentCloud);
    const fDark = computeDarknessFactor(lat, lon, now);
    const fMoon = computeMoonFactor(lat, lon, now);

    const factors: ProbabilityFactors = { pGeo, fCloud, fDark, fMoon };
    const probability = computeViewingProbability(factors);

    // Hourly projections for next 48h using cloud forecast
    const hourlyProjections: HourlyProjection[] = hourlyCloud
      .filter((h) => new Date(h.time) >= now)
      .slice(0, 48)
      .map((h) => {
        const time = new Date(h.time);
        const hfCloud = computeCloudFactor(h.cloud);
        const hfDark = computeDarknessFactor(lat, lon, time);
        const hfMoon = computeMoonFactor(lat, lon, time);
        const hFactors: ProbabilityFactors = {
          pGeo,
          fCloud: hfCloud,
          fDark: hfDark,
          fMoon: hfMoon,
        };
        return {
          time,
          probability: computeViewingProbability(hFactors),
          factors: hFactors,
        };
      });

    return { probability, factors, hourlyProjections };
  }, [ovation, lat, lon, currentCloud, hourlyCloud]);
}
