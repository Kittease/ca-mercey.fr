import type { OvationData } from "../../_lib/types";

/**
 * Renders OVATION JSON data to a 360x181 canvas (1° resolution).
 * Returns an HTMLCanvasElement that can be used as a MapLibre ImageSource.
 */
export function renderOvationToCanvas(ovation: OvationData): HTMLCanvasElement {
  const width = 360;
  const height = 181;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {return canvas;}

  // Clear with transparent
  ctx.clearRect(0, 0, width, height);

  const imageData = ctx.createImageData(width, height);

  for (const coord of ovation.coordinates) {
    const aurora = coord.Aurora;
    if (aurora <= 0) {continue;}

    // Convert OVATION 0-360 lon to canvas x (0=0°, 359=359°)
    const x = Math.round(coord.Longitude) % 360;
    // Convert lat to canvas y (0=90°N, 180=-90°S)
    const y = 90 - Math.round(coord.Latitude);

    if (x < 0 || x >= width || y < 0 || y >= height) {continue;}

    const idx = (y * width + x) * 4;

    // Color ramp: green (low) → yellow (mid) → red (high)
    const t = Math.min(aurora / 100, 1);
    let r: number, g: number, b: number;
    if (t < 0.5) {
      const s = t * 2;
      r = Math.round(s * 255);
      g = 255;
      b = 0;
    } else {
      const s = (t - 0.5) * 2;
      r = 255;
      g = Math.round((1 - s) * 255);
      b = 0;
    }

    const alpha = Math.min(Math.round(t * 200 + 55), 255);

    imageData.data[idx] = r;
    imageData.data[idx + 1] = g;
    imageData.data[idx + 2] = b;
    imageData.data[idx + 3] = alpha;
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}
