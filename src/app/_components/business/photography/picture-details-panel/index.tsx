"use client";

import { format } from "date-fns";

import { cn } from "@/lib/tailwind";

import {
  ApertureIcon,
  CalendarIcon,
  CameraIcon,
  ClockIcon,
  FocalLengthIcon,
  HeightIcon,
  ISOIcon,
  LensIcon,
  MegapixelsIcon,
  PictureIcon,
  ShutterSpeedIcon,
  WidthIcon,
} from "@/app/_components/ui/icons";
import Separator from "@/app/_components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/app/_components/ui/sheet";

import type { Picture } from "@/domain/photography/services/pictures/types";

interface PictureDetailsPanelProps {
  picture: Picture;
  isOpen: boolean;
  handleOpen: (open: boolean) => void;
}

const PictureDetailsPanel = ({
  picture,
  isOpen,
  handleOpen,
}: PictureDetailsPanelProps) => {
  const date = picture.metadata?.date ? new Date(picture.metadata.date) : null;

  return (
    <Sheet open={isOpen} onOpenChange={handleOpen}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Picture details</SheetTitle>
        </SheetHeader>

        <div className="flex items-center justify-center rounded-md border bg-stone-50 p-4">
          <div className="relative h-80 w-full">
            {
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={picture.thumbnailUrl}
                alt={picture.name}
                className="absolute inset-0 size-full rounded-md object-contain"
              />
            }
          </div>
        </div>

        {picture.metadata ? (
          <dl
            className={cn(
              "grid grid-cols-3 gap-4",
              '[&_[data-slot="block"]]:col-span-3 [&_[data-slot="block"]]:my-3 [&_[data-slot="block"]]:grid [&_[data-slot="block"]]:grid-cols-subgrid [&_[data-slot="block"]]:gap-x-4 [&_[data-slot="block"]]:gap-y-6',
              '[&_[data-slot="separator"]]:col-span-3',
              '[&_[data-slot="icon-wrapper"]]:flex [&_[data-slot="icon-wrapper"]]:flex-row [&_[data-slot="icon-wrapper"]]:items-center [&_[data-slot="icon-wrapper"]]:gap-x-3',
              '[&_[data-slot="icon-wrapper"]>svg]:size-6 [&_[data-slot="icon-wrapper"]>svg]:shrink-0 [&_[data-slot="icon-wrapper"]>svg]:text-stone-950',
              '[&_[data-slot="description-item"]]:flex [&_[data-slot="description-item"]]:flex-col [&_[data-slot="description-item"]>dt]:-mb-1',
              "[&_dt]:text-[10px] [&_dt]:text-stone-400 [&_dt]:uppercase",
              "[&_dd]:text-sm [&_dd]:text-stone-950"
            )}
          >
            <div data-slot="block">
              <div data-slot="icon-wrapper" className="col-span-3">
                <PictureIcon />

                <div data-slot="description-item">
                  <dt>Picture</dt>

                  <dd>{picture.name}</dd>
                </div>
              </div>

              {date ? (
                <>
                  <div data-slot="icon-wrapper">
                    <CalendarIcon />

                    <div data-slot="description-item">
                      <dt>Date</dt>

                      <dd>{format(date, "dd/MM/yyyy")}</dd>
                    </div>
                  </div>

                  <div data-slot="icon-wrapper" className="col-span-2">
                    <ClockIcon />

                    <div data-slot="description-item">
                      <dt>Time</dt>

                      <dd>{format(date, "HH:mm")}</dd>
                    </div>
                  </div>
                </>
              ) : null}

              <Separator />

              <div data-slot="block">
                {picture.metadata.camera ? (
                  <div data-slot="icon-wrapper">
                    <CameraIcon />

                    <div data-slot="description-item">
                      <dt>Camera</dt>

                      <dd>{picture.metadata.camera}</dd>
                    </div>
                  </div>
                ) : null}

                {picture.metadata.lens ? (
                  <div data-slot="icon-wrapper">
                    <LensIcon />

                    <div data-slot="description-item">
                      <dt>Lens</dt>

                      <dd>{picture.metadata.lens}</dd>
                    </div>
                  </div>
                ) : null}

                {picture.metadata.focalLength ? (
                  <div data-slot="icon-wrapper">
                    <FocalLengthIcon />

                    <div data-slot="description-item">
                      <dt>Focal length</dt>

                      <dd>{picture.metadata.focalLength} mm</dd>
                    </div>
                  </div>
                ) : null}

                {picture.metadata.aperture ? (
                  <div data-slot="icon-wrapper">
                    <ApertureIcon />

                    <div data-slot="description-item">
                      <dt>Aperture</dt>

                      <dd>{picture.metadata.aperture}</dd>
                    </div>
                  </div>
                ) : null}

                {picture.metadata.exposure ? (
                  <div data-slot="icon-wrapper">
                    <ShutterSpeedIcon />

                    <div data-slot="description-item">
                      <dt>Exposure</dt>

                      <dd>{picture.metadata.exposure}</dd>
                    </div>
                  </div>
                ) : null}

                {picture.metadata.iso ? (
                  <div data-slot="icon-wrapper">
                    <ISOIcon />

                    <div data-slot="description-item">
                      <dt>ISO</dt>

                      <dd>{picture.metadata.iso.toLocaleString("fr")}</dd>
                    </div>
                  </div>
                ) : null}
              </div>

              <Separator />

              <div data-slot="icon-wrapper">
                <MegapixelsIcon />

                <div data-slot="description-item">
                  <dt>Megapixels</dt>

                  <dd>
                    {(
                      (picture.metadata.width * picture.metadata.height) /
                      1_000_000
                    ).toFixed(1)}
                  </dd>
                </div>
              </div>

              <div data-slot="icon-wrapper">
                <WidthIcon />

                <div data-slot="description-item">
                  <dt>Width</dt>

                  <dd>{picture.metadata.width.toLocaleString("fr")} px</dd>
                </div>
              </div>

              <div data-slot="icon-wrapper">
                <HeightIcon />

                <div data-slot="description-item">
                  <dt>Height</dt>

                  <dd>{picture.metadata.height.toLocaleString("fr")} px</dd>
                </div>
              </div>
            </div>
          </dl>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default PictureDetailsPanel;
