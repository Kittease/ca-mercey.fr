"use client";

import {
  BookImageIcon,
  CheckIcon,
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
import {
  addToAlbum,
  removeFromAlbum,
} from "@/app/admin/_components/album-photos/actions";
import AlbumRow from "@/app/admin/_components/album-picker/album-row";
import CreateAlbumForm from "@/app/admin/_components/album-picker/create-album-form";
import { useAlbums } from "@/app/admin/_components/albums/context";
import { usePhotoSelection } from "@/app/admin/_components/photo-wrapper/select/context";
import { useUpload } from "@/app/admin/_components/upload/context";
import { Album } from "@/domain/photography/services/albums/types";
import { cn } from "@/lib/tailwind";

type Membership = "all" | "some" | "none";

const pluralize = (count: number, word: string) =>
  count === 1 ? word : `${word}s`;

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

  const handleAlbumCreated = async (album: Album) => {
    addAlbum(album);

    const targetIds = selectedFull.map((photo) => photo.id);
    const noun = pluralize(targetIds.length, "photo");

    if (targetIds.length > 0) {
      await addToAlbum(album.id, targetIds);
      setPhotosAlbumMembership(targetIds, album.id, true);
    }

    toast.success(
      `Created “${album.name}” and added ${targetIds.length} ${noun}`,
    );

    setCreating(false);
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
          <CreateAlbumForm
            defaultName={query.trim()}
            onCreated={handleAlbumCreated}
            onCancel={() => setCreating(false)}
            className="p-3"
          />
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
                    <AlbumRow album={album} />

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
                onClick={() => setCreating(true)}
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
                  onClick={() => setCreating(true)}
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
