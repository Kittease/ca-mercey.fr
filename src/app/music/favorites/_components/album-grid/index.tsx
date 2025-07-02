import { FavoriteProject } from "@/domain/music/services/favorite-projects/types";
import AlbumFancy from "@/app/_components/business/album/fancy";

interface AlbumGridProps {
  projects: FavoriteProject[];
}

const AlbumGrid = ({ projects }: AlbumGridProps) => {
  return (
    <div className="grid size-fit grid-cols-1 justify-center gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {projects.map((project) => (
        <AlbumFancy project={project} key={project.id} />
      ))}
    </div>
  );
};

export default AlbumGrid;
