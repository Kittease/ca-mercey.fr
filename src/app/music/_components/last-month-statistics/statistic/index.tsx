import { cn } from "@/lib/tailwind";

interface StatisticProps {
  label: string;
  stat: string;
  diff: number;
  className?: string;
}

const Statistic = ({ label, stat, diff, className }: StatisticProps) => {
  return (
    <div className={cn("flex flex-col gap-y-2", className)}>
      <div className="flex flex-row items-baseline gap-x-4">
        <p className="text-2xl font-bold">{stat}</p>
        <p
          className={cn(
            "text-lg",
            diff > 0 ? "text-green-600" : "text-red-600"
          )}
        >
          ({diff}%)
        </p>
      </div>

      <p className="text-lg text-stone-400">{label}</p>
    </div>
  );
};

export default Statistic;
