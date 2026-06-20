"use client";

import { format } from "date-fns";
import { InfoIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ReactNode } from "react";

import { Button } from "@/app/_components/ui/button";
import {
  ApertureIcon,
  CalendarIcon,
  CameraIcon,
  ClockIcon,
  FocalLengthIcon,
  HeightIcon,
  ISOIcon,
  LensIcon,
  LocationIcon,
  MegapixelsIcon,
  ShutterSpeedIcon,
  WidthIcon,
} from "@/app/_components/ui/icons";
import Separator from "@/app/_components/ui/separator";
import { Photo } from "@/domain/photography/services/photos/types";
import { cn } from "@/lib/tailwind";

const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];

const formatExposure = (exposureTime: number) =>
  exposureTime >= 1 ? `${exposureTime}s` : `1/${Math.round(1 / exposureTime)}s`;

const groupClassName = "grid grid-cols-2 content-start gap-x-4 gap-y-3";

interface ItemProps {
  icon: ReactNode;
  label: string;
  value: ReactNode;
  className?: string;
}

const Item = ({ icon, label, value, className }: ItemProps) => (
  <div data-slot="icon-wrapper" className={className}>
    {icon}

    <div data-slot="description-item">
      <dt>{label}</dt>

      <dd>{value}</dd>
    </div>
  </div>
);

interface MetadataPanelProps {
  photo: Photo;
  open: boolean;
  onToggle: () => void;
}

const MetadataPanel = ({ photo, open, onToggle }: MetadataPanelProps) => {
  const reduce = useReducedMotion();

  const { metadata, width, height } = photo;

  const hasContext = Boolean(metadata.captureTime || metadata.locationName);
  const hasGear = Boolean(
    metadata.camera ||
    metadata.lens ||
    metadata.focalLength ||
    metadata.aperture ||
    metadata.exposureTime ||
    metadata.iso,
  );

  return (
    <div className="absolute right-4 bottom-4 z-20 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: 0,
              y: reduce ? 0 : 8,
              transition: { duration: reduce ? 0 : 0.15, ease: EASE_OUT },
            }}
            transition={{ duration: reduce ? 0 : 0.2, ease: EASE_OUT }}
            className={cn(
              "relative isolate max-h-[70vh] w-72 overflow-y-auto overscroll-contain rounded-xl sm:w-136",
              "bg-popover/70 text-popover-foreground shadow-md ring-1 ring-foreground/10",
              "before:pointer-events-none before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-2xl before:backdrop-saturate-150",
              "p-4",
            )}
          >
            <dl
              className={cn(
                "grid gap-x-4 gap-y-3 sm:grid-cols-[1fr_auto_1fr] sm:items-start sm:gap-x-6",
                '**:data-[slot="icon-wrapper"]:flex **:data-[slot="icon-wrapper"]:flex-row **:data-[slot="icon-wrapper"]:items-center **:data-[slot="icon-wrapper"]:gap-x-2.5',
                '[&_[data-slot="icon-wrapper"]>svg]:size-5 [&_[data-slot="icon-wrapper"]>svg]:shrink-0 [&_[data-slot="icon-wrapper"]>svg]:text-muted-foreground',
                '**:data-[slot="description-item"]:flex **:data-[slot="description-item"]:min-w-0 **:data-[slot="description-item"]:flex-col [&_[data-slot="description-item"]>dt]:-mb-0.5',
                "[&_dt]:text-[10px] [&_dt]:tracking-wide [&_dt]:text-muted-foreground [&_dt]:uppercase",
                "[&_dd]:truncate [&_dd]:text-sm [&_dd]:text-popover-foreground",
              )}
            >
              {hasContext ? (
                <div
                  className={cn(
                    groupClassName,
                    "sm:col-start-3 sm:row-start-1",
                  )}
                >
                  {metadata.captureTime ? (
                    <>
                      <Item
                        icon={<CalendarIcon />}
                        label="Date"
                        value={format(metadata.captureTime, "dd/MM/yyyy")}
                      />

                      <Item
                        icon={<ClockIcon />}
                        label="Heure"
                        value={format(metadata.captureTime, "HH:mm")}
                      />
                    </>
                  ) : null}

                  {metadata.locationName ? (
                    <Item
                      className="col-span-2"
                      icon={<LocationIcon />}
                      label="Lieu"
                      value={metadata.locationName}
                    />
                  ) : null}
                </div>
              ) : null}

              {hasGear ? (
                <div
                  className={cn(
                    groupClassName,
                    "sm:col-start-1 sm:row-span-2 sm:row-start-1",
                  )}
                >
                  {hasContext ? (
                    <Separator className="col-span-2 my-0.5 sm:hidden" />
                  ) : null}

                  {metadata.camera ? (
                    <Item
                      className="col-span-2"
                      icon={<CameraIcon />}
                      label="Boîtier"
                      value={metadata.camera}
                    />
                  ) : null}

                  {metadata.lens ? (
                    <Item
                      className="col-span-2"
                      icon={<LensIcon />}
                      label="Objectif"
                      value={metadata.lens}
                    />
                  ) : null}

                  {metadata.focalLength ? (
                    <Item
                      icon={<FocalLengthIcon />}
                      label="Focale"
                      value={`${metadata.focalLength} mm`}
                    />
                  ) : null}

                  {metadata.aperture ? (
                    <Item
                      icon={<ApertureIcon />}
                      label="Ouverture"
                      value={`f/${metadata.aperture}`}
                    />
                  ) : null}

                  {metadata.exposureTime ? (
                    <Item
                      icon={<ShutterSpeedIcon />}
                      label="Vitesse"
                      value={formatExposure(metadata.exposureTime)}
                    />
                  ) : null}

                  {metadata.iso ? (
                    <Item
                      icon={<ISOIcon />}
                      label="ISO"
                      value={metadata.iso.toLocaleString("fr")}
                    />
                  ) : null}
                </div>
              ) : null}

              {hasGear ? (
                <Separator
                  orientation="vertical"
                  className="hidden sm:col-start-2 sm:row-span-2 sm:row-start-1 sm:block"
                />
              ) : null}

              <div
                className={cn(groupClassName, "sm:col-start-3 sm:row-start-2")}
              >
                {hasContext ? (
                  <Separator className="col-span-2 my-0.5" />
                ) : hasGear ? (
                  <Separator className="col-span-2 my-0.5 sm:hidden" />
                ) : null}

                <Item
                  icon={<MegapixelsIcon />}
                  label="Mégapixels"
                  value={`${((width * height) / 1_000_000).toFixed(1)} MP`}
                />

                <Item
                  icon={<WidthIcon />}
                  label="Largeur"
                  value={`${width.toLocaleString("fr")} px`}
                />

                <Item
                  icon={<HeightIcon />}
                  label="Hauteur"
                  value={`${height.toLocaleString("fr")} px`}
                />
              </div>
            </dl>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <Button
        onClick={onToggle}
        aria-label="Afficher les informations de la photo"
        variant="blur"
        size="icon-lg"
      >
        <InfoIcon className="size-6" />
      </Button>
    </div>
  );
};

export default MetadataPanel;
