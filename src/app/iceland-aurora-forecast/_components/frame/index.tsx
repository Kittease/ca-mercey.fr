import { ForecastFrame } from "@/app/iceland-aurora-forecast/types";
import { cn } from "@/lib/tailwind";

interface ForecastImageProps {
  frame: ForecastFrame;
}

const ForecastImage = ({ frame }: ForecastImageProps) => {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-full border-2 border-neutral-700",
        "[--shadow-size:300px]",
        "after:content-[''] after:pointer-events-none after:absolute after:inset-[calc(-1*var(--shadow-size))] after:-translate-x-[100px] after:-translate-y-[75px] after:blur-3xl after:border-(length:--shadow-size) after:border-black/75 after:rounded-full"
      )}
    >
      {
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={frame.url}
          alt={`Aurora forecast for the next ~30m at ${frame.time_tag}`}
          className={cn(
            "relative rotate-80 -translate-x-[22.5%] scale-250 -translate-y-[47.5%]"
          )}
        />
      }
    </div>
  );
};

export default ForecastImage;
