"use client";

import Link from "next/link";
import { useState } from "react";

import AlbumLarge from "@/app/_components/business/album/large";
import AlbumSmall from "@/app/_components/business/album/small";
import { AlbumProps } from "@/app/_components/business/album/types";
import { ToastAction } from "@/app/_components/ui/toast";
import { useToast } from "@/app/_components/ui/toast/use-toast";
import { saveFavoriteAlbum } from "@/app/music/album/search/actions";
import { SimplifiedAlbum } from "@/domain/spotify/services/album/types";

interface ResultsProps {
  albums: SimplifiedAlbum[];
  searchTerms: string;
}

const Results = ({ albums, searchTerms }: ResultsProps) => {
  const { toast } = useToast();
  const [isPending, setIsPending] = useState(false);

  const action: (albumId: string) => AlbumProps["action"] = (
    albumId: string
  ) => ({
    handler: async () => {
      setIsPending(true);
      await saveFavoriteAlbum(albumId);
      setIsPending(false);
      toast({
        title: "Favori ajouté",
        description:
          "Cet album fait maintenant parti de votre liste de favoris !",
        variant: "success",
        action: (
          <Link href="/music" className="flex">
            <ToastAction altText="Voir les favoris">
              Voir les favoris
            </ToastAction>
          </Link>
        ),
      });
    },
    isPending,
  });

  if (albums.length === 0) {
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

        <AlbumLarge album={albums[0]} action={action(albums[0].id)} />
      </div>

      <div className="flex flex-col gap-y-4">
        <h1 className="text-4xl font-bold">Autres albums</h1>

        <div className="flex flex-row gap-x-4 overflow-x-scroll">
          {albums.slice(1).map((album) => (
            <AlbumSmall
              key={album.id}
              album={album}
              action={action(album.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
