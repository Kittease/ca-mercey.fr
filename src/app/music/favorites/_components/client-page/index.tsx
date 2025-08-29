"use client";

import { useQueryState } from "nuqs";
import { useMemo } from "react";

import AlbumGrid from "@/app/music/favorites/_components/album-grid";
import { sortAndGroupProjects } from "@/app/music/favorites/sort";
import {
  FavoriteProject,
  favoriteProjectsOrderBy,
  FavoriteProjectsOrderBy,
  favoriteProjectsOrderDirection,
  FavoriteProjectsOrderDirection,
} from "@/domain/music/services/favorite-projects/types";

interface ClientPageProps {
  favoriteProjects: FavoriteProject[];
}

const ClientPage = ({ favoriteProjects }: ClientPageProps) => {
  let orderBy =
    useQueryState("order-by", {
      parse: (value) =>
        favoriteProjectsOrderBy.includes(value as FavoriteProjectsOrderBy)
          ? (value as FavoriteProjectsOrderBy)
          : null,
    })[0] ?? undefined;

  let direction =
    useQueryState("direction", {
      parse: (value) =>
        favoriteProjectsOrderDirection.includes(
          value as FavoriteProjectsOrderDirection
        )
          ? (value as FavoriteProjectsOrderDirection)
          : null,
    })[0] ?? undefined;

  if (!orderBy) {
    orderBy = "date";
    if (!direction) {
      direction = "desc";
    }
  }

  const groupedProjects = useMemo(() => {
    return sortAndGroupProjects(favoriteProjects, orderBy, direction);
  }, [favoriteProjects, orderBy, direction]);

  if (groupedProjects.length === 1) {
    return <AlbumGrid projects={groupedProjects[0].sortedProjects} />;
  }

  return (
    <>
      {groupedProjects.map((group) => (
        <div key={group.groupTitle} className="flex flex-col gap-8">
          <h2 className="text-2xl font-bold text-stone-100">
            {group.groupTitle}
          </h2>

          <AlbumGrid projects={group.sortedProjects} />
        </div>
      ))}
    </>
  );
};

export default ClientPage;
