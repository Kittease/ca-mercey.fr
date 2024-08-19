"use client";

import { LucideIcon } from "lucide-react";
import { ButtonHTMLAttributes, Fragment } from "react";

import { cn } from "@/lib/tailwind";

interface PageButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  Icon: LucideIcon;
  text: string;
}

const PageButton = ({
  children,
  Icon,
  text,
  className,
  ...rest
}: PageButtonProps) => {
  const lines = text.split("\n");

  return (
    <button
      type="button"
      className={cn(
        "group relative flex h-fit w-full items-center overflow-hidden rounded-xl border bg-stone-800",
        "border-stone-600 drop-shadow-md transition-all ease-in-out sm:hover:border-stone-500 sm:hover:drop-shadow-lg",
        className
      )}
      {...rest}
    >
      <div className="absolute z-0">{children}</div>

      <div
        className={cn(
          "relative z-10 w-full px-16 py-12",
          "before:absolute before:inset-0 before:z-0 before:bg-gradient-to-tr before:from-stone-950/95 before:to-stone-700/90",
          "before:opacity-100 before:transition-all before:ease-in-out sm:hover:before:opacity-95"
        )}
      >
        <div className="relative z-10 flex flex-col items-center justify-center gap-y-6">
          <Icon className="size-12" />
          <p className="text-center text-3xl">
            {lines.map((line, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={i}>
                {line}
                {lines.length > i + 1 ? <br /> : null}
              </Fragment>
            ))}
          </p>
        </div>
      </div>
    </button>
  );
};

export default PageButton;
