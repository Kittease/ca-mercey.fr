"use client";

import {
  BookImageIcon,
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  HatGlassesIcon,
  Loader2Icon,
  MinusIcon,
  PlusIcon,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/app/_components/ui/button";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "@/app/_components/ui/combobox";
import { Input } from "@/app/_components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/app/_components/ui/radio-group";
import { Textarea } from "@/app/_components/ui/textarea";
import {
  addToAlbum,
  createAlbumAction,
  removeFromAlbum,
} from "@/app/admin/_components/album-photos/actions";
import { useAlbums } from "@/app/admin/_components/albums/context";
import { usePhotoSelection } from "@/app/admin/_components/photo-wrapper/select/context";
import { useUpload } from "@/app/admin/_components/upload/context";
import { Album } from "@/domain/photography/services/albums/types";
import { cn } from "@/lib/tailwind";

import type { AlbumPrivacy } from "@prisma/client";

type Membership = "all" | "some" | "none";

const PRIVACY_OPTIONS: {
  value: AlbumPrivacy;
  label: string;
  Icon: typeof EyeIcon;
}[] = [
  { value: "PUBLIC", label: "Public", Icon: EyeIcon },
  { value: "UNLISTED", label: "Unlisted", Icon: EyeOffIcon },
  { value: "PRIVATE", label: "Private", Icon: HatGlassesIcon },
];

const pluralize = (count: number, word: string) =>
  count === 1 ? word : `${word}s`;

const AlbumCover = ({ album }: { album: Album }) => {
  if (album.coverThumbnailSrc) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={album.coverThumbnailSrc}
        alt=""
        width={40}
        height={40}
        className="size-10 shrink-0 rounded object-cover"
      />
    );
  }

  return (
    <span className="flex size-10 shrink-0 items-center justify-center rounded bg-muted text-muted-foreground">
      <BookImageIcon className="size-4" />
    </span>
  );
};

const MembershipIndicator = ({
  state,
  pending,
}: {
  state: Membership;
  pending: boolean;
}) => {
  return (
    <span
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md border transition-colors",
        state === "all"
          ? "border-primary bg-primary text-primary-foreground"
          : "border-foreground/30",
      )}
    >
      {pending ? (
        <Loader2Icon className="size-3.5 animate-spin" />
      ) : state === "all" ? (
        <CheckIcon className="size-3.5" />
      ) : state === "some" ? (
        <MinusIcon className="size-3.5 text-foreground/60" />
      ) : null}
    </span>
  );
};

