import type { ProbabilityFactors } from "./types";

/**
 * Compute viewing probability from individual factors.
 * P_viewing = P_geo × F_cloud × F_dark × F_moon
 *
 * All inputs should be in 0-1 range except pGeo which is 0-100.
 */
export function computeViewingProbability(factors: ProbabilityFactors): number {
  const pGeoNorm = factors.pGeo / 100;
  return Math.round(pGeoNorm * factors.fCloud * factors.fDark * factors.fMoon * 100);
}

/**
 * Cloud factor: (100 - cloudCover) / 100
 */
export function computeCloudFactor(cloudCoverPercent: number): number {
  return (100 - cloudCoverPercent) / 100;
}
