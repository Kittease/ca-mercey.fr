"use client";

import { Plus, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/_components/ui/drawer";
import { Input } from "@/app/_components/ui/input";

import { addWeight } from "./actions";

interface WeightInputProps {
  className?: string;
}

const WeightInput = ({ className }: WeightInputProps) => {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!weight) {
      return;
    }

    addWeight(weight)
      .then(() => {
        toast.success("Success", {
          description: "New weight value added",
        });

        setWeight(null);
        setOpen(false);
      })
      .catch(() => {
        toast.error("Error", {
          description: "An error occurred while adding the weight value",
        });
      });
  };

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger onClick={() => setOpen(true)} className={className}>
        <Plus className="size-8 md:size-12" />
      </DrawerTrigger>

      <DrawerContent className="dark flex flex-col gap-y-8 px-12 pb-12 pt-4">
        <DrawerTitle>Add a new weight value</DrawerTitle>

        <div className="flex flex-row gap-x-2">
          <Input
            onChange={(e) => setWeight(Number(e.target.value))}
            type="number"
            placeholder="100"
            className="h-10"
          />

          <Button
            onClick={handleSubmit}
            type="submit"
            variant="outline"
            size="icon"
            className="size-10 shrink-0"
          >
            <Send className="size-6" />
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default WeightInput;
