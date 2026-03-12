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
    <div className="relative mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-4 py-6 md:px-8 md:py-8">
      {/* Header */}
      <header className="flex items-end justify-between">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-white/90 md:text-3xl"
            style={{ fontFamily: "var(--font-aurora-display)" }}
          >
            Aurora Forecast
          </h1>
          <p className="mt-1 text-sm text-white/30">
            Real-time aurora borealis viewing probability
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="aurora-live-dot inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="aurora-data text-xs text-white/30">LIVE</span>
        </div>
      </header>

      {/* Location */}
      <LocationBar
        lat={lat}
        lon={lon}
        loading={geo.loading}
        error={geo.error}
        onRetry={geo.retry}
        onManualCoords={setManualCoords}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Globe + Forecast (left/main area) */}
        <div className="flex flex-col gap-5 lg:col-span-8">
          {/* Globe */}
          <div className="aurora-glass relative aspect-square w-full overflow-hidden rounded-2xl md:aspect-[16/9]">
            {isLoading ? (
              <div className="flex h-full items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-emerald-400" />
                  <span className="aurora-label text-[10px] text-white/30">
                    Loading data
                  </span>
                </div>
              </div>
            ) : (
              <Globe
                lat={lat}
                lon={lon}
                ovation={aurora.ovation}
              />
            )}
          </div>

          {/* Forecast */}
          <ForecastTimeline
            hourlyProjections={probability.hourlyProjections}
            kpForecast={aurora.kpForecast}
            lat={lat}
          />
        </div>

        {/* Sidebar (right) */}
        <div className="flex flex-col gap-5 lg:col-span-4">
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
