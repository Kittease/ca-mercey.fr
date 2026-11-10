"use client";

import { Switch as SwitchPrimitives } from "@base-ui/react/switch";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";
import { useQueryState } from "nuqs";

import { galleryDirectionParser } from "@/app/(photography)/gallery/search-params";
import Label from "@/app/_components/ui/label";

const DirectionToggle = () => {
  const [direction, setDirection] = useQueryState(
    "direction",
    galleryDirectionParser,
  );

  return (
    <>
      <Label className="sr-only" htmlFor="direction">
        Trier par date {direction === "asc" ? "croissante" : "décroissante"}
      </Label>

      <SwitchPrimitives.Root
        id="direction"
        name="direction"
        nativeButton
        render={<button type="button" className="cursor-pointer" />}
        checked={direction === "asc"}
        onCheckedChange={(checked) => {
          void setDirection(checked ? "asc" : "desc");
        }}
      >
        <SwitchPrimitives.Thumb
          render={
            <span>
              {direction === "asc" ? (
                <CalendarArrowDown />
              ) : (
                <CalendarArrowUp />
              )}
            </span>
          }
        />
      </SwitchPrimitives.Root>
    </>
  );
};

export default DirectionToggle;
