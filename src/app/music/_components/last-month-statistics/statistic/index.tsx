import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { cn } from "@/lib/tailwind";

interface StatisticProps {
  label: string;
  stat: string;
  diff: number;
  Icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  className?: string;
}

const Statistic = ({ label, stat, diff, Icon, className }: StatisticProps) => {
  return (
    <div
      className={cn("flex flex-row items-center gap-x-4 md:gap-x-6", className)}
    >
      <Icon className="size-8 stroke-1 md:size-12" />

      <div className="flex flex-col md:gap-y-2">
        <div className="flex flex-row items-baseline gap-x-2 md:gap-x-4">
          <p className="text-lg font-bold md:text-2xl">{stat}</p>
          <p
            className={cn(
              "text-sm md:text-lg",
              diff > 0 ? "text-green-600" : "text-red-600"
            )}
          >
            ({diff > 0 ? "+" : null}
            {diff}%)
          </p>
        </div>

        <p className="text-base text-stone-400 md:text-lg">{label}</p>
      </div>
    </div>
  );
};

export default Statistic;
