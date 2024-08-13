"use client";

import Link from "next/link";
import { useState } from "react";

import AlbumLarge from "@/app/_components/business/album/large";
import AlbumSmall from "@/app/_components/business/album/small";
import { AlbumProps } from "@/app/_components/business/album/types";
import { ToastAction } from "@/app/_components/ui/toast";
import { useToast } from "@/app/_components/ui/toast/use-toast";
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
  const { toast } = useToast();
  const [actionState, setActionState] = useState<
    NonNullable<AlbumProps["action"]>["state"]
  >({ pending: false });

  const action: (
    albumId: string,
    isFavorite: boolean
  ) => AlbumProps["action"] = (albumId: string, isFavorite: boolean) => ({
    handler: async () => {
      setActionState({ pending: true, albumId });

      if (!isFavorite) {
        await saveFavoriteAlbum(albumId);
      } else {
        await removeFavoriteAlbum(albumId);
      }

      setActionState({ pending: false });

      toast({
        title: !isFavorite ? "Favori ajouté" : "Favori supprimé",
        description: !isFavorite
          ? "Cet album fait maintenant parti de votre liste de favoris !"
          : "Cet album ne fait plus parti de votre liste de favoris.",
        variant: !isFavorite ? "success" : "destructive",
        action: (
          <Link href={Routes.FAVORITE_PROJECTS} className="flex">
            <ToastAction altText="Voir les favoris">
              Voir les favoris
            </ToastAction>
          </Link>
        ),
      });
    },
    state: actionState,
  });

  if (searchResults.length === 0) {
    return (
      <h1 className="text-4xl font-bold">
        Aucun résultat pour &quot;{searchTerms}&quot;.
      </h1>
    );
  }

  return (
    <div className="flex flex-col gap-y-16">
      <div className="flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold">Meilleur résultat</h1>

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
        <h1 className="text-4xl font-bold">Autres albums</h1>

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
