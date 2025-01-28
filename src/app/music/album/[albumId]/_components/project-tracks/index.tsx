"use client";

import ProjectTrack from "@/app/music/album/[albumId]/_components/project-track";
import { type ProjectTrack as ProjectTrackType } from "@/domain/music/services/projects/types";
import { AudioProvider } from "@/lib/use-audio/context";

interface ProjectTracksProps {
  tracks: ProjectTrackType[];
}

const ProjectTracks = ({ tracks }: ProjectTracksProps) => {
  return (
    <AudioProvider>
      <ul className="grid w-full grid-cols-[theme(spacing.10)_auto_max-content] gap-x-6">
        {tracks.map((track) => (
          <ProjectTrack key={track.id} track={track} />
        ))}
      </ul>
    </AudioProvider>
  );
};

export default ProjectTracks;
