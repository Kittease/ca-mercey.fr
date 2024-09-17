"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Area, ComposedChart, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/_components/ui/chart";
import WeightInput from "@/app/health/_components/weight-input";
import { DayData } from "@/app/health/types";
import { cn } from "@/lib/tailwind";

interface GraphProps {
  data: DayData[];
  latestWeight: number;
}

const Graph = ({ data, latestWeight }: GraphProps) => {
  const chartConfig = {
    weight: {
      label: "Poids",
      color: "hsl(160.1 84.1% 39.4%)", // emerald-500
    },
  };

  const formattedData = data.map(({ date, ...rest }) => ({
    ...rest,
    date: new Date(date).getTime(),
  }));

  return (
    <Card className="size-full max-h-screen max-w-full">
      <CardHeader className="grid grid-cols-[auto_max-content] space-y-0 pl-10">
        <CardDescription className="col-start-1 row-start-1 text-sm md:text-base">
          Latest weight
        </CardDescription>
        <CardTitle className="col-start-1 row-start-2 text-xl font-bold md:text-2xl">
          {`${latestWeight.toFixed(1)} kg`}
        </CardTitle>

        <WeightInput className="col-start-2 row-span-2 row-start-1" />
      </CardHeader>

      <CardContent>
        <ChartContainer config={chartConfig}>
          <ComposedChart accessibilityLayer data={formattedData}>
            <XAxis
              dataKey="date"
              tickFormatter={(date) => format(date, "dd MMMM")}
              ticks={[
                new Date("2024-01-01").getTime(),
                new Date("2024-02-01").getTime(),
                new Date("2024-03-01").getTime(),
                new Date("2024-04-01").getTime(),
                new Date("2024-05-01").getTime(),
                new Date("2024-06-01").getTime(),
                new Date("2024-07-01").getTime(),
                new Date("2024-08-01").getTime(),
                new Date("2024-09-01").getTime(),
                new Date("2024-10-01").getTime(),
                new Date("2024-11-01").getTime(),
                new Date("2024-12-01").getTime(),
                new Date("2025-01-01").getTime(),
                new Date().getTime(),
              ]}
              type="number"
              domain={["auto"]}
              scale="time"
            />

            <Area
              yAxisId="left"
              dataKey="weight"
              type="monotone"
              fill="url(#fillWeight)"
              fillOpacity={0.4}
              stroke="var(--color-weight)"
              strokeWidth={2}
            />

            <defs>
              <linearGradient id="fillWeight" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-weight)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-weight)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>

            <YAxis
              yAxisId="left"
              orientation="left"
              domain={[110, 125]}
              tickCount={6}
              tickLine={false}
              tickFormatter={(weight) => `${weight} kg`}
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  // eslint-disable-next-line react/no-unstable-nested-components
                  formatter={(value, name, item) => (
                    <div
                      className={cn(
                        "relative flex flex-col gap-y-1 rounded-md bg-emerald-950 px-4 py-2 md:px-8 md:py-4",
                        "before:absolute before:inset-y-0 before:left-0 before:w-1.5 before:rounded-l-md before:bg-[--color-bg] before:md:w-2.5"
                      )}
                      style={
                        {
                          "--color-bg": `var(--color-${name})`,
                        } as React.CSSProperties
                      }
                    >
                      <p className="w-full text-sm font-bold md:text-lg">
                        {format(item.payload.date, "d MMMM yyyy", {
                          locale: fr,
                        })}
                      </p>

                      <p className="flex items-baseline gap-x-0.5 font-mono text-xs font-medium tabular-nums text-foreground md:text-base">
                        {value.toLocaleString("fr-FR")}
                        <span className="text-muted-foreground">kg</span>
                      </p>
                    </div>
                  )}
                  className="border-0 p-0 shadow-md"
                />
              }
              cursor={false}
              defaultIndex={1}
            />
          </ComposedChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Graph;
