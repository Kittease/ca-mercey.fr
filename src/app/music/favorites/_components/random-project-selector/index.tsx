"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ShuffleIcon } from "lucide-react";
import { useState } from "react";

import AlbumFancy from "@/app/_components/business/album/fancy";
import { FavoriteProject } from "@/domain/music/services/favorite-projects/types";
import { useMediaQuery } from "@/lib/tailwind/hooks";

interface RandomProjectSelectorProps {
  projects: FavoriteProject[];
}

const transition = {
  type: "spring",
  duration: 0.6,
};

const RandomProjectSelector = ({ projects }: RandomProjectSelectorProps) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedProject, setSelectedProject] = useState<
    FavoriteProject | undefined
  >(undefined);

  const selectRandomProject = () => {
    document.body.style.overflow = "hidden";

    setSelectedProject(projects[Math.floor(Math.random() * projects.length)]);
  };

  const closeRandomProject = (event: React.MouseEvent) => {
    if (event.target !== event.currentTarget) {
      return;
    }

    document.body.style.overflow = "auto";

    setSelectedProject(undefined);
  };

  return (
    <>
      <ShuffleIcon onClick={selectRandomProject} className="cursor-pointer" />

      <AnimatePresence>
        {selectedProject ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={transition}
            className="absolute inset-0 flex h-screen w-full items-center justify-center bg-stone-950/75"
            onClick={closeRandomProject}
          >
            <motion.div
              initial={{ y: "100vh", scale: 0 }}
              animate={{
                y: 0,
                scale: isDesktop ? 2 : (window.innerWidth * 0.85) / 256, // 256px = the width of an `AlbumFancy`
              }}
              exit={{ y: "100vh", scale: 0 }}
              transition={transition}
              className="border border-black"
            >
              <AlbumFancy project={selectedProject} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default RandomProjectSelector;
