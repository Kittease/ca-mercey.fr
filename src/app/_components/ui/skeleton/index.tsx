import { ComponentProps } from "react";

import { cn } from "@/lib/tailwind";

const Skeleton = ({ className, ...restProps }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-muted", className)}
      {...restProps}
    />
  );
};

export default Skeleton;
