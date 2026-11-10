"use client";

import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "@/lib/tailwind";

const RadioGroup = ({ className, ...restProps }: RadioGroupPrimitive.Props) => {
  return (
    <RadioGroupPrimitive
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...restProps}
    />
  );
};

const RadioGroupItem = ({
  className,
  ...restProps
}: RadioPrimitive.Root.Props) => {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "relative flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-md border border-input bg-transparent p-3 text-sm shadow-xs transition-colors outline-none hover:bg-muted/50 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:border-primary data-checked:bg-primary/5 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-5",
        className,
      )}
      {...restProps}
    />
  );
};

export { RadioGroup, RadioGroupItem };
