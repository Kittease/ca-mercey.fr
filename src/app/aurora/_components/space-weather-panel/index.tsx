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

function kpSeverity(kp: number): { color: string; label: string } {
  if (kp >= KP_THRESHOLDS.HIGH) {return { color: "text-red-400", label: `G${kp - 4} Storm` };}
  if (kp >= KP_THRESHOLDS.MODERATE) {return { color: "text-orange-400", label: `G${kp - 4} Storm` };}
  if (kp >= KP_THRESHOLDS.LOW) {return { color: "text-yellow-400", label: "Unsettled" };}
  return { color: "text-green-400", label: "Quiet" };
}

function bzSeverity(bz: number): { color: string; label: string } {
  if (bz <= BZ_THRESHOLDS.EXTREME) {return { color: "text-red-400", label: "Extreme southward" };}
  if (bz <= BZ_THRESHOLDS.STRONG) {return { color: "text-orange-400", label: "Strong southward" };}
  if (bz <= BZ_THRESHOLDS.FAVORABLE) {return { color: "text-yellow-400", label: "Favorable" };}
  if (bz < 0) {return { color: "text-green-400", label: "Slightly south" };}
  return { color: "text-neutral-400", label: "Northward" };
}

function windSeverity(speed: number): string {
  if (speed >= 700) {return "text-red-400";}
  if (speed >= 500) {return "text-orange-400";}
  if (speed >= 400) {return "text-yellow-400";}
  return "text-green-400";
}

const Card = ({
  icon,
  label,
  value,
  unit,
  colorClass,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  unit?: string;
  colorClass: string;
  detail?: string;
}) => (
  <div className="flex flex-col gap-1 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
    <div className="flex items-center gap-2 text-neutral-500">
      {icon}

      <span className="text-xs">{label}</span>
    </div>

    <p className={`text-lg font-bold tabular-nums ${colorClass}`}>
      {value}

      {unit && <span className="text-xs font-normal text-neutral-500"> {unit}</span>}
    </p>

    {detail && <p className="text-xs text-neutral-500">{detail}</p>}
  </div>
);

const SpaceWeatherPanel = ({
  kp,
  bz,
  solarWindSpeed,
  solarWindDensity,
  lastUpdated,
}: Props) => {
  const kpInfo = kp !== null ? kpSeverity(kp) : { color: "text-neutral-500", label: "" };
  const bzInfo = bz !== null ? bzSeverity(bz) : { color: "text-neutral-500", label: "" };

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-neutral-800 bg-neutral-900/30 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium tracking-wider text-neutral-400 uppercase">
          Space Weather
        </h3>

        {lastUpdated && (
          <span className="text-xs text-neutral-600">
            {format(lastUpdated, "HH:mm:ss")}
          </span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Card
          icon={<Activity size={14} />}
          label="Kp Index"
          value={kp !== null ? kp.toFixed(1) : "—"}
          colorClass={kpInfo.color}
          detail={kpInfo.label}
        />

        <Card
          icon={<ArrowDown size={14} />}
          label="Bz Component"
          value={bz !== null ? bz.toFixed(1) : "—"}
          unit="nT"
          colorClass={bzInfo.color}
          detail={bzInfo.label}
        />

        <Card
          icon={<Wind size={14} />}
          label="Solar Wind"
          value={solarWindSpeed !== null ? Math.round(solarWindSpeed).toString() : "—"}
          unit="km/s"
          colorClass={solarWindSpeed !== null ? windSeverity(solarWindSpeed) : "text-neutral-500"}
        />

        <Card
          icon={<Gauge size={14} />}
          label="Density"
          value={solarWindDensity !== null ? solarWindDensity.toFixed(1) : "—"}
          unit="p/cm³"
          colorClass="text-neutral-300"
        />
      </div>
    </div>
  );
};

export default SpaceWeatherPanel;
