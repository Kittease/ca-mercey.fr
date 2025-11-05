import { cva } from "class-variance-authority";

import { cn } from "@/lib/tailwind";

import type { VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

const buttonVariants = cva(
  cn(
    "flex items-center gap-x-2 rounded-md border px-3 py-2 text-sm font-medium transition-all",
    "focus-visible:ring-1 focus-visible:outline-hidden",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  ),
  {
    variants: {
      variant: {
        primary: cn(
          "bg-stone-100 text-stone-950 border-stone-500",
          "hover:bg-stone-50",
          "focus-visible:ring-stone-300 focus-visible:bg-stone-50 focus-visible:border-stone-300"
        ),
        secondary: cn(
          "bg-stone-500 text-stone-50 border-stone-700",
          "hover:bg-stone-400",
          "focus-visible:ring-stone-300 focus-visible:bg-stone-400 focus-visible:border-stone-300"
        ),
        destructive: cn(
          "bg-red-600 text-red-50 border-red-800",
          "hover:bg-red-500",
          "focus-visible:ring-red-400 focus-visible:bg-red-500 focus-visible:border-red-400"
        ),
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  }
);

const Button = ({
  variant,
  className,
  ...restProps
}: ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>) => {
  return (
    <button
      className={cn(buttonVariants({ variant }), className)}
      {...restProps}
    />
  );
};

export default Button;
