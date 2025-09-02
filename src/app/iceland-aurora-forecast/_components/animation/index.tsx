"use client";

import { format } from "date-fns";
import { useEffect, useRef, useState } from "react";

import ForecastImage from "@/app/iceland-aurora-forecast/_components/frame";
import { ForecastFrame } from "@/app/iceland-aurora-forecast/types";

type AuroraAnimationProps = {
  frames: ForecastFrame[];
};

const AuroraAnimation = ({ frames }: AuroraAnimationProps) => {
  const frameCount = frames.length;
  const frameIntervalMs = 150;

  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1 >= frameCount ? 0 : prev + 1));
    }, frameIntervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col gap-y-4">
      <ForecastImage frame={frames[currentIndex]} />

      <h2 className="text-center font-semibold">
        {format(
          frames[currentIndex].time_tag,
          "'Aurora forecast at' HH'h'mm', on the' do 'of' MMMM yyyy"
        )}
      </h2>
    </div>
  );
};

export default AuroraAnimation;
