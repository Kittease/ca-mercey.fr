"use client";

import { Switch as SwitchPrimitives } from "@base-ui/react/switch";
import {
  ArrowDownAZ,
  ArrowDownNarrowWide,
  ArrowDownWideNarrow,
  ArrowDownZA,
  CalendarArrowDown,
  CalendarArrowUp,
} from "lucide-react";
import { useQueryState } from "nuqs";
import { forwardRef, type ComponentPropsWithoutRef } from "react";

import Label from "@/app/_components/ui/label";
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
import exhaustiveSwitchCheck from "@/lib/exhaustive-check";

interface OrderDirectionIconProps {
  orderBy?: FavoriteProjectsOrderBy;
  direction?: FavoriteProjectsOrderDirection;
}

const OrderDirectionIcon = forwardRef<
  HTMLSpanElement,
  ComponentPropsWithoutRef<"span"> & OrderDirectionIconProps
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
            return exhaustiveSwitchCheck(orderBy);
        }
      })()}
    </span>
  );
});
OrderDirectionIcon.displayName = "OrderDirectionIcon";

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

  const handleOrderByChange = (value: string | null) => {
    if (favoriteProjectsOrderBy.includes(value as FavoriteProjectsOrderBy)) {
      void setOrderBy(value as FavoriteProjectsOrderBy);
    }
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

    void setDirection(newDirection);
  };

  const items = [
    { value: "date", label: "Date de sortie" },
    { value: "name", label: "Nom du projet" },
    { value: "artist", label: "Nom de l'artiste" },
    { value: "duration", label: "Durée du projet" },
  ];

  return (
    <div className="flex flex-row items-center gap-x-4">
      <Select
        name="orderBy"
        items={items}
        value={orderBy ?? ""}
        onValueChange={handleOrderByChange}
      >
        <SelectTrigger className="w-[160px] bg-background/25">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>

        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Label className="sr-only" htmlFor="direction">
        Sens du tri
      </Label>

      <SwitchPrimitives.Root
        id="direction"
        name="direction"
        nativeButton
        render={<button type="button" />}
        checked={direction === "asc"}
        onCheckedChange={handleDirectionChange}
      >
        <SwitchPrimitives.Thumb
          render={
            <OrderDirectionIcon
              orderBy={orderBy ?? undefined}
              direction={direction ?? undefined}
            />
          }
        />
      </SwitchPrimitives.Root>
    </div>
  );
};

export default OrderFilter;
