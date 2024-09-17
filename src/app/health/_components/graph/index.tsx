"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Area, Bar, ComposedChart, XAxis, YAxis } from "recharts";

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
import { DayData } from "@/app/health/types";

const getTotalSwimmingDistance = (
  {
    weight,
    crawlSwimmingDistance,
    breaststrokeSwimmingDistance,
    backstrokeSwimmingDistance,
    freestyleSwimmingDistance,
    totalSwimmingDistance,
  }: DayData,
  index: number
) => {
  const valuesTotal =
    (crawlSwimmingDistance ?? 0) +
    (breaststrokeSwimmingDistance ?? 0) +
    (backstrokeSwimmingDistance ?? 0) +
    (freestyleSwimmingDistance ?? 0) +
    (totalSwimmingDistance ?? 0);

  // Nothing to display if no swimming was done this day
  if (valuesTotal === 0) {
    return null;
  }

  const valuesCount =
    (weight !== null && weight !== undefined ? 1 : 0) +
    (crawlSwimmingDistance !== null && crawlSwimmingDistance !== undefined
      ? 1
      : 0) +
    (breaststrokeSwimmingDistance !== null &&
    breaststrokeSwimmingDistance !== undefined
      ? 1
      : 0) +
    (backstrokeSwimmingDistance !== null &&
    backstrokeSwimmingDistance !== undefined
      ? 1
      : 0) +
    (freestyleSwimmingDistance !== null &&
    freestyleSwimmingDistance !== undefined
      ? 1
      : 0) +
    (totalSwimmingDistance !== null && totalSwimmingDistance !== undefined
      ? 1
      : 0);

  // Nothing to display if the sum already exists
  if (totalSwimmingDistance !== null && totalSwimmingDistance !== undefined) {
    return null;
  }

  // Nothing to display if we're not on the last element
  if (index < valuesCount - 1) {
    return null;
  }

  return (
    (crawlSwimmingDistance ?? 0) +
    (breaststrokeSwimmingDistance ?? 0) +
    (backstrokeSwimmingDistance ?? 0) +
    (freestyleSwimmingDistance ?? 0)
  );
};

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
    crawlSwimmingDistance: {
      label: "Distance nagée en crawl",
      color: "hsl(196.4 63.6% 23.7%)", // cyan-900
    },
    breaststrokeSwimmingDistance: {
      label: "Distance nagée en brasse",
      color: "hsl(192.9 82.3% 31%)", // cyan-700
    },
    backstrokeSwimmingDistance: {
      label: "Distance nagée en dos crawlé",
      color: "hsl(188.7 94.5% 42.7%)", // cyan-500
    },
    freestyleSwimmingDistance: {
      label: "Distance nagée en nage libre",
      color: "hsl(187 92.4% 69%)", // cyan-300
    },
    totalSwimmingDistance: {
      label: "Distance nagée totale",
      color: "hsl(191.6 91.4% 36.5%)", // cyan-600
    },
    bikingDistance: {
      label: "Distance de vélo",
      color: "hsl(20.5 90.2% 48.2%)", // orange-600
    },
    rowingDistance: {
      label: "Distance de rameur",
      color: "hsl(27 96% 61%)", // orange-400
    },
    runningDistance: {
      label: "Distance de course",
      color: "hsl(32.1 97.7% 83.1%)", // orange-200
    },
  };

  const formattedData = data.map(({ date, ...rest }) => ({
    ...rest,
    date: new Date(date).getTime(),
  }));

  return (
    <Card className="size-full max-h-screen max-w-full">
      <CardHeader className="space-y-0 pb-2">
        <CardDescription>Latest weight</CardDescription>
        <CardTitle className="text-2xl font-bold">
          {`${latestWeight.toFixed(1)} kg`}
        </CardTitle>
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
              ]}
              type="number"
              domain={["auto", "auto"]}
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

            <Bar
              yAxisId="right"
              dataKey="crawlSwimmingDistance"
              stackId="fitness"
              fill="var(--color-crawlSwimmingDistance)"
            />

            <Bar
              yAxisId="right"
              dataKey="breaststrokeSwimmingDistance"
              stackId="fitness"
              fill="var(--color-breaststrokeSwimmingDistance)"
            />

            <Bar
              yAxisId="right"
              dataKey="backstrokeSwimmingDistance"
              stackId="fitness"
              fill="var(--color-backstrokeSwimmingDistance)"
            />

            <Bar
              yAxisId="right"
              dataKey="freestyleSwimmingDistance"
              stackId="fitness"
              fill="var(--color-freestyleSwimmingDistance)"
            />

            <Bar
              yAxisId="right"
              dataKey="totalSwimmingDistance"
              stackId="fitness"
              fill="var(--color-totalSwimmingDistance)"
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(distance) =>
                `${distance.toLocaleString("fr-FR")} m`
              }
            />

            <Bar
              yAxisId="right"
              dataKey="bikingDistance"
              stackId="fitness"
              fill="var(--color-bikingDistance)"
            />

            <Bar
              yAxisId="right"
              dataKey="rowingDistance"
              stackId="fitness"
              fill="var(--color-rowingDistance)"
            />

            <Bar
              yAxisId="right"
              dataKey="runningDistance"
              stackId="fitness"
              fill="var(--color-runningDistance)"
            />

            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  // eslint-disable-next-line react/no-unstable-nested-components
                  formatter={(value, name, item, index) => {
                    const totalSwimmingDistance = getTotalSwimmingDistance(
                      item.payload,
                      index
                    );

                    if (
                      totalSwimmingDistance !== null &&
                      name === "totaleSwimmingDistance"
                    ) {
                      return null;
                    }

                    return (
                      <>
                        {index === 0 ? (
                          <div className="w-full font-medium">
                            {format(item.payload.date, "d MMMM yyyy", {
                              locale: fr,
                            })}
                          </div>
                        ) : null}

                        <div
                          className="size-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={
                            {
                              "--color-bg": `var(--color-${name})`,
                            } as React.CSSProperties
                          }
                        />
                        {chartConfig[name as keyof typeof chartConfig]?.label}

                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {value.toLocaleString("fr-FR")}
                          <span className="text-muted-foreground">
                            {name === "weight" ? "kg" : "m"}
                          </span>
                        </div>

                        {totalSwimmingDistance !== null ? (
                          <div className="flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                            Distance nagée totale
                            <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                              {totalSwimmingDistance}
                              <span className="text-muted-foreground">m</span>
                            </div>
                          </div>
                        ) : null}
                      </>
                    );
                  }}
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
