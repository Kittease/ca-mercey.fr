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
  if (p >= 60) {return "text-green-400";}
  if (p >= 30) {return "text-yellow-400";}
  if (p >= 10) {return "text-orange-400";}
  return "text-red-400";
}

function probabilityBg(p: number): string {
  if (p >= 60) {return "from-green-500/20 to-green-500/5";}
  if (p >= 30) {return "from-yellow-500/20 to-yellow-500/5";}
  if (p >= 10) {return "from-orange-500/20 to-orange-500/5";}
  return "from-red-500/20 to-red-500/5";
}

function factorLabel(value: number): string {
  if (value >= 0.8) {return "Excellent";}
  if (value >= 0.5) {return "Good";}
  if (value >= 0.2) {return "Fair";}
  return "Poor";
}

const FactorCard = ({
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
  <div className="flex items-center gap-3 rounded-lg border border-neutral-800 bg-neutral-900/50 p-3">
    <div className="text-neutral-400">{icon}</div>

    <div className="flex-1">
      <p className="text-xs text-neutral-500">{label}</p>

      <p className="text-sm font-medium text-neutral-200">{detail}</p>
    </div>

    <span className="text-sm font-semibold text-neutral-300">
      {Math.round(value * 100)}%
    </span>
  </div>
);

const ProbabilityDisplay = ({ probability, factors, loading }: Props) => {
  return (
    <div
      className={`flex flex-col gap-3 rounded-xl border border-neutral-800 bg-gradient-to-b ${probabilityBg(probability)} p-5`}
    >
      <p className="text-center text-xs font-medium tracking-wider text-neutral-400 uppercase">
        Viewing Probability
      </p>

      <div className="flex items-center justify-center py-2">
        {loading ? (
          <div className="h-16 w-24 animate-pulse rounded-lg bg-neutral-800" />
        ) : (
          <AnimatePresence mode="wait">
            <motion.span
              key={probability}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`text-6xl font-bold tabular-nums ${probabilityColor(probability)}`}
            >
              {probability}%
            </motion.span>
          </AnimatePresence>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <FactorCard
          icon={<Eye size={18} />}
          label="Aurora Activity"
          value={factors.pGeo / 100}
          detail={`OVATION: ${factors.pGeo}%`}
        />

        <FactorCard
          icon={<Cloud size={18} />}
          label="Cloud Cover"
          value={factors.fCloud}
          detail={factorLabel(factors.fCloud)}
        />

        <FactorCard
          icon={<Sun size={18} />}
          label="Darkness"
          value={factors.fDark}
          detail={factorLabel(factors.fDark)}
        />

        <FactorCard
          icon={<Moon size={18} />}
          label="Moon"
          value={factors.fMoon}
          detail={factorLabel(factors.fMoon)}
        />
      </div>
    </div>
  );
};

export default ProbabilityDisplay;
