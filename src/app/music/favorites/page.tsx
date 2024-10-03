import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import AlbumFancy from "@/app/_components/business/album/fancy";
import { getFavoriteProjects } from "@/domain/music/services/favorite-projects";
import {
  FavoriteProjectsOrderBy,
  FavoriteProjectsOrderDirection,
} from "@/domain/music/services/favorite-projects/types";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";

import OrderFilter from "./_components/order-filter";
import RandomProjectSelector from "./_components/random-project-selector";

const ProjectsSkeleton = () => {
  return (
    <>
      {Array(12).map((_, i) => (
        <div
          className="flex size-64 animate-pulse flex-col justify-end bg-stone-800"
          // eslint-disable-next-line react/no-array-index-key
          key={i}
        >
          <div className="h-1/3 animate-pulse bg-stone-700" />
        </div>
      ))}
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
  const projects = await getFavoriteProjects(
    searchParams?.["order-by"] ?? "date",
    searchParams?.direction
  );

  return (
    <>
      <div
        className={cn(
          "fixed z-50 flex h-fit w-full flex-row items-center justify-between bg-stone-950/65 backdrop-blur-xl",
          "p-8",
          "sm:px-[calc((100%-(theme(spacing.64)*2+theme(spacing.8)))/2)] sm:py-4",
          "lg:px-[calc((100%-(theme(spacing.64)*3+theme(spacing.8)*2))/2)]",
          "xl:px-[calc((100%-(theme(spacing.64)*4+theme(spacing.8)*3))/2)]"
        )}
      >
        <Link href={Routes.MUSIC}>
          <ArrowLeft className="size-7" />
        </Link>

        <div className="flex flex-row items-center gap-x-4">
          <OrderFilter />
          <RandomProjectSelector projects={projects} />
        </div>
      </div>

      <div className="mt-32 grid size-fit grid-cols-1 justify-center gap-8 sm:mt-24 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Suspense fallback={<ProjectsSkeleton />}>
          {projects.map((project) => (
            <AlbumFancy project={project} key={project.id} />
          ))}
        </Suspense>
      </div>
    </>
  );
};

export default FavoritePage;
