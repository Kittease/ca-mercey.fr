import { FavoriteProject } from "@/domain/music/services/favorite-projects/types";

export interface ProjectGroup {
  groupTitle: string;
  sortedProjects: FavoriteProject[];
}
