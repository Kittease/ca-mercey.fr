"use client";

import "maplibre-gl/dist/maplibre-gl.css";

import maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";

import { CARTO_DARK_STYLE } from "../../_lib/constants";

import { renderOvationToCanvas } from "./aurora-overlay";
import { addCloudLayer } from "./cloud-layer";
import { renderTerminatorToCanvas } from "./terminator";

import type { OvationData } from "../../_lib/types";

type Props = {
  lat: number;
  lon: number;
  ovation: OvationData | null;
};

const MAX_MERCATOR_LAT = 85.051129;
const AURORA_SOURCE_ID = "ovation-aurora";
const AURORA_LAYER_ID = "ovation-aurora-layer";
const TERMINATOR_SOURCE_ID = "terminator";
const TERMINATOR_LAYER_ID = "terminator-layer";
const MARKER_SOURCE_ID = "user-location";
const MARKER_LAYER_ID = "user-location-layer";

const Globe = ({ lat, lon, ovation }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const initialFlyDone = useRef(false);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current) {return;}

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: CARTO_DARK_STYLE,
      center: [lon, lat],
      zoom: 2,
      attributionControl: false,
    });

    map.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "top-right",
    );

    map.on("load", () => {
      map.setProjection({ type: "globe" });
      // User location marker
      map.addSource(MARKER_SOURCE_ID, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: { type: "Point", coordinates: [lon, lat] },
        },
      });

      map.addLayer({
        id: MARKER_LAYER_ID,
        type: "circle",
        source: MARKER_SOURCE_ID,
        paint: {
          "circle-radius": 8,
          "circle-color": "#4ade80",
          "circle-opacity": 0.8,
          "circle-stroke-width": 2,
          "circle-stroke-color": "#ffffff",
        },
      });

      // Terminator (raster overlay to avoid polygon artifacts on globe)
      const terminatorCanvas = renderTerminatorToCanvas(new Date());
      map.addSource(TERMINATOR_SOURCE_ID, {
        type: "image",
        url: terminatorCanvas.toDataURL(),
        coordinates: [
          [-180, MAX_MERCATOR_LAT],
          [180, MAX_MERCATOR_LAT],
          [180, -MAX_MERCATOR_LAT],
          [-180, -MAX_MERCATOR_LAT],
        ],
      });

      map.addLayer({
        id: TERMINATOR_LAYER_ID,
        type: "raster",
        source: TERMINATOR_SOURCE_ID,
        paint: {
          "raster-opacity": 1,
          "raster-fade-duration": 0,
        },
      });

      // Cloud layer
      void addCloudLayer(map);

      // Aurora overlay
      if (ovation) {
        const canvas = renderOvationToCanvas(ovation);
        map.addSource(AURORA_SOURCE_ID, {
          type: "image",
          url: canvas.toDataURL(),
          coordinates: [
            [-180, MAX_MERCATOR_LAT],
            [180, MAX_MERCATOR_LAT],
            [180, -MAX_MERCATOR_LAT],
            [-180, -MAX_MERCATOR_LAT],
          ],
        });

        map.addLayer({
          id: AURORA_LAYER_ID,
          type: "raster",
          source: AURORA_SOURCE_ID,
          paint: {
            "raster-opacity": 0.6,
            "raster-fade-duration": 0,
          },
        });
      }

      // Fly to user
      if (!initialFlyDone.current) {
        map.flyTo({ center: [lon, lat], zoom: 3.5, duration: 2000 });
        initialFlyDone.current = true;
      }
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
    // Only run on mount
  }, []);

  // Update user marker and fly on coords change
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded()) {return;}

    const source = map.getSource(MARKER_SOURCE_ID);
    if (source && "setData" in source) {
      (source as maplibregl.GeoJSONSource).setData({
        type: "Feature",
        properties: {},
        geometry: { type: "Point", coordinates: [lon, lat] },
      });
    }
  }, [lat, lon]);

  // Update aurora overlay when data changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !map.isStyleLoaded() || !ovation) {return;}

    const canvas = renderOvationToCanvas(ovation);
    const imgCoords: [[number, number], [number, number], [number, number], [number, number]] = [
      [-180, MAX_MERCATOR_LAT],
      [180, MAX_MERCATOR_LAT],
      [180, -MAX_MERCATOR_LAT],
      [-180, -MAX_MERCATOR_LAT],
    ];
    const source = map.getSource(AURORA_SOURCE_ID);

    if (source && "updateImage" in source) {
      (source as maplibregl.ImageSource).updateImage({
        url: canvas.toDataURL(),
        coordinates: imgCoords,
      });
    } else if (!source) {
      map.addSource(AURORA_SOURCE_ID, {
        type: "image",
        url: canvas.toDataURL(),
        coordinates: imgCoords,
      });
      map.addLayer({
        id: AURORA_LAYER_ID,
        type: "raster",
        source: AURORA_SOURCE_ID,
        paint: {
          "raster-opacity": 0.6,
          "raster-fade-duration": 0,
        },
      });
    }
  }, [ovation]);

  // Update terminator periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const map = mapRef.current;
      if (!map || !map.isStyleLoaded()) {return;}

      const source = map.getSource(TERMINATOR_SOURCE_ID);
      if (source && "updateImage" in source) {
        const terminatorCanvas = renderTerminatorToCanvas(new Date());
        (source as maplibregl.ImageSource).updateImage({
          url: terminatorCanvas.toDataURL(),
          coordinates: [
            [-180, MAX_MERCATOR_LAT],
            [180, MAX_MERCATOR_LAT],
            [180, -MAX_MERCATOR_LAT],
            [-180, -MAX_MERCATOR_LAT],
          ],
        });
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full" />
  );
};

export default Globe;
