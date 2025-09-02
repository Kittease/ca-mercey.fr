"use server";

import { Suspense } from "react";
import { createWorker } from "tesseract.js";

import ServerSideAwait from "@/app/_components/await/server";
import AuroraAnimation from "@/app/iceland-aurora-forecast/_components/animation";
import ForecastImage from "@/app/iceland-aurora-forecast/_components/frame";
import { ForecastFrame } from "@/app/iceland-aurora-forecast/types";

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
): Promise<string | undefined> => {
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
    return matches[1];
  }
  return undefined;
};

const IcelandAuroraForecastPage = async () => {
  const frames = await fetchOvationFrames();

  if (frames.length === 0) {
    return <div>No frames found</div>;
  }

  const lastFrame = frames[frames.length - 1];

  return (
    <div className="mx-auto p-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-y-4">
          <ForecastImage frame={lastFrame} />

          <h2 className="text-center font-semibold">
            <Suspense fallback="Forecast, next ~30 minutes">
              <ServerSideAwait promise={extractForecastLeadTime(lastFrame.url)}>
                {(leadTime) =>
                  leadTime
                    ? `Forecast, next ${leadTime} minutes`
                    : "Forecast, next ~30 minutes"
                }
              </ServerSideAwait>
            </Suspense>
          </h2>
        </div>

        <AuroraAnimation frames={frames} />
      </div>
    </div>
  );
};

export default IcelandAuroraForecastPage;
