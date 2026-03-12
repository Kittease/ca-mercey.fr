"use client";

import { format } from "date-fns";

import type { HourlyProjection, KpForecastEntry } from "../../_lib/types";

type Props = {
  hourlyProjections: HourlyProjection[];
  kpForecast: KpForecastEntry[];
  lat: number;
};

function barClass(p: number): string {
  if (p >= 40) return "aurora-bar-green";
  if (p >= 20) return "aurora-bar-yellow";
  if (p >= 5) return "aurora-bar-orange";
  if (p > 0) return "aurora-bar-red";
  return "aurora-bar-none";
}

function kpColorClass(kp: number): string {
  if (kp >= 7) return "text-rose-400 border-rose-400/20 kp-glow-red";
  if (kp >= 5) return "text-orange-400 border-orange-400/20 kp-glow-orange";
  if (kp >= 3) return "text-amber-300 border-amber-300/20 kp-glow-yellow";
  return "text-emerald-400 border-emerald-400/20 kp-glow-green";
}

function kpToAuroralLat(kp: number): number {
  return 67 - (kp - 1) * 2.5;
}

const ForecastTimeline = ({ hourlyProjections, kpForecast, lat }: Props) => {
  const maxP = Math.max(1, ...hourlyProjections.map((h) => h.probability));

  const bestWindows = hourlyProjections.filter(
    (h) => h.factors.fDark >= 0.5 && h.factors.fCloud >= 0.5 && h.probability > 0,
  );

  const now = new Date();
  const kpEntries = kpForecast
    .map((entry) => {
      const time = entry[0];
      const kp = parseFloat(entry[1]);
      if (isNaN(kp)) return null;
      return { time, kp };
    })
    .filter((e): e is { time: string; kp: number } => e !== null && new Date(e.time) >= now)
    .slice(0, 9);

  return (
    <div className="aurora-glass relative flex flex-col gap-6 overflow-hidden rounded-2xl p-5">
      {/* Top accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/15 to-transparent" />

      {/* Hourly timeline */}
      <div>
        <div className="mb-4 flex items-baseline justify-between">
          <h3
            className="aurora-label text-[11px] text-white/40"
            style={{ fontFamily: "var(--font-aurora-display)" }}
          >
            Hourly Forecast
          </h3>

          {bestWindows.length > 0 && (
            <span className="aurora-data text-[11px] text-emerald-400/70">
              {bestWindows.length} viewing window{bestWindows.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="flex gap-[2px] overflow-x-auto pb-2">
          {hourlyProjections.slice(0, 24).map((h, i) => {
            const height = maxP > 0 ? Math.max(3, (h.probability / maxP) * 56) : 3;
            const isDark = h.factors.fDark >= 0.5;
            const isBestWindow = isDark && h.factors.fCloud >= 0.5 && h.probability > 0;

            return (
              <div
                key={i}
                className="group flex min-w-[18px] flex-1 flex-col items-center gap-1.5"
              >
                {/* Probability label on hover */}
                <div className="aurora-data invisible text-[9px] text-white/40 group-hover:visible">
                  {h.probability > 0 ? `${h.probability}%` : ""}
                </div>

                {/* Bar */}
                <div
                  className="relative flex h-14 w-full items-end justify-center"
                  title={`${format(h.time, "HH:mm")} — ${h.probability}%`}
                >
                  <div
                    className={`w-full rounded-sm ${barClass(h.probability)} transition-all group-hover:brightness-125 ${
                      isBestWindow ? "ring-1 ring-emerald-300/30 ring-offset-1 ring-offset-transparent" : ""
                    }`}
                    style={{
                      height: `${height}px`,
                      opacity: isDark ? 1 : 0.4,
                    }}
                  />
                </div>

                {/* Time */}
                <span
                  className={`aurora-data text-[9px] ${
                    isDark ? "text-white/35" : "text-white/15"
                  }`}
                >
                  {format(h.time, "HH")}
                </span>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center gap-4 text-[10px] text-white/25">
          <span className="flex items-center gap-1.5">
            <span className="aurora-bar-green inline-block h-2 w-2 rounded-full" />
            Good
          </span>
          <span className="flex items-center gap-1.5">
            <span className="aurora-bar-yellow inline-block h-2 w-2 rounded-full" />
            Fair
          </span>
          <span className="flex items-center gap-1.5">
            <span className="aurora-bar-orange inline-block h-2 w-2 rounded-full" />
            Low
          </span>
          <span className="flex items-center gap-1.5">
            <span className="aurora-bar-none inline-block h-2 w-2 rounded-full" />
            None
          </span>
        </div>
      </div>

      {/* Kp 3-day forecast */}
      {kpEntries.length > 0 && (
        <div>
          <div className="h-px bg-white/[0.04]" />

          <h3
            className="aurora-label mb-3 mt-5 text-[11px] text-white/40"
            style={{ fontFamily: "var(--font-aurora-display)" }}
          >
            Kp 3-Day Forecast
          </h3>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-3 xl:grid-cols-5">
            {kpEntries.map((entry, i) => {
              const auroralLat = kpToAuroralLat(entry.kp);
              const absLat = Math.abs(lat);
              const inRange = absLat >= auroralLat;

              return (
                <div
                  key={i}
                  className={`aurora-glass-subtle flex flex-col items-center gap-0.5 rounded-xl border p-2.5 ${kpColorClass(entry.kp)}`}
                >
                  <p className="aurora-data text-[9px] opacity-50">
                    {format(new Date(entry.time), "MMM d HH:mm")}
                  </p>

                  <p className="aurora-data text-xl font-semibold leading-tight">
                    {entry.kp.toFixed(1)}
                  </p>

                  {inRange && (
                    <p className="aurora-label text-[9px] opacity-70">In range</p>
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
