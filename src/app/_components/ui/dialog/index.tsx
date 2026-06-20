"use client";

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import { XIcon } from "lucide-react";
import { ComponentProps } from "react";

import { Button } from "@/app/_components/ui/button";
import { cn } from "@/lib/tailwind";

const Dialog = (props: DialogPrimitive.Root.Props) => {
  return <DialogPrimitive.Root data-slot="dialog" {...props} />;
};

const DialogTrigger = (props: DialogPrimitive.Trigger.Props) => {
  return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
};

const DialogPortal = (props: DialogPrimitive.Portal.Props) => {
  return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
};

const DialogClose = (props: DialogPrimitive.Close.Props) => {
  return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
};

const DialogOverlay = ({
  className,
  ...restProps
}: DialogPrimitive.Backdrop.Props) => {
  return (
    <DialogPrimitive.Backdrop
      data-slot="dialog-overlay"
      className={cn(
        "fixed inset-0 isolate z-50 bg-black/10 duration-100 supports-backdrop-filter:backdrop-blur-xs data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...restProps}
    />
  );
};

const DialogContent = ({
  className,
  children,
  size = "default",
  showCloseButton = true,
  ...restProps
}: DialogPrimitive.Popup.Props & {
  size?: "default" | "sm";
  showCloseButton?: boolean;
}) => {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Popup
        data-slot="dialog-content"
        data-size={size}
        className={cn(
          "fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-6 rounded-xl bg-popover p-6 text-sm text-popover-foreground ring-1 ring-foreground/10 duration-100 outline-none data-[size=default]:sm:max-w-lg data-[size=sm]:sm:max-w-sm data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...restProps}
      >
        {children}

        {showCloseButton ? (
          <DialogPrimitive.Close
            data-slot="dialog-close"
            render={<Button variant="ghost" size="icon-sm" />}
            className="absolute top-4 right-4"
          >
            <XIcon />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        ) : null}
      </DialogPrimitive.Popup>
    </DialogPortal>
  );
};

const DialogHeader = ({ className, ...restProps }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="dialog-header"
      className={cn("flex flex-col gap-2", className)}
      {...restProps}
    />
  );
};

const DialogFooter = ({ className, ...restProps }: ComponentProps<"div">) => {
  return (
    <div
      data-slot="dialog-footer"
      className={cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className,
      )}
      {...restProps}
    />
  );
};

const DialogTitle = ({
  className,
  ...restProps
}: DialogPrimitive.Title.Props) => {
  return (
    <DialogPrimitive.Title
      data-slot="dialog-title"
      className={cn("font-heading text-lg leading-none font-medium", className)}
      {...restProps}
    />
  );
};

const DialogDescription = ({
  className,
  ...restProps
}: DialogPrimitive.Description.Props) => {
  return (
    <DialogPrimitive.Description
      data-slot="dialog-description"
      className={cn(
        "text-sm text-muted-foreground *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...restProps}
    />
  );
};

export {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
};
