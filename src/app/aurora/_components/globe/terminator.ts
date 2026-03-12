/**
 * Renders the night side of the Earth to a canvas image.
 * Uses the same equirectangular projection as the aurora overlay
 * to avoid polygon rendering artifacts on MapLibre globe projection.
 */
export function renderTerminatorToCanvas(date: Date): HTMLCanvasElement {
  const DEG = Math.PI / 180;
  const width = 360;
  const height = 181;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;

  const dayOfYear = getDayOfYear(date);
  const hours =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600;

  // Solar declination
  const declination = -23.44 * Math.cos(((360 / 365) * (dayOfYear + 10)) * DEG);
  const decRad = declination * DEG;

  // Sub-solar longitude
  const subSolarLon = -((hours / 24) * 360 - 180);

  const imageData = ctx.createImageData(width, height);

  for (let y = 0; y < height; y++) {
    // Canvas y=0 is 90°N, y=180 is 90°S
    const lat = (90 - y) * DEG;

    for (let x = 0; x < width; x++) {
      // Canvas x=0 is 0°E, we need to map to -180..180
      const lon = x - 180;
      const hourAngle = (lon - subSolarLon) * DEG;

      // Solar elevation: sin(alt) = sin(lat)*sin(dec) + cos(lat)*cos(dec)*cos(h)
      const sinAlt =
        Math.sin(lat) * Math.sin(decRad) +
        Math.cos(lat) * Math.cos(decRad) * Math.cos(hourAngle);

      if (sinAlt < 0) {
        // Night side — black with some transparency
        // Smooth transition near the terminator (civil twilight ≈ -6°)
        const idx = (y * width + x) * 4;
        const t = Math.min(-sinAlt / Math.sin(6 * DEG), 1);
        imageData.data[idx] = 0;
        imageData.data[idx + 1] = 0;
        imageData.data[idx + 2] = 0;
        imageData.data[idx + 3] = Math.round(t * 180);
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}
