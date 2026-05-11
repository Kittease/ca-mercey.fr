"use client";

import { ComponentProps } from "react";

import { cn } from "@/lib/tailwind";

interface LabelProps extends ComponentProps<"label"> {
  htmlFor: NonNullable<ComponentProps<"label">["htmlFor"]>;
}

const Label = ({ className, htmlFor, ...restProps }: LabelProps) => {
  return (
    <label
      data-slot="label"
      htmlFor={htmlFor}
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...restProps}
    />
  );
};

export default Label;
