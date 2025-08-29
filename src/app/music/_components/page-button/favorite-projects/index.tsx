"use client";

import { StarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

import ImageCarousel from "@/app/_components/image-carousel";
import PageButton from "@/app/music/_components/page-button";
import { Routes } from "@/lib/routes";

interface FavoriteProjectsButtonProps {
  covers: string[];
}

const FavoriteProjectsButton = ({ covers }: FavoriteProjectsButtonProps) => {
  const router = useRouter();

  const rowCount = 4;
  const size = Math.ceil(covers.length / rowCount);
  const rows: (typeof covers)[] = [];
  for (let i = 0; i < rowCount; i += 1) {
    rows.push(covers.slice(i * size, (i + 1) * size));
  }

  return (
    <PageButton
      onClick={() => router.push(Routes.FAVORITE_PROJECTS)}
      Icon={StarIcon}
      text={"Mes projets\nfavoris"}
    >
      <div className="flex origin-center -rotate-12 flex-col gap-y-4">
        {rows.map((coverUrls, i) => (
          <ImageCarousel
            key={i}
            imageUrls={coverUrls}
            imageProps={{ width: 64, height: 64 }}
            speed={0.5}
            defaultState="paused"
            {...(i % 2 === 0
              ? {
                  reverse: true,
                  className:
                    "left-[calc(-1*(--spacing(16)+(--spacing(6)))/2)] w-[calc(100%+(--spacing(16)+(--spacing(6)))/2)]",
                }
              : {})}
          />
        ))}
      </div>
    </PageButton>
  );
};

export default FavoriteProjectsButton;
