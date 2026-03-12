import SunCalc from "suncalc";

/**
 * Darkness factor based on solar elevation.
 * 1.0 when sun below -12° (astronomical twilight),
 * ramps down through twilight, 0 when sun above horizon.
 */
export function computeDarknessFactor(
  lat: number,
  lon: number,
  date: Date,
): number {
  const sunPos = SunCalc.getPosition(date, lat, lon);
  const elevDeg = sunPos.altitude * (180 / Math.PI);

  if (elevDeg < -12) {return 1.0;}
  if (elevDeg < -6) {return 0.5;}
  if (elevDeg < 0) {return 0.1;}
  return 0;
}

/**
 * Moon interference factor.
 * Returns 1.0 when moon is below horizon (no interference),
 * reduces based on moon illumination when above horizon.
 */
export function computeMoonFactor(
  lat: number,
  lon: number,
  date: Date,
): number {
  const moonPos = SunCalc.getMoonPosition(date, lat, lon);
  const moonIllum = SunCalc.getMoonIllumination(date);

  // Moon below horizon — no interference
  if (moonPos.altitude < 0) {return 1.0;}

  // Reduce by up to 50% based on illumination
  return 1 - 0.5 * moonIllum.fraction;
}
