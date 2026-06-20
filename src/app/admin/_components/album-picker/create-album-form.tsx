"use client";

import {
  EyeIcon,
  EyeOffIcon,
  HatGlassesIcon,
  Loader2Icon,
  PlusIcon,
} from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Textarea } from "@/app/_components/ui/textarea";
import { createAlbumAction } from "@/app/admin/_components/album-photos/actions";
import { Album } from "@/domain/photography/services/albums/types";
import { cn } from "@/lib/tailwind";

import type { AlbumPrivacy } from "@prisma/client";

const PRIVACY_OPTIONS: {
  value: AlbumPrivacy;
  label: string;
  Icon: typeof EyeIcon;
}[] = [
  { value: "PUBLIC", label: "Public", Icon: EyeIcon },
  { value: "UNLISTED", label: "Unlisted", Icon: EyeOffIcon },
  { value: "PRIVATE", label: "Private", Icon: HatGlassesIcon },
];

interface CreateAlbumFormProps {
  defaultName?: string;
  onCreated: (album: Album) => void | Promise<void>;
  onCancel?: () => void;
  className?: string;
}

const CreateAlbumForm = ({
  defaultName = "",
  onCreated,
  onCancel,
  className,
}: CreateAlbumFormProps) => {
  const [name, setName] = useState(defaultName);
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<AlbumPrivacy>("PRIVATE");

  const [isPending, startTransition] = useTransition();

  const handleCreate = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    startTransition(async () => {
      try {
        const album = await createAlbumAction({
          name: trimmedName,
          description: description.trim() || undefined,
          privacy,
        });

        await onCreated(album);
      } catch {
        toast.error("Failed to create the album");
      }
    });
  };

  return (
    <div className={cn("flex flex-col gap-y-3", className)}>
      <div className="flex flex-col gap-y-1.5">
        <label
          htmlFor="album-name"
          className="text-xs font-medium text-muted-foreground"
        >
          Name
        </label>

        <Input
          id="album-name"
          value={name}
          // The name field should take focus as soon as the form appears.
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(event) => setName(event.target.value)}
          placeholder="Album name"
        />
      </div>

      <div className="flex flex-col gap-y-1.5">
        <label
          htmlFor="album-description"
          className="text-xs font-medium text-muted-foreground"
        >
          Description{" "}
          <span className="font-normal text-muted-foreground/70">
            (optional)
          </span>
        </label>

        <Textarea
          id="album-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="What's in this album?"
          rows={2}
          className="resize-none"
        />
      </div>

      <div className="flex flex-col gap-y-1.5">
        <span className="text-xs font-medium text-muted-foreground">
          Privacy
        </span>

        <RadioGroup
          value={privacy}
          onValueChange={(value) => setPrivacy(value as AlbumPrivacy)}
          className="grid-cols-3"
        >
          {PRIVACY_OPTIONS.map(({ value, label, Icon }) => (
            <RadioGroupItem key={value} value={value}>
              <Icon />

              {label}
            </RadioGroupItem>
          ))}
        </RadioGroup>
      </div>

      <div className="flex justify-end gap-2 pt-1">
        {onCancel ? (
          <Button
            type="button"
            variant="ghost"
            disabled={isPending}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}

        <Button
          type="button"
          disabled={isPending || !name.trim()}
          onClick={handleCreate}
        >
          {isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
          Create
        </Button>
      </div>
    </div>
  );
};

export default CreateAlbumForm;
