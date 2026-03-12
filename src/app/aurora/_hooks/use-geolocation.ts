"use client";

import { useCallback, useEffect, useState } from "react";

import { DEFAULTS } from "../_lib/constants";

import type { GeolocationState } from "../_lib/types";

const STORAGE_KEY = "aurora-last-coords";

export function useGeolocation(): GeolocationState {
  const [lat, setLat] = useState<number>(DEFAULTS.LAT);
  const [lon, setLon] = useState<number>(DEFAULTS.LON);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const requestPosition = useCallback(() => {
    if (!("geolocation" in navigator)) {
      setError("Geolocation not supported");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        setLat(coords.lat);
        setLon(coords.lon);
        setLoading(false);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(coords));
        } catch {
          // ignore storage errors
        }
      },
      (err) => {
        setError(err.message);
        setLoading(false);
        // Try localStorage fallback
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) {
            const coords = JSON.parse(stored) as { lat: number; lon: number };
            setLat(coords.lat);
            setLon(coords.lon);
          }
        } catch {
          // ignore
        }
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 },
    );
  }, []);

  useEffect(() => {
    requestPosition();
  }, [requestPosition]);

  return { lat, lon, loading, error, retry: requestPosition };
}
