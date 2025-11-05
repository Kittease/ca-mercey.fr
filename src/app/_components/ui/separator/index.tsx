"use client";

import { Separator as SeparatorPrimitive } from "@base-ui-components/react/separator";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Separator = ({
  className,
  orientation = "horizontal",
  ...restProps
}: ComponentProps<typeof SeparatorPrimitive>) => {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "bg-foreground/15 shrink-0",
        "data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full",
        "data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
        className
      )}
      {...restProps}
    />
  );
};

export default Separator;
