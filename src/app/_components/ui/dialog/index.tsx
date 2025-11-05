"use client";

import { Dialog as DialogPrimitive } from "@base-ui-components/react/dialog";

import { cn } from "@/lib/tailwind";

import type { ComponentProps, HTMLAttributes } from "react";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogBackdrop = ({
  className,
  ...restProps
}: ComponentProps<typeof DialogPrimitive.Backdrop>) => (
  <DialogPrimitive.Backdrop
    className={cn(
      "fixed inset-0 z-50 bg-black/50",
      "data-[state=open]:animate-in data-[state=open]:fade-in-0",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
      className
    )}
    {...restProps}
  />
);

const DialogContent = ({
  className,
  children,
  ...restProps
}: ComponentProps<typeof DialogPrimitive.Popup>) => (
  <DialogPortal keepMounted>
    <DialogBackdrop />

    <DialogPrimitive.Popup
      className={cn(
        "fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-md bg-stone-950 border border-stone-600 p-6 outline-none",
        "data-[state=open]:animate-in data-[state=open]:fade-in-0",
        "data-[state=closed]:animate-out data-[state=closed]:fade-out-0",
        className
      )}
      {...restProps}
    >
      {children}
    </DialogPrimitive.Popup>
  </DialogPortal>
);

const DialogHeader = ({
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("text-left", className)} {...restProps} />
);

const DialogFooter = ({
  className,
  ...restProps
}: HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "mt-4 flex gap-2",
      "flex-col-reverse",
      "sm:flex-row sm:justify-end",
      className
    )}
    {...restProps}
  />
);

const DialogTitle = ({
  className,
  ...restProps
}: ComponentProps<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title
    className={cn("text-lg font-semibold", className)}
    {...restProps}
  />
);

const DialogDescription = ({
  className,
  ...restProps
}: ComponentProps<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cn("text-sm text-stone-400", className)}
    {...restProps}
  />
);

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
