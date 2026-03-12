"use client";

import {
  Cloud,
  Eye,
  Moon,
  Sun,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import type { ProbabilityFactors } from "../../_lib/types";

type Props = {
  probability: number;
  factors: ProbabilityFactors;
  loading: boolean;
};

function probabilityColor(p: number): string {
  if (p >= 60) return "text-emerald-400";
  if (p >= 30) return "text-amber-300";
  if (p >= 10) return "text-orange-400";
  return "text-rose-400";
}

function probabilityGlow(p: number): string {
  if (p >= 60) return "glow-green";
  if (p >= 30) return "glow-amber";
  if (p >= 10) return "glow-amber";
  return "glow-rose";
}

function gaugeStroke(p: number): string {
  if (p >= 60) return "#4ade80";
  if (p >= 30) return "#fbbf24";
  if (p >= 10) return "#fb923c";
  return "#fb7185";
}

function gaugeGlow(p: number): string {
  if (p >= 60) return "rgba(74, 222, 128, 0.3)";
  if (p >= 30) return "rgba(251, 191, 36, 0.3)";
  if (p >= 10) return "rgba(251, 146, 60, 0.3)";
  return "rgba(251, 113, 133, 0.3)";
}

function factorLabel(value: number): string {
  if (value >= 0.8) return "Excellent";
  if (value >= 0.5) return "Good";
  if (value >= 0.2) return "Fair";
  return "Poor";
}

function factorBarColor(value: number): string {
  if (value >= 0.8) return "bg-emerald-400";
  if (value >= 0.5) return "bg-cyan-400";
  if (value >= 0.2) return "bg-amber-400";
  return "bg-rose-400";
}

const FactorRow = ({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  detail: string;
}) => (
  <div className="group flex items-center gap-3 py-2.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.03] text-white/40 transition-colors group-hover:bg-white/[0.06] group-hover:text-white/60">
      {icon}
    </div>

    <div className="flex-1">
      <div className="flex items-baseline justify-between">
        <span className="aurora-label text-[10px] text-white/40">{label}</span>
        <span className="aurora-data text-xs text-white/60">{detail}</span>
      </div>

      <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-white/[0.04]">
        <motion.div
          className={`h-full rounded-full ${factorBarColor(value)}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.round(value * 100)}%` }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          style={{ opacity: 0.7 }}
        />
      </div>
    </div>
  </div>
);

const CircularGauge = ({ probability }: { probability: number }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const arc = circumference * 0.75; // 270 degrees
  const offset = arc - (probability / 100) * arc;

  return (
    <div className="relative mx-auto flex h-48 w-48 items-center justify-center">
      <svg
        viewBox="0 0 200 200"
        className="aurora-gauge-ring absolute inset-0 h-full w-full -rotate-[135deg]"
        style={{
          filter: `drop-shadow(0 0 12px ${gaugeGlow(probability)})`,
        }}
      >
        {/* Track */}
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth="6"
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
        />
        {/* Value */}
        <motion.circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={gaugeStroke(probability)}
          strokeWidth="6"
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>

      <div className="flex flex-col items-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={probability}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className={`aurora-data text-5xl font-semibold ${probabilityColor(probability)} ${probabilityGlow(probability)}`}
          >
            {probability}
            <span className="text-2xl text-white/30">%</span>
          </motion.span>
        </AnimatePresence>
        <span className="aurora-label mt-1 text-[10px] text-white/30">
          Viewing Probability
        </span>
      </div>
    </div>
  );
};

const ProbabilityDisplay = ({ probability, factors, loading }: Props) => {
  return (
    <div className="aurora-glass relative flex flex-col gap-1 overflow-hidden rounded-2xl p-5">
      {/* Subtle top accent gradient */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: `linear-gradient(90deg, transparent, ${gaugeStroke(probability)}40, transparent)`,
        }}
      />

      <div className="py-2">
        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-32 w-32 animate-pulse rounded-full bg-white/[0.03]" />
          </div>
        ) : (
          <CircularGauge probability={probability} />
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-white/[0.04]" />

      {/* Factors */}
      <div className="flex flex-col px-1">
        <FactorRow
          icon={<Eye size={16} />}
          label="Aurora Activity"
          value={factors.pGeo / 100}
          detail={`OVATION ${factors.pGeo}%`}
        />

        <FactorRow
          icon={<Cloud size={16} />}
          label="Cloud Cover"
          value={factors.fCloud}
          detail={factorLabel(factors.fCloud)}
        />

        <FactorRow
          icon={<Sun size={16} />}
          label="Darkness"
          value={factors.fDark}
          detail={factorLabel(factors.fDark)}
        />

        <FactorRow
          icon={<Moon size={16} />}
          label="Moon Phase"
          value={factors.fMoon}
          detail={factorLabel(factors.fMoon)}
        />
      </div>
    </div>
  );
};

export default ProbabilityDisplay;
