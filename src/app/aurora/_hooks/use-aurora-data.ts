"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { API_URLS, POLLING_INTERVALS } from "../_lib/constants";

import type {
  AuroraData,
  BzEntry,
  KpEntry,
  KpForecastEntry,
  OvationData,
  PlasmaEntry,
} from "../_lib/types";

export function useAuroraData(): AuroraData {
  const [data, setData] = useState<AuroraData>({
    ovation: null,
    kp: null,
    kpForecast: [],
    bz: null,
    solarWindSpeed: null,
    solarWindDensity: null,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    try {
      const [ovationRes, kpRes, kpForecastRes, bzRes, plasmaRes] =
        await Promise.all([
          fetch(API_URLS.OVATION, { signal }),
          fetch(API_URLS.KP_OBSERVED, { signal }),
          fetch(API_URLS.KP_FORECAST, { signal }),
          fetch(API_URLS.BZ, { signal }),
          fetch(API_URLS.PLASMA, { signal }),
        ]);

      const ovation: OvationData = await ovationRes.json();

      const kpData: KpEntry[] = await kpRes.json();
      const lastKp = kpData.length > 1 ? kpData[kpData.length - 1] : null;
      const kpValue = lastKp ? parseFloat(lastKp[1]) : null;

      const kpForecast: KpForecastEntry[] = await kpForecastRes.json();
      // Remove header row if present
      const kpForecastClean = kpForecast.filter(
        (_, i) => i > 0 && kpForecast[0]?.[0] === "time_tag",
      );

      const bzData: BzEntry[] = await bzRes.json();
      const lastBz = bzData.length > 0 ? bzData[bzData.length - 1] : null;
      const bzValue = lastBz?.bz_gsm ?? null;

      const plasmaData: PlasmaEntry[] = await plasmaRes.json();
      // Find last non-null entry
      let windSpeed: number | null = null;
      let windDensity: number | null = null;
      for (let i = plasmaData.length - 1; i >= 1; i--) {
        const entry = plasmaData[i];
        if (entry[2] && entry[2] !== "-999.9") {
          windSpeed = parseFloat(entry[2]);
          windDensity = entry[1] ? parseFloat(entry[1]) : null;
          break;
        }
      }

      if (!signal.aborted) {
        setData({
          ovation,
          kp: kpValue,
          kpForecast:
            kpForecastClean.length > 0 ? kpForecastClean : kpForecast.slice(1),
          bz: bzValue,
          solarWindSpeed: windSpeed,
          solarWindDensity: windDensity,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        });
      }
    } catch (err) {
      if (!signal.aborted) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error: err instanceof Error ? err.message : "Failed to fetch aurora data",
        }));
      }
    }
  }, []);

  useEffect(() => {
    void fetchData();
    const interval = setInterval(() => void fetchData(), POLLING_INTERVALS.AURORA_DATA);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchData]);

  return data;
}
