import * as SwitchPrimitives from "@radix-ui/react-switch";
import { CalendarArrowUp } from "lucide-react";

import { Label } from "@/app/_components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

const OrderFilterSkeleton = () => {
  return (
    <div className="flex flex-row items-center gap-x-4">
      <Select disabled>
        <SelectTrigger className="w-[160px] bg-stone-950/25 opacity-50">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
      </Select>

      <Label display="hidden" htmlFor="direction-skeleton">
        Sens du tri
      </Label>

      <SwitchPrimitives.Root
        id="direction-skeleton"
        disabled
        className="opacity-50"
      >
        <SwitchPrimitives.Thumb asChild>
          <span>
            <CalendarArrowUp />
          </span>
        </SwitchPrimitives.Thumb>
      </SwitchPrimitives.Root>
    </div>
  );
};

export default OrderFilterSkeleton;
