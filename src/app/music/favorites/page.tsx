import { ArrowLeft, ShuffleIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { getFavoriteProjects } from "@/domain/music/services/favorite-projects";
import { Routes } from "@/lib/routes";
import { cn } from "@/lib/tailwind";
import OrderFilter from "@/app/music/favorites/_components/order-filter";
import RandomProjectSelector from "@/app/music/favorites/_components/random-project-selector";
import ServerSideAwait from "@/app/_components/await/server";
import ClientPage from "@/app/music/favorites/_components/client-page";
import OrderFilterSkeleton from "@/app/music/favorites/_components/order-filter/skeleton";
import ProjectsSkeleton from "@/app/music/favorites/_components/client-page/skeleton";

const FavoritePage = async () => {
  const favoriteProjectsPromise = getFavoriteProjects();

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
          <Suspense fallback={<OrderFilterSkeleton />}>
            <OrderFilter />
          </Suspense>

          <Suspense fallback={<ShuffleIcon className="opacity-50" />}>
            <ServerSideAwait promise={favoriteProjectsPromise}>
              {(favoriteProjects) => (
                <RandomProjectSelector projects={favoriteProjects} />
              )}
            </ServerSideAwait>
          </Suspense>
        </div>
      </div>

      <div className="mt-32 sm:mt-24">
        <div className="flex flex-col gap-12">
          <Suspense fallback={<ProjectsSkeleton />}>
            <ServerSideAwait promise={favoriteProjectsPromise}>
              {(favoriteProjects) => (
                <ClientPage favoriteProjects={favoriteProjects} />
              )}
            </ServerSideAwait>
          </Suspense>
        </div>
      </div>
    </>
  );
};

export default FavoritePage;
