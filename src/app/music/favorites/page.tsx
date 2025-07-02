import { ArrowLeft, ShuffleIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { getFavoriteProjects } from "@/domain/music/services/favorite-projects";
import {
  FavoriteProjectsOrderBy,
  FavoriteProjectsOrderDirection,
} from "@/domain/music/services/favorite-projects/types";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";
import OrderFilter from "@/app/music/favorites/_components/order-filter";
import RandomProjectSelector from "@/app/music/favorites/_components/random-project-selector";
import AlbumGrid from "@/app/music/favorites/_components/album-grid";
import ServerSideAwait from "@/app/_components/await/server";
import { sortAndGroupProjects } from "@/app/music/favorites/sort";

const ProjectsSkeleton = () => {
  return (
    <>
      <div className="flex flex-col gap-8">
        <div className="h-8 w-48 animate-pulse rounded bg-stone-100/50" />

        <div className="grid size-fit grid-cols-1 justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>

          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>

          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-8">
        <div className="h-8 w-48 animate-pulse rounded bg-stone-100/50" />

        <div className="grid size-fit grid-cols-1 justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>

          <div className="flex size-64 animate-pulse flex-col justify-end bg-stone-800">
            <div className="h-1/3 animate-pulse bg-stone-700" />
          </div>
        </div>
      </div>
    </>
  );
};

interface FavoritePageProps {
  searchParams?: {
    "order-by"?: FavoriteProjectsOrderBy;
    direction?: FavoriteProjectsOrderDirection;
  };
}

const FavoritePage = async ({ searchParams }: FavoritePageProps) => {
  const orderBy = searchParams?.["order-by"] ?? "date";
  const direction =
    orderBy === "date"
      ? (searchParams?.direction ?? "desc")
      : searchParams?.direction;

  const groupedProjectsPromise = getFavoriteProjects().then((projects) =>
    sortAndGroupProjects(projects, orderBy, direction),
  );

  return (
    <>
      <div
        className={cn(
          "fixed z-50 flex h-fit w-full flex-row items-center justify-between bg-stone-950/65 backdrop-blur-xl",
          "p-8",
          "sm:px-[calc((100%-(--spacing(64)*2+(--spacing(8))))/2)] sm:py-4",
          "lg:px-[calc((100%-(--spacing(64)*3+(--spacing(8))*2))/2)]",
          "xl:px-[calc((100%-(--spacing(64)*4+(--spacing(8))*3))/2)]",
        )}
      >
        <Link href={Routes.MUSIC}>
          <ArrowLeft className="size-7" />
        </Link>

        <div className="flex flex-row items-center gap-x-4">
          <OrderFilter />

          <Suspense fallback={<ShuffleIcon className="opacity-50" />}>
            <ServerSideAwait promise={groupedProjectsPromise}>
              {(groupedProjects) => (
                <RandomProjectSelector
                  projects={groupedProjects.flatMap(
                    (group) => group.sortedProjects,
                  )}
                />
              )}
            </ServerSideAwait>
          </Suspense>
        </div>
      </div>

      <div className="mt-32 sm:mt-24">
        <div className="flex flex-col gap-12">
          <Suspense fallback={<ProjectsSkeleton />}>
            <ServerSideAwait promise={groupedProjectsPromise}>
              {(groupedProjects) =>
                groupedProjects.length === 1 ? (
                  <AlbumGrid projects={groupedProjects[0].sortedProjects} />
                ) : (
                  <>
                    {groupedProjects.map((group) => (
                      <div
                        key={group.groupTitle}
                        className="flex flex-col gap-8"
                      >
                        <h2 className="text-2xl font-bold text-stone-100">
                          {group.groupTitle}
                        </h2>

                        <AlbumGrid projects={group.sortedProjects} />
                      </div>
                    ))}
                  </>
                )
              }
            </ServerSideAwait>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default FavoritePage;
