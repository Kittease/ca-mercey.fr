"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { API_URLS, POLLING_INTERVALS } from "../_lib/constants";

import type { WeatherData } from "../_lib/types";

export function useWeatherData(lat: number, lon: number): WeatherData {
  const [data, setData] = useState<WeatherData>({
    currentCloud: 0,
    hourlyCloud: [],
    loading: true,
    error: null,
  });

  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const url = `${API_URLS.OPEN_METEO}?latitude=${lat}&longitude=${lon}&current=cloud_cover&hourly=cloud_cover&forecast_days=2`;
      const res = await fetch(url, { signal: controller.signal });
      const json = await res.json();

      if (!controller.signal.aborted) {
        const hourlyTimes: string[] = json.hourly?.time ?? [];
        const hourlyClouds: number[] = json.hourly?.cloud_cover ?? [];

        setData({
          currentCloud: json.current?.cloud_cover ?? 0,
          hourlyCloud: hourlyTimes.map((time, i) => ({
            time,
            cloud: hourlyClouds[i] ?? 0,
          })),
          loading: false,
          error: null,
        });
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setData((prev) => ({
          ...prev,
          loading: false,
          error:
            err instanceof Error ? err.message : "Failed to fetch weather data",
        }));
      }
    }
  }, [lat, lon]);

  useEffect(() => {
    void fetchData();
    const interval = setInterval(() => void fetchData(), POLLING_INTERVALS.WEATHER_DATA);
    return () => {
      clearInterval(interval);
      abortRef.current?.abort();
    };
  }, [fetchData]);

  return data;
}
