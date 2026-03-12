"use client";

import { format } from "date-fns";

import type { HourlyProjection, KpForecastEntry } from "../../_lib/types";

type Props = {
  hourlyProjections: HourlyProjection[];
  kpForecast: KpForecastEntry[];
  lat: number;
};

function barColor(p: number): string {
  if (p >= 40) {return "bg-green-400";}
  if (p >= 20) {return "bg-yellow-400";}
  if (p >= 5) {return "bg-orange-400";}
  if (p > 0) {return "bg-red-400";}
  return "bg-neutral-700";
}

function kpColor(kp: number): string {
  if (kp >= 7) {return "border-red-500 bg-red-500/10 text-red-400";}
  if (kp >= 5) {return "border-orange-500 bg-orange-500/10 text-orange-400";}
  if (kp >= 3) {return "border-yellow-500 bg-yellow-500/10 text-yellow-400";}
  return "border-green-500 bg-green-500/10 text-green-400";
}

/**
 * Rough estimate: Kp → approximate auroral boundary latitude
 * Based on empirical relationship
 */
function kpToAuroralLat(kp: number): number {
  return 67 - (kp - 1) * 2.5;
}

const ForecastTimeline = ({ hourlyProjections, kpForecast, lat }: Props) => {
  const maxP = Math.max(1, ...hourlyProjections.map((h) => h.probability));

  // Find best viewing windows (dark + low cloud + >0 probability)
  const bestWindows = hourlyProjections.filter(
    (h) => h.factors.fDark >= 0.5 && h.factors.fCloud >= 0.5 && h.probability > 0,
  );

  // Parse Kp forecast entries
  const kpEntries = kpForecast
    .map((entry) => {
      const time = entry[0];
      const kp = parseFloat(entry[1]);
      if (isNaN(kp)) {return null;}
      return { time, kp };
    })
    .filter((e): e is { time: string; kp: number } => e !== null)
    .slice(0, 9); // ~3 days of 8h intervals

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-900/30 p-4">
      {/* Hourly timeline */}
      <div>
        <h3 className="mb-3 text-xs font-medium tracking-wider text-neutral-400 uppercase">
          Hourly Forecast
        </h3>

        {bestWindows.length > 0 && (
          <p className="mb-2 text-xs text-green-400">
            {`${bestWindows.length} good viewing window${bestWindows.length > 1 ? "s" : ""} in the next ${hourlyProjections.length}h`}
          </p>
        )}

        <div className="flex gap-px overflow-x-auto pb-2">
          {hourlyProjections.slice(0, 24).map((h, i) => {
            const height = maxP > 0 ? Math.max(2, (h.probability / maxP) * 64) : 2;
            const isDark = h.factors.fDark >= 0.5;
            const isBestWindow =
              isDark && h.factors.fCloud >= 0.5 && h.probability > 0;

            return (
              <div
                key={i}
                className="flex min-w-[20px] flex-1 flex-col items-center gap-1"
              >
                <div
                  className="relative flex h-16 w-full items-end justify-center"
                  title={`${format(h.time, "HH:mm")} — ${h.probability}%`}
                >
                  <div
                    className={`w-full rounded-t ${barColor(h.probability)} ${isBestWindow ? "ring-1 ring-green-300/50" : ""}`}
                    style={{ height: `${height}px` }}
                  />
                </div>

                <span
                  className={`text-[9px] tabular-nums ${isDark ? "text-neutral-400" : "text-neutral-600"}`}
                >
                  {format(h.time, "HH")}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-1 flex items-center gap-3 text-[10px] text-neutral-600">
          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-green-400" />
            Good
          </span>

          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-yellow-400" />
            Fair
          </span>

          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-orange-400" />
            Low
          </span>

          <span className="flex items-center gap-1">
            <span className="inline-block h-2 w-2 rounded-full bg-neutral-700" />
            None
          </span>
        </div>
      </div>

      {/* Kp 3-day forecast */}
      {kpEntries.length > 0 && (
        <div>
          <h3 className="mb-3 text-xs font-medium tracking-wider text-neutral-400 uppercase">
            Kp 3-Day Forecast
          </h3>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {kpEntries.map((entry, i) => {
              const auroralLat = kpToAuroralLat(entry.kp);
              const absLat = Math.abs(lat);
              const inRange = absLat >= auroralLat;

              return (
                <div
                  key={i}
                  className={`rounded-lg border p-2 text-center ${kpColor(entry.kp)}`}
                >
                  <p className="text-[10px] opacity-70">
                    {format(new Date(entry.time), "MMM d HH:mm")}
                  </p>

                  <p className="text-lg font-bold">{entry.kp.toFixed(1)}</p>

                  {inRange && (
                    <p className="text-[10px] font-medium">In range</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ForecastTimeline;