const AlbumPhotos = () => {
  const { selectedPhotos, selectedPhotoCount } = usePhotoSelection();
  const { photos, setPhotosAlbumMembership } = useUpload();
  const { albums, addAlbum } = useAlbums();

  const [query, setQuery] = useState("");
  const [pending, setPending] = useState<ReadonlySet<string>>(new Set());
  const pendingRef = useRef<Set<string>>(new Set());
  const selectionRef = useRef<Album[]>([]);

  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [privacy, setPrivacy] = useState<AlbumPrivacy>("PRIVATE");
  const [createPending, setCreatePending] = useState(false);

  const selectedFull = useMemo(() => {
    const selectedIds = new Set(selectedPhotos.map(({ id }) => id));

    return photos.filter((photo) => selectedIds.has(photo.id));
  }, [photos, selectedPhotos]);

  const membership = useMemo(() => {
    const map = new Map<string, Membership>();
    const total = selectedFull.length;

    for (const album of albums) {
      const count = selectedFull.filter((photo) =>
        photo.albumIds.includes(album.id),
      ).length;

      map.set(
        album.id,
        count === 0 ? "none" : count === total ? "all" : "some",
      );
    }

    return map;
  }, [albums, selectedFull]);

  const setPendingFor = (albumId: string, value: boolean) => {
    const next = new Set(pendingRef.current);

    if (value) {
      next.add(albumId);
    } else {
      next.delete(albumId);
    }

    pendingRef.current = next;
    setPending(next);
  };

  const toggleAlbum = (album: Album) => {
    if (pendingRef.current.has(album.id)) {
      return;
    }

    const state = membership.get(album.id) ?? "none";
    const add = state !== "all";

    const targetIds = add
      ? selectedFull
          .filter((photo) => !photo.albumIds.includes(album.id))
          .map((photo) => photo.id)
      : selectedFull.map((photo) => photo.id);

    if (targetIds.length === 0) {
      return;
    }

    const noun = pluralize(targetIds.length, "photo");

    setPendingFor(album.id, true);

    void (async () => {
      try {
        if (add) {
          await addToAlbum(album.id, targetIds);
        } else {
          await removeFromAlbum(album.id, targetIds);
        }

        setPhotosAlbumMembership(targetIds, album.id, add);

        toast.success(
          add
            ? `${targetIds.length} ${noun} added to “${album.name}”`
            : `${targetIds.length} ${noun} removed from “${album.name}”`,
        );
      } catch {
        toast.error(
          add
            ? `Failed to add photos to “${album.name}”`
            : `Failed to remove photos from “${album.name}”`,
        );
      } finally {
        setPendingFor(album.id, false);
      }
    })();
  };

  const handleSelectionChange = (next: Album[]) => {
    const previous = selectionRef.current;
    selectionRef.current = next;

    const previousIds = new Set(previous.map((album) => album.id));
    const nextIds = new Set(next.map((album) => album.id));

    const toggled =
      next.find((album) => !previousIds.has(album.id)) ??
      previous.find((album) => !nextIds.has(album.id));

    if (toggled) {
      toggleAlbum(toggled);
    }
  };

  const openCreate = () => {
    setName(query.trim());
    setDescription("");
    setPrivacy("PRIVATE");
    setCreating(true);
  };

  const handleCreate = () => {
    const trimmedName = name.trim();

    if (!trimmedName) {
      return;
    }

    const targetIds = selectedFull.map((photo) => photo.id);
    const noun = pluralize(targetIds.length, "photo");

    setCreatePending(true);

    void (async () => {
      try {
        const album = await createAlbumAction({
          name: trimmedName,
          description: description.trim() || undefined,
          privacy,
        });

        addAlbum(album);

        if (targetIds.length > 0) {
          await addToAlbum(album.id, targetIds);
          setPhotosAlbumMembership(targetIds, album.id, true);
        }

        toast.success(
          `Created “${album.name}” and added ${targetIds.length} ${noun}`,
        );

        setCreating(false);
      } catch {
        toast.error("Failed to create the album");
      } finally {
        setCreatePending(false);
      }
    })();
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setCreating(false);
    }
  };

  const noun = pluralize(selectedPhotoCount, "photo");

  return (
    <Combobox
      items={albums}
      multiple
      itemToStringLabel={(album: Album) => album.name}
      itemToStringValue={(album: Album) => album.id}
      isItemEqualToValue={(a: Album, b: Album) => a.id === b.id}
      onValueChange={handleSelectionChange}
      onInputValueChange={(value: string) => setQuery(value)}
      onOpenChange={handleOpenChange}
    >
      <ComboboxTrigger
        render={
          <Button
            type="button"
            variant="secondary"
            aria-label={`Add ${selectedPhotoCount} selected ${noun} to an album`}
          />
        }
      >
        <BookImageIcon />
        Add to album
      </ComboboxTrigger>

      <ComboboxContent>
        {creating ? (
          <div className="flex flex-col gap-y-3 p-3">
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
                // Returning focus to the name field is expected when the create
                // form replaces the search input.
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
              <Button
                type="button"
                variant="ghost"
                disabled={createPending}
                onClick={() => setCreating(false)}
              >
                Cancel
              </Button>

              <Button
                type="button"
                disabled={createPending || !name.trim()}
                onClick={handleCreate}
              >
                {createPending ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <PlusIcon />
                )}
                Create
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* The search field is meant to take focus as soon as the popup opens. */}
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <ComboboxInput autoFocus placeholder="Search albums…" />

            <ComboboxList>
              {(album: Album) => {
                const state = membership.get(album.id) ?? "none";

                return (
                  <ComboboxItem key={album.id} value={album}>
                    <AlbumCover album={album} />

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{album.name}</p>

                      {album.description ? (
                        <p className="truncate text-xs text-muted-foreground">
                          {album.description}
                        </p>
                      ) : null}
                    </div>

                    <MembershipIndicator
                      state={state}
                      pending={pending.has(album.id)}
                    />
                  </ComboboxItem>
                );
              }}
            </ComboboxList>

            <ComboboxEmpty>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start"
                onClick={openCreate}
              >
                <PlusIcon />

                {query.trim() ? `Create “${query.trim()}”` : "Create new album"}
              </Button>
            </ComboboxEmpty>

            <div className="group-data-empty/combobox-content:hidden">
              <ComboboxSeparator className="my-0" />

              <div className="p-1">
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={openCreate}
                >
                  <PlusIcon />
                  Create new album
                </Button>
              </div>
            </div>
          </>
        )}
      </ComboboxContent>
    </Combobox>
  );
};

export default AlbumPhotos;
