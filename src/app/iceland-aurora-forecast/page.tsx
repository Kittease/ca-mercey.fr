"use server";

import { addMinutes, format } from "date-fns";
import { Suspense } from "react";
import { createWorker } from "tesseract.js";

import ServerSideAwait from "@/app/_components/await/server";
import AuroraAnimation from "@/app/iceland-aurora-forecast/_components/animation";
import ForecastImage from "@/app/iceland-aurora-forecast/_components/frame";
import { ForecastFrame } from "@/app/iceland-aurora-forecast/types";
import { cn } from "@/lib/tailwind";

const fetchOvationFrames = async (): Promise<ForecastFrame[]> => {
  const baseUrl = "https://services.swpc.noaa.gov";

  const res = await fetch(
    `${baseUrl}/products/animations/ovation_north_24h.json`,
    {
      next: { revalidate: 300 },
      headers: { accept: "application/json", "cache-control": "no-cache" },
    }
  );

  if (!res.ok) {
    return [];
  }

  const data = (await res.json()) as ForecastFrame[];

  return Array.isArray(data)
    ? data.map((frame) => ({
        url: `${baseUrl}${frame.url}`,
        time_tag: frame.time_tag,
      }))
    : [];
};

const extractForecastLeadTime = async (
  imageUrl: string
): Promise<number | undefined> => {
  const res = await fetch(imageUrl, { cache: "no-store" });
  if (!res.ok) {
    return undefined;
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  const worker = await createWorker("eng");

  const { data } = await worker.recognize(buffer, {
    rectangle: {
      left: 800 - 120,
      top: 0,
      width: 120,
      height: 25,
    },
  });

  await worker.terminate();

  const matches = data.text.match(/([0-9]+) minutes/);
  if (matches && matches[1]) {
    return Number(matches[1]);
  }
  return undefined;
};

const IcelandAuroraForecastPage = async () => {
  const frames = await fetchOvationFrames();

  if (frames.length === 0) {
    return <div>No frames found</div>;
  }

  const lastFrame = frames[frames.length - 1];
  const periodStart = format(lastFrame.time_tag, "HH'h'mm");
  const periodDefaultEnd = `~${format(
    addMinutes(lastFrame.time_tag, 30),
    "HH'h'mm"
  )}`;

  return (
    <div className="mx-auto p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-6">
        <div className={cn("flex flex-col gap-y-4", "md:col-span-3")}>
          <ForecastImage frame={lastFrame} />

          <h2 className="flex flex-row justify-center gap-x-1 font-semibold">
            <span>Forecast for the period</span>

            <span className="italic">{periodStart}</span>

            <span>-</span>

            <span className="italic">
              <Suspense fallback={periodDefaultEnd}>
                <ServerSideAwait
                  promise={extractForecastLeadTime(lastFrame.url)}
                >
                  {(leadTime) =>
                    leadTime
                      ? format(
                          addMinutes(lastFrame.time_tag, leadTime),
                          "HH'h'mm"
                        )
                      : periodDefaultEnd
                  }
                </ServerSideAwait>
              </Suspense>
            </span>
          </h2>
        </div>

        <AuroraAnimation
          frames={frames}
          className={cn(
            "row-start-3 md:row-start-1",
            "md:col-start-4 md:col-span-3"
          )}
        />

        <div
          className={cn(
            "flex w-full flex-col row-start-2",
            "md:col-span-2 md:col-start-3"
          )}
        >
          <p className="flex w-full flex-row justify-between">
            <span>10%</span>

            <span>50%</span>

            <span>90%</span>
          </p>

          <div className="h-8 w-full rounded-lg border bg-gradient-to-r from-green-500 via-yellow-400 via-70% to-red-500" />

          <a
            href="https://www.swpc.noaa.gov/products/aurora-30-minute-forecast"
            target="_blank"
            className="text-center text-blue-300 underline"
          >
            View more details
          </a>
        </div>
      </div>
    </div>
  );
};

export default IcelandAuroraForecastPage;
