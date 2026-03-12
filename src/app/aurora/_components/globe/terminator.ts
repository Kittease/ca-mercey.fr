import SunCalc from "suncalc";

import type { Feature, Polygon } from "geojson";

/**
 * Computes a GeoJSON polygon representing the dark side of the Earth.
 * Samples the terminator line at 1° longitude intervals.
 */
export function computeTerminator(date: Date): Feature<Polygon> {
  const points: [number, number][] = [];

  // Sample terminator at each longitude
  for (let lon = -180; lon <= 180; lon += 2) {
    // Binary search for the latitude where solar elevation ≈ 0
    let lo = -90;
    let hi = 90;

    for (let iter = 0; iter < 20; iter++) {
      const mid = (lo + hi) / 2;
      const pos = SunCalc.getPosition(date, mid, lon);
      const elev = pos.altitude * (180 / Math.PI);

      if (elev > 0) {
        // Sun is up at mid, so dark side is further south (or north depending on season)
        // Need to check which hemisphere the sun is in
        const posN = SunCalc.getPosition(date, 89, lon);
        if (posN.altitude > 0) {
          // Sun is in northern sky, dark is south
          hi = mid;
        } else {
          lo = mid;
        }
      } else {
        const posN = SunCalc.getPosition(date, 89, lon);
        if (posN.altitude > 0) {
          lo = mid;
        } else {
          hi = mid;
        }
      }
    }

    points.push([lon, (lo + hi) / 2]);
  }

  // Determine which pole is dark
  const northPolePos = SunCalc.getPosition(date, 89, 0);
  const northIsDark = northPolePos.altitude < 0;

  // Build polygon: terminator line + sweep to dark pole
  const darkPole: [number, number][] = northIsDark
    ? [
        [180, 90],
        [-180, 90],
      ]
    : [
        [180, -90],
        [-180, -90],
      ];

  const ring: [number, number][] = northIsDark
    ? [...points.reverse(), ...darkPole]
    : [...points, ...darkPole];

  // Close the ring
  ring.push(ring[0]);

  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "Polygon",
      coordinates: [ring],
    },
  };
}
