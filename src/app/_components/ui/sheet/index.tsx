"use client";

import { Dialog as SheetPrimitive } from "@base-ui-components/react/dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/tailwind";

import type { ComponentProps } from "react";

const Sheet = (props: ComponentProps<typeof SheetPrimitive.Root>) => {
  return <SheetPrimitive.Root data-slot="sheet" {...props} />;
};

const SheetTrigger = (props: ComponentProps<typeof SheetPrimitive.Trigger>) => {
  return <SheetPrimitive.Trigger data-slot="sheet-trigger" {...props} />;
};

const SheetClose = (props: ComponentProps<typeof SheetPrimitive.Close>) => {
  return <SheetPrimitive.Close data-slot="sheet-close" {...props} />;
};

const SheetPortal = (props: ComponentProps<typeof SheetPrimitive.Portal>) => {
  return <SheetPrimitive.Portal data-slot="sheet-portal" {...props} />;
};

const SheetOverlay = ({
  className,
  ...restProps
}: ComponentProps<typeof SheetPrimitive.Backdrop>) => {
  return (
    <SheetPrimitive.Backdrop
      data-slot="sheet-overlay"
      className={cn(
        "fixed inset-0 z-50 bg-black/50",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      {...restProps}
    />
  );
};

const SheetContent = ({
  className,
  children,
  side = "right",
  ...restProps
}: ComponentProps<typeof SheetPrimitive.Popup> & {
  side?: "top" | "right" | "bottom" | "left";
}) => {
  return (
    <SheetPortal keepMounted>
      <SheetOverlay />

      <SheetPrimitive.Popup
        data-slot="sheet-content"
        className={cn(
          "bg-background fixed z-50 flex flex-col gap-y-4 p-8 shadow-lg transition ease-in-out",
          "data-[state=open]:animate-in data-[state=open]:duration-500",
          "data-[state=closed]:animate-out data-[state=closed]:duration-300",
          {
            top: cn(
              "inset-x-0 top-0 h-auto border-b",
              "data-[state=open]:slide-in-from-top",
              "data-[state=closed]:slide-out-to-top"
            ),
            right: cn(
              "inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-xl",
              "data-[state=open]:slide-in-from-right",
              "data-[state=closed]:slide-out-to-right"
            ),
            bottom: cn(
              "inset-x-0 bottom-0 h-auto border-t",
              "data-[state=open]:slide-in-from-bottom",
              "data-[state=closed]:slide-out-to-bottom"
            ),
            left: cn(
              "inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-xl",
              "data-[state=open]:slide-in-from-left",
              "data-[state=closed]:slide-out-to-left"
            ),
          }[side],
          className
        )}
        {...restProps}
      >
        {children}
      </SheetPrimitive.Popup>
    </SheetPortal>
  );
};

const SheetHeader = ({
  className,
  children,
  ...restProps
}: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sheet-header"
      className={cn(
        "mb-4 flex flex-row items-center justify-between gap-x-2",
        className
      )}
      {...restProps}
    >
      {children}

      <SheetPrimitive.Close
        className={cn(
          "ring-offset-background rounded-xs opacity-50 transition-opacity",
          "hover:opacity-100",
          "focus:ring-ring focus:ring-2 focus:ring-offset-2 focus:outline-hidden",
          "disabled:pointer-events-none"
        )}
      >
        <XIcon className="size-5" />

        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </div>
  );
};

const SheetTitle = ({
  className,
  ...restProps
}: ComponentProps<typeof SheetPrimitive.Title>) => {
  return (
    <SheetPrimitive.Title
      data-slot="sheet-title"
      className={cn("text-foreground font-semibold", className)}
      {...restProps}
    />
  );
};

const SheetDescription = ({
  className,
  ...restProps
}: ComponentProps<typeof SheetPrimitive.Description>) => {
  return (
    <SheetPrimitive.Description
      data-slot="sheet-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...restProps}
    />
  );
};

const SheetFooter = ({ className, ...restProps }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="sheet-footer"
      className={cn("mt-auto flex flex-col gap-y-2", className)}
      {...restProps}
    />
  );
};

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
};
