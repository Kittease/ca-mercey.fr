"use client";

import { format } from "date-fns";
import { Activity, ArrowDown, Gauge, Wind } from "lucide-react";

import { BZ_THRESHOLDS, KP_THRESHOLDS } from "../../_lib/constants";

type Props = {
  kp: number | null;
  bz: number | null;
  solarWindSpeed: number | null;
  solarWindDensity: number | null;
  lastUpdated: Date | null;
};

function kpSeverity(kp: number): { color: string; glow: string; label: string } {
  if (kp >= KP_THRESHOLDS.HIGH) return { color: "text-rose-400", glow: "glow-rose", label: `G${kp - 4} Storm` };
  if (kp >= KP_THRESHOLDS.MODERATE) return { color: "text-orange-400", glow: "glow-amber", label: `G${kp - 4} Storm` };
  if (kp >= KP_THRESHOLDS.LOW) return { color: "text-amber-300", glow: "glow-amber", label: "Unsettled" };
  return { color: "text-emerald-400", glow: "glow-green", label: "Quiet" };
}

function bzSeverity(bz: number): { color: string; label: string } {
  if (bz <= BZ_THRESHOLDS.EXTREME) return { color: "text-rose-400", label: "Extreme southward" };
  if (bz <= BZ_THRESHOLDS.STRONG) return { color: "text-orange-400", label: "Strong southward" };
  if (bz <= BZ_THRESHOLDS.FAVORABLE) return { color: "text-amber-300", label: "Favorable" };
  if (bz < 0) return { color: "text-emerald-400", label: "Slightly south" };
  return { color: "text-white/40", label: "Northward" };
}

function windColor(speed: number): string {
  if (speed >= 700) return "text-rose-400";
  if (speed >= 500) return "text-orange-400";
  if (speed >= 400) return "text-amber-300";
  return "text-emerald-400";
}

const Metric = ({
  icon,
  label,
  value,
  unit,
  colorClass,
  glowClass,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  colorClass: string;
  glowClass?: string;
  detail?: string;
}) => (
  <div className="aurora-glass-subtle relative flex flex-col gap-2 overflow-hidden rounded-xl p-3.5">
    <div className="flex items-center gap-2">
      <span className="text-white/25">{icon}</span>
      <span className="aurora-label text-[10px] text-white/35">{label}</span>
    </div>

    <p className={`aurora-data text-xl font-semibold leading-none ${colorClass} ${glowClass ?? ""}`}>
      {value}
      {unit && (
        <span className="ml-1 text-xs font-normal text-white/25">{unit}</span>
      )}
    </p>

    {detail && (
      <p className="text-[11px] text-white/30">{detail}</p>
    )}
  </div>
);

const SpaceWeatherPanel = ({
  kp,
  bz,
  solarWindSpeed,
  solarWindDensity,
  lastUpdated,
}: Props) => {
  const kpInfo = kp !== null ? kpSeverity(kp) : { color: "text-white/25", glow: "", label: "" };
  const bzInfo = bz !== null ? bzSeverity(bz) : { color: "text-white/25", label: "" };

  return (
    <div className="aurora-glass relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5">
      {/* Top accent */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent" />

      <div className="flex items-center justify-between">
        <h3
          className="aurora-label text-[11px] text-white/40"
          style={{ fontFamily: "var(--font-aurora-display)" }}
        >
          Space Weather
        </h3>

        {lastUpdated && (
          <span className="aurora-data flex items-center gap-1.5 text-[10px] text-white/20">
            <span className="aurora-live-dot inline-block h-1 w-1 rounded-full bg-emerald-400/60" />
            {format(lastUpdated, "HH:mm:ss")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <Metric
          icon={<Activity size={13} />}
          label="Kp Index"
          value={kp !== null ? kp.toFixed(1) : "—"}
          colorClass={kpInfo.color}
          glowClass={kpInfo.glow}
          detail={kpInfo.label}
        />

        <Metric
          icon={<ArrowDown size={13} />}
          label="Bz"
          value={bz !== null ? bz.toFixed(1) : "—"}
          unit="nT"
          colorClass={bzInfo.color}
          detail={bzInfo.label}
        />

        <Metric
          icon={<Wind size={13} />}
          label="Solar Wind"
          value={solarWindSpeed !== null ? Math.round(solarWindSpeed).toString() : "—"}
          unit="km/s"
          colorClass={solarWindSpeed !== null ? windColor(solarWindSpeed) : "text-white/25"}
        />

        <Metric
          icon={<Gauge size={13} />}
          label="Density"
          value={solarWindDensity !== null ? solarWindDensity.toFixed(1) : "—"}
          unit="p/cm³"
          colorClass="text-cyan-300/80"
        />
      </div>
    </div>
  );
};

export default SpaceWeatherPanel;
