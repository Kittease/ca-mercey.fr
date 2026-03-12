import type { OvationData } from "./types";

/**
 * Look up aurora probability from OVATION data at given coordinates.
 * OVATION grid is 1° resolution. We round to nearest integer and find the match.
 * Returns probability 0-100.
 */
export function lookupOvationProbability(
  ovation: OvationData,
  lat: number,
  lon: number,
): number {
  const targetLat = Math.round(lat);
  // OVATION uses 0-360 longitude
  let targetLon = Math.round(lon);
  if (targetLon < 0) {targetLon += 360;}

  let closest: number | null = null;
  let closestDist = Infinity;

  for (const coord of ovation.coordinates) {
    const dLat = coord.Latitude - targetLat;
    const dLon = coord.Longitude - targetLon;
    const dist = dLat * dLat + dLon * dLon;

    if (dist < closestDist) {
      closestDist = dist;
      closest = coord.Aurora;
    }

    // Exact match
    if (dist === 0) {break;}
  }

  return closest ?? 0;
}
