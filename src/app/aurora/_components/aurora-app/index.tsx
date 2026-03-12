"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { useAuroraData } from "../../_hooks/use-aurora-data";
import { useGeolocation } from "../../_hooks/use-geolocation";
import { useProbability } from "../../_hooks/use-probability";
import { useWeatherData } from "../../_hooks/use-weather-data";
import ForecastTimeline from "../forecast-timeline";
import LocationBar from "../location-bar";
import ProbabilityDisplay from "../probability-display";
import SpaceWeatherPanel from "../space-weather-panel";

const Globe = dynamic(() => import("../globe"), { ssr: false });

const AuroraApp = () => {
  const geo = useGeolocation();
  const [manualCoords, setManualCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);

  const lat = manualCoords?.lat ?? geo.lat;
  const lon = manualCoords?.lon ?? geo.lon;

  const aurora = useAuroraData();
  const weather = useWeatherData(lat, lon);
  const probability = useProbability(
    aurora.ovation,
    lat,
    lon,
    weather.currentCloud,
    weather.hourlyCloud,
  );

  const isLoading = aurora.loading && weather.loading;

  return (
    <div className="mx-auto flex min-h-screen flex-col gap-4 p-4 md:p-6">
      <LocationBar
        lat={lat}
        lon={lon}
        loading={geo.loading}
        error={geo.error}
        onRetry={geo.retry}
        onManualCoords={setManualCoords}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-4 md:col-span-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-neutral-800 md:aspect-video">
            {isLoading ? (
              <div className="flex h-full items-center justify-center bg-neutral-900">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-600 border-t-green-400" />
              </div>
            ) : (
              <Globe
                lat={lat}
                lon={lon}
                ovation={aurora.ovation}
              />
            )}
          </div>

          <ForecastTimeline
            hourlyProjections={probability.hourlyProjections}
            kpForecast={aurora.kpForecast}
            lat={lat}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ProbabilityDisplay
            probability={probability.probability}
            factors={probability.factors}
            loading={isLoading}
          />

          <SpaceWeatherPanel
            kp={aurora.kp}
            bz={aurora.bz}
            solarWindSpeed={aurora.solarWindSpeed}
            solarWindDensity={aurora.solarWindDensity}
            lastUpdated={aurora.lastUpdated}
          />
        </div>
      </div>
    </div>
  );
};

export default AuroraApp;
