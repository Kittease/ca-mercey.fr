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
import { useQueryState } from "nuqs";
import { forwardRef } from "react";

import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";
import {
  favoriteProjectsOrderBy,
  FavoriteProjectsOrderBy,
  favoriteProjectsOrderDirection,
  FavoriteProjectsOrderDirection,
} from "@/domain/music/services/favorite-projects/types";

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
  const [orderBy, setOrderBy] = useQueryState<FavoriteProjectsOrderBy>(
    "order-by",
    {
      shallow: true,
      parse: (value) =>
        favoriteProjectsOrderBy.includes(value as FavoriteProjectsOrderBy)
          ? (value as FavoriteProjectsOrderBy)
          : null,
    },
  );

  const [direction, setDirection] =
    useQueryState<FavoriteProjectsOrderDirection>("direction", {
      shallow: true,
      parse: (value) =>
        favoriteProjectsOrderDirection.includes(
          value as FavoriteProjectsOrderDirection,
        )
          ? (value as FavoriteProjectsOrderDirection)
          : null,
    });

  const handleOrderByChange = (value: NonNullable<typeof orderBy>) => {
    setOrderBy(value);
  };

  const handleDirectionChange = (checked: boolean) => {
    let newDirection: "asc" | "desc" = checked ? "asc" : "desc";

    if (direction === null && orderBy !== null) {
      if (orderBy === "date") {
        newDirection = "asc";
      } else {
        newDirection = "desc";
      }
    }

    setDirection(newDirection);
  };

  return (
    <div className="flex flex-row items-center gap-x-4">
      <Select
        name="orderBy"
        value={orderBy ?? ""}
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
          <OrderDirectionIcon
            orderBy={orderBy ?? undefined}
            direction={direction ?? undefined}
          />
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    </div>
  );
};

export default OrderFilter;
