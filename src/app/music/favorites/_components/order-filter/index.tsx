"use client";

import * as SwitchPrimitives from "@radix-ui/react-switch";
import {
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  ArrowDownZA,
  CalendarArrowDown,
  CalendarArrowUp,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, forwardRef } from "react";

import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  FavoriteProjectsOrderBy,
  FavoriteProjectsOrderDirection,
} from "@/domain/music/services/favorite-projects/types";
import { Routes } from "@/lib/routes";

interface OrderDirectionIconProps {
  orderBy?: FavoriteProjectsOrderBy;
  direction?: FavoriteProjectsOrderDirection;
}

const OrderDirectionIcon = forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Thumb>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Thumb> &
    OrderDirectionIconProps
>(({ orderBy, direction, ...rest }, forwardedRef) => {
  return (
    <span {...rest} ref={forwardedRef}>
      {(() => {
        switch (orderBy) {
          case undefined:
          case "date":
            return direction === "asc" ? (
              <CalendarArrowDown />
            ) : (
              <CalendarArrowUp />
            );

          case "duration":
            return direction === "desc" ? (
              <ArrowDownWideNarrow />
            ) : (
              <ArrowDownNarrowWide />
            );

          case "name":
          case "artist":
            return direction === "desc" ? <ArrowDownZA /> : <ArrowDownAZ />;

          default:
            throw new Error(`Unreachable orderBy: ${orderBy satisfies never}`);
        }
      })()}
    </span>
  );
});

const OrderFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  let defaultOrderBy: FavoriteProjectsOrderBy | undefined;
  const searchParamsOrderBy = searchParams.get("order-by");
  if (
    searchParamsOrderBy === "date" ||
    searchParamsOrderBy === "name" ||
    searchParamsOrderBy === "artist" ||
    searchParamsOrderBy === "duration"
  ) {
    defaultOrderBy = searchParamsOrderBy;
  }
  const [orderBy, setOrderBy] = useState(defaultOrderBy);

  const handleOrderByChange = (value: NonNullable<typeof orderBy>) => {
    setOrderBy(value);

    const params = new URLSearchParams(searchParams.toString());
    params.set("order-by", value);
    router.replace(`${Routes.FAVORITE_PROJECTS}?${params.toString()}`);
  };

  let defaultDirection: FavoriteProjectsOrderDirection | undefined;
  const searchParamsDirection = searchParams.get("direction");
  if (searchParamsDirection === "asc" || searchParamsDirection === "desc") {
    defaultDirection = searchParamsDirection;
  }
  const [direction, setDirection] = useState(defaultDirection);

  const handleDirectionChange = (checked: boolean) => {
    let newDirection: "asc" | "desc" = checked ? "asc" : "desc";

    if (direction === undefined && orderBy !== undefined) {
      if (orderBy === "date") {
        newDirection = "asc";
      } else {
        newDirection = "desc";
      }
    }

    setDirection(newDirection);

    const params = new URLSearchParams(searchParams.toString());
    params.set("direction", newDirection);
    router.replace(`${Routes.FAVORITE_PROJECTS}?${params.toString()}`);
  };

  return (
    <div className="flex flex-row items-center gap-x-4">
      <Select
        name="orderBy"
        value={orderBy}
        onValueChange={handleOrderByChange}
      >
        <SelectTrigger className="w-[160px] bg-stone-950/25">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
        <SelectContent align="end">
          <SelectItem value="date">Date de sortie</SelectItem>
          <SelectItem value="name">Nom du projet</SelectItem>
          <SelectItem value="artist">Nom de l&apos;artiste</SelectItem>
          <SelectItem value="duration">Durée du projet</SelectItem>
        </SelectContent>
      </Select>

      <Label display="hidden" htmlFor="direction">
        Sens du tri
      </Label>
      <SwitchPrimitives.Root
        id="direction"
        name="direction"
        checked={direction === "asc"}
        onCheckedChange={handleDirectionChange}
      >
        <SwitchPrimitives.Thumb asChild>
          <OrderDirectionIcon orderBy={orderBy} direction={direction} />
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    </div>
  );
};

export default OrderFilter;
