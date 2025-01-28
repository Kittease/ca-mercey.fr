import { Metadata, ResolvingMetadata } from "next";
import Image from "next/image";

import { getProject } from "@/domain/music/services/projects";
import { Project } from "@/domain/music/services/projects/types";
import logger from "@/lib/logger";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/tailwind";

// Pre-render all favorite projects pages
import ProjectTracks from "./_components/project-tracks";

export async function generateStaticParams() {
  return (await prisma.favoriteProjects.findMany()).map(({ projectId }) => ({
    albumId: projectId,
  }));
}

interface AlbumPageProps {
  params: {
    albumId: string;
  };
}

export async function generateMetadata(
  { params: { albumId } }: AlbumPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
    const project = await getProject(albumId);

    return {
      title: `${project.name} by ${project.artists
        .map((artist) => artist.name)
        .join(", ")}`,

      openGraph: {
        images: [project.coverUrl ?? ""],
      },
    };
  } catch (error) {
    logger.info(error);
    return { title: (await parent).title };
  }
}

const AlbumPage = async ({ params: { albumId } }: AlbumPageProps) => {
  let project: Project;
  try {
    project = await getProject(albumId);
  } catch (error) {
    logger.info(error);
    return <h1>Album inconnu</h1>;
  }

  // eslint-disable-next-line no-unused-vars, unused-imports/no-unused-vars, @typescript-eslint/no-unused-vars
  const discCount = project.tracks.reduce(
    (acc, { discNumber }) => (discNumber > acc ? discNumber : acc),
    1
  );

  return (
    <>
      {project.coverUrl ? (
        <Image
          src={project.coverUrl}
          alt=""
          className="absolute inset-x-0 -top-40 z-[-1] h-[calc(100%+10rem)] w-screen object-cover object-top opacity-40"
          width={1024}
          height={1024}
        />
      ) : null}

      <div
        className={cn(
          "relative flex w-full justify-center backdrop-blur-3xl",
          "before:absolute before:inset-0 before:z-[-1] before:bg-gradient-to-b before:from-transparent before:to-[theme(colors.stone.950)_calc(theme(spacing.96)+theme(spacing.32))]"
        )}
      >
        <div className="flex w-full max-w-[90%] flex-col gap-y-16 py-16">
          <div className="flex flex-col items-center gap-x-12 gap-y-4 md:flex-row">
            {project.coverUrl ? (
              <Image
                src={project.coverUrl}
                alt=""
                className="size-48 rounded-lg md:size-96"
                width={384}
                height={384}
              />
            ) : null}

            <div className="flex flex-col items-center text-center font-bold md:items-start md:text-left">
              <h1 className="text-4xl text-stone-50">{project.name}</h1>
              <h2 className="text-xl text-stone-400">
                {project.artists.map((artist, i) => (
                  <>
                    <span key={artist.id}>{artist.name}</span>
                    {i < project.artists.length - 1 ? (
                      <span>,&nbsp;</span>
                    ) : null}
                  </>
                ))}
              </h2>
            </div>
          </div>

          <ProjectTracks tracks={project.tracks} />
        </div>
      </div>
    </>
  );
};

export default AlbumPage;
