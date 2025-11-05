"use client";

import { Progress as ProgressPrimitive } from "@base-ui-components/react/progress";

import type { ComponentProps } from "react";

const Progress = (props: ComponentProps<typeof ProgressPrimitive.Root>) => {
  return (
    <ProgressPrimitive.Root data-slot="progress" {...props}>
      <ProgressPrimitive.Track className="h-2 w-full overflow-hidden rounded-full bg-primary/20">
        <ProgressPrimitive.Indicator
          data-slot="progress-indicator"
          className="bg-primary transition-all"
        />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
  );
};

export default Progress;
