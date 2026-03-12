
import { API_URLS } from "../../_lib/constants";

import type { RainViewerData } from "../../_lib/types";
import type { Map as MaplibreMap } from "maplibre-gl";

const CLOUD_SOURCE_ID = "rainviewer-clouds";
const CLOUD_LAYER_ID = "rainviewer-clouds-layer";

/**
 * Adds or updates the RainViewer satellite cloud layer on the map.
 */
export async function addCloudLayer(map: MaplibreMap): Promise<void> {
  try {
    const res = await fetch(API_URLS.RAINVIEWER);
    const data: RainViewerData = await res.json();
    const frames = data.satellite?.infrared ?? [];
    if (frames.length === 0) {return;}

    const latestFrame = frames[frames.length - 1];
    const tileUrl = `https://tilecache.rainviewer.com${latestFrame.path}/256/{z}/{x}/{y}/1/0_0.png`;

    if (map.getSource(CLOUD_SOURCE_ID)) {
      // Update existing source tiles
      const source = map.getSource(CLOUD_SOURCE_ID);
      if (source && "setTiles" in source) {
        (source as { setTiles: (tiles: string[]) => void }).setTiles([tileUrl]);
      }
    } else {
      map.addSource(CLOUD_SOURCE_ID, {
        type: "raster",
        tiles: [tileUrl],
        tileSize: 256,
      });

      map.addLayer({
        id: CLOUD_LAYER_ID,
        type: "raster",
        source: CLOUD_SOURCE_ID,
        paint: {
          "raster-opacity": 0.4,
        },
      });
    }
  } catch {
    // Silently fail — cloud layer is optional
  }
}
