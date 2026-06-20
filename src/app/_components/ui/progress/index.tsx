"use client";

import { Progress as ProgressPrimitive } from "@base-ui/react/progress";

import { cn } from "@/lib/tailwind";

const Progress = ({
  className,
  value,
  ...restProps
}: ProgressPrimitive.Root.Props) => {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      value={value}
      className={cn("w-full", className)}
      {...restProps}
    >
      <ProgressPrimitive.Track
        data-slot="progress-track"
        className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      >
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="h-full bg-primary transition-[width] duration-150"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
};

export default Progress;
