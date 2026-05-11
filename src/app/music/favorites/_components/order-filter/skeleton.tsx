import { Switch as SwitchPrimitives } from "@base-ui/react/switch";
import { CalendarArrowUp } from "lucide-react";

import Label from "@/app/_components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
} from "@/app/_components/ui/select";

const OrderFilterSkeleton = () => {
  return (
    <div className="flex flex-row items-center gap-x-4">
      <Select disabled>
        <SelectTrigger className="w-[160px] bg-background/25 opacity-50">
          <SelectValue placeholder="Trier par" />
        </SelectTrigger>
      </Select>

      <Label className="sr-only" htmlFor="direction-skeleton">
        Sens du tri
      </Label>

      <SwitchPrimitives.Root
        id="direction-skeleton"
        disabled
        nativeButton
        render={<button type="button" />}
        className="opacity-50"
      >
        <SwitchPrimitives.Thumb
          render={
            <span>
              <CalendarArrowUp />
            </span>
          }
        />
      </SwitchPrimitives.Root>
    </div>
  );
};

export default OrderFilterSkeleton;
