"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import AlbumLarge from "@/app/_components/business/album/large";
import AlbumSmall from "@/app/_components/business/album/small";
import { AlbumProps } from "@/app/_components/business/album/types";
import {
  removeFavoriteAlbum,
  saveFavoriteAlbum,
} from "@/app/music/album/search/actions";
import { SearchResult } from "@/domain/spotify/services/album/types";
import { Routes } from "@/lib/routes";

interface ResultsProps {
  searchResults: SearchResult[];
  searchTerms: string;
}

const Results = ({ searchResults, searchTerms }: ResultsProps) => {
  const router = useRouter();

  const [actionState, setActionState] = useState<
    NonNullable<AlbumProps["action"]>["state"]
  >({ pending: false });

  const action: (
    albumId: string,
    isFavorite: boolean
  ) => AlbumProps["action"] = (albumId: string, isFavorite: boolean) => ({
    handler: async () => {
      setActionState({ pending: true, albumId });

      try {
        if (!isFavorite) {
          await saveFavoriteAlbum(albumId);
        } else {
          await removeFavoriteAlbum(albumId);
        }
      } catch (error) {
        if (error instanceof Error && error.message === "Unauthorized") {
          toast.error(
            "Vous n'avez pas les permissions nécessaires pour cette action !"
          );
        } else {
          toast.error("Quelque chose s'est mal passé...");
        }

        setActionState({ pending: false });

        return;
      }

      setActionState({ pending: false });

      if (!isFavorite) {
        toast.success("Favori ajouté", {
          description:
            "Cet album fait maintenant parti de votre liste de favoris !",
          action: {
            label: "Voir les favoris",
            onClick: () => router.push(Routes.FAVORITE_PROJECTS),
          },
        });
      } else {
        toast.error("Favori supprimé", {
          description:
            "Cet album ne fait plus parti de votre liste de favoris.",
          action: {
            label: "Voir les favoris",
            onClick: () => router.push(Routes.FAVORITE_PROJECTS),
          },
        });
      }
    },
    state: actionState,
  });

  if (searchResults.length === 0) {
    return (
      <h1 className="text-2xl font-bold sm:text-4xl">
        Aucun résultat pour &quot;{searchTerms}&quot;.
      </h1>
    );
  }

  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold sm:text-4xl">Meilleur résultat</h1>

        <AlbumLarge
          album={searchResults[0].album}
          isFavorite={searchResults[0].isFavorite}
          action={action(
            searchResults[0].album.id,
            searchResults[0].isFavorite
          )}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <h1 className="text-2xl font-bold sm:text-4xl">Autres albums</h1>

        <div className="flex flex-row gap-x-4 overflow-x-scroll">
          {searchResults.slice(1).map(({ album, isFavorite }) => (
            <AlbumSmall
              key={album.id}
              album={album}
              isFavorite={isFavorite}
              action={action(album.id, isFavorite)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
