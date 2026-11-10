"use client";

import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import { SearchIcon } from "lucide-react";

import { cn } from "@/lib/tailwind";

const Combobox = ComboboxPrimitive.Root;

const ComboboxTrigger = ({
  className,
  ...restProps
}: ComboboxPrimitive.Trigger.Props) => {
  return (
    <ComboboxPrimitive.Trigger
      data-slot="combobox-trigger"
      className={cn("[&_svg:not([class*='size-'])]:size-4", className)}
      {...restProps}
    />
  );
};

const ComboboxContent = ({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "end",
  alignOffset = 0,
  ...restProps
}: ComboboxPrimitive.Popup.Props &
  Pick<
    ComboboxPrimitive.Positioner.Props,
    "side" | "align" | "sideOffset" | "alignOffset"
  >) => {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        className="isolate z-50"
      >
        <ComboboxPrimitive.Popup
          data-slot="combobox-content"
          className={cn(
            "group/combobox-content relative isolate z-50 max-h-(--available-height) w-80 max-w-(--available-width) origin-(--transform-origin) animate-none! overflow-hidden rounded-md bg-popover/70 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            className,
          )}
          {...restProps}
        />
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
};

const ComboboxInput = ({
  className,
  ...restProps
}: ComboboxPrimitive.Input.Props) => {
  return (
    <div
      data-slot="combobox-input"
      className="flex items-center gap-2 border-b border-foreground/10 px-3"
    >
      <SearchIcon className="size-4 shrink-0 text-muted-foreground" />

      <ComboboxPrimitive.Input
        className={cn(
          "h-10 w-full bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground",
          className,
        )}
        {...restProps}
      />
    </div>
  );
};

const ComboboxList = ({
  className,
  ...restProps
}: ComboboxPrimitive.List.Props) => {
  return (
    <ComboboxPrimitive.List
      data-slot="combobox-list"
      className={cn(
        "max-h-72 scroll-py-1 overflow-y-auto overscroll-contain p-1",
        className,
      )}
      {...restProps}
    />
  );
};

const ComboboxItem = ({
  className,
  ...restProps
}: ComboboxPrimitive.Item.Props) => {
  return (
    <ComboboxPrimitive.Item
      data-slot="combobox-item"
      className={cn(
        "relative flex w-full cursor-default items-center gap-2 rounded-sm p-2 text-sm outline-hidden select-none data-highlighted:bg-foreground/10 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...restProps}
    />
  );
};

const ComboboxGroup = ({
  className,
  ...restProps
}: ComboboxPrimitive.Group.Props) => {
  return (
    <ComboboxPrimitive.Group
      data-slot="combobox-group"
      className={cn(className)}
      {...restProps}
    />
  );
};

const ComboboxLabel = ({
  className,
  ...restProps
}: ComboboxPrimitive.GroupLabel.Props) => {
  return (
    <ComboboxPrimitive.GroupLabel
      data-slot="combobox-label"
      className={cn("px-2 py-1.5 text-xs text-muted-foreground", className)}
      {...restProps}
    />
  );
};

const ComboboxEmpty = ({
  className,
  ...restProps
}: ComboboxPrimitive.Empty.Props) => {
  return (
    <ComboboxPrimitive.Empty
      data-slot="combobox-empty"
      className={cn(
        "hidden p-1 group-data-empty/combobox-content:block",
        className,
      )}
      {...restProps}
    />
  );
};

const ComboboxSeparator = ({
  className,
  ...restProps
}: ComboboxPrimitive.Separator.Props) => {
  return (
    <ComboboxPrimitive.Separator
      data-slot="combobox-separator"
      className={cn("-mx-1 my-1 h-px bg-foreground/5", className)}
      {...restProps}
    />
  );
};

export {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
};
