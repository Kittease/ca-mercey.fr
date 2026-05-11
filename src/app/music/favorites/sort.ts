import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";

import { ProjectGroup } from "@/app/music/favorites/types";
import {
  FavoriteProject,
  FavoriteProjectsOrderBy,
  FavoriteProjectsOrderDirection,
} from "@/domain/music/services/favorite-projects/types";
import exhaustiveSwitchCheck from "@/lib/exhaustive-check";

const getDateValue = (project: FavoriteProject) => {
  const month = project.releaseMonth ?? "01";
  const day = project.releaseDay ?? "01";

  return parse(
    `${project.releaseYear}-${month}-${day}`,
    "yyyy-MM-dd",
    new Date(),
  );
};

const sortProjectsInGroupByName = (
  projects: FavoriteProject[],
  direction?: FavoriteProjectsOrderDirection,
) =>
  projects.sort(
    (a, b) =>
      a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
        numeric: true,
      }) * (direction === "desc" ? -1 : 1),
  );

const sortProjectsInGroupByDate = (
  projects: FavoriteProject[],
  direction?: FavoriteProjectsOrderDirection,
) =>
  projects.sort(
    (a, b) =>
      (getDateValue(a).getTime() - getDateValue(b).getTime()) *
      (direction === "desc" ? -1 : 1),
  );

const formatDateGroupTitle = (project: FavoriteProject) => {
  if (!project.releaseMonth) {
    return project.releaseYear;
  }

  return format(
    parse(
      `${project.releaseYear}-${project.releaseMonth}-01`,
      "yyyy-MM-dd",
      new Date(),
    ),
    "MMMM yyyy",
    { locale: fr },
  );
};

const groupByDate = (
  projects: FavoriteProject[],
  direction?: FavoriteProjectsOrderDirection,
): ProjectGroup[] => {
  const groupedProjects = Object.groupBy(projects, formatDateGroupTitle);

  return Object.entries(groupedProjects)
    .map(
      ([groupTitle, projects]): ProjectGroup => ({
        groupTitle,
        sortedProjects: sortProjectsInGroupByName(projects ?? [], direction),
      }),
    )
    .sort((a, b) => {
      const aIsYearOnly = /^[0-9]{4}$/.test(a.groupTitle);
      const bIsYearOnly = /^[0-9]{4}$/.test(b.groupTitle);

      if (aIsYearOnly && bIsYearOnly) {
        return (
          (parseInt(a.groupTitle) - parseInt(b.groupTitle)) *
          (direction === "desc" ? -1 : 1)
        );
      }

      if (aIsYearOnly) {
        const [, yearB] = b.groupTitle.split(" ");
        const yearAInt = parseInt(a.groupTitle);
        const yearBInt = parseInt(yearB ?? "");
        return yearAInt === yearBInt
          ? direction === "desc"
            ? 1
            : -1
          : (yearAInt - yearBInt) * (direction === "desc" ? -1 : 1);
      }

      if (bIsYearOnly) {
        const [, yearA] = a.groupTitle.split(" ");
        const yearAInt = parseInt(yearA ?? "");
        const yearBInt = parseInt(b.groupTitle);
        return yearAInt === yearBInt
          ? direction === "desc"
            ? -1
            : 1
          : (yearAInt - yearBInt) * (direction === "desc" ? -1 : 1);
      }

      const parseFormattedDate = (dateStr: string) =>
        parse(dateStr, "MMMM yyyy", new Date(), { locale: fr });

      return (
        (parseFormattedDate(a.groupTitle).getTime() -
          parseFormattedDate(b.groupTitle).getTime()) *
        (direction === "desc" ? -1 : 1)
      );
    });
};

const groupByArtist = (
  projects: FavoriteProject[],
  direction?: FavoriteProjectsOrderDirection,
): ProjectGroup[] => {
  // A project can belong to multiple artists, so flatten to (artist, project)
  // pairs before grouping
  const pairs = projects.flatMap((project) =>
    project.artists.map((artist) => ({ artistName: artist.name, project })),
  );
  const groupedPairs = Object.groupBy(pairs, ({ artistName }) => artistName);

  return Object.entries(groupedPairs)
    .map(
      ([groupTitle, pairs]): ProjectGroup => ({
        groupTitle,
        sortedProjects: sortProjectsInGroupByDate(
          (pairs ?? []).map(({ project }) => project),
          direction,
        ),
      }),
    )
    .sort(
      (a, b) =>
        a.groupTitle.localeCompare(b.groupTitle, undefined, {
          sensitivity: "base",
        }) * (direction === "desc" ? -1 : 1),
    );
};

const groupByName = (
  projects: FavoriteProject[],
  direction?: FavoriteProjectsOrderDirection,
): ProjectGroup[] => {
  const groupedProjects = Object.groupBy(projects, (project) => {
    const name = project.name.normalize("NFD");
    const firstAlphaNumMatch = /[A-Za-z0-9]/.exec(name);

    return firstAlphaNumMatch ? firstAlphaNumMatch[0].toUpperCase() : "-";
  });

  return Object.entries(groupedProjects)
    .map(
      ([groupTitle, projects]): ProjectGroup => ({
        groupTitle,
        sortedProjects: sortProjectsInGroupByName(projects ?? [], direction),
      }),
    )
    .sort((a, b) => {
      if (a.groupTitle === "-") {
        return direction === "desc" ? -1 : 1;
      }

      if (b.groupTitle === "-") {
        return direction === "desc" ? 1 : -1;
      }

      const isANumber = /^[0-9]$/.test(a.groupTitle);
      const isBNumber = /^[0-9]$/.test(b.groupTitle);

      if (isANumber && isBNumber) {
        return (
          (parseInt(a.groupTitle) - parseInt(b.groupTitle)) *
          (direction === "desc" ? -1 : 1)
        );
      }

      if (isANumber) {
        return direction === "desc" ? -1 : 1;
      }

      if (isBNumber) {
        return direction === "desc" ? 1 : -1;
      }

      return (
        a.groupTitle.localeCompare(b.groupTitle) *
        (direction === "desc" ? -1 : 1)
      );
    });
};

const groupByDuration = (
  projects: FavoriteProject[],
  direction?: FavoriteProjectsOrderDirection,
): ProjectGroup[] => {
  const projectDurations = new Map<string, number>();
  projects.forEach(({ id, tracks }) => {
    projectDurations.set(
      id,
      tracks.reduce((acc, { duration }) => acc + duration, 0),
    );
  });

  const sortedProjects = [...projects].sort(
    (a, b) =>
      ((projectDurations.get(a.id) ?? 0) - (projectDurations.get(b.id) ?? 0)) *
      (direction === "desc" ? -1 : 1),
  );

  return [{ groupTitle: "", sortedProjects }];
};

export const sortAndGroupProjects = (
  projects: FavoriteProject[],
  orderBy: FavoriteProjectsOrderBy,
  direction?: FavoriteProjectsOrderDirection,
): ProjectGroup[] => {
  switch (orderBy) {
    case "date":
      return groupByDate(projects, direction);

    case "artist":
      return groupByArtist(projects, direction);

    case "name":
      return groupByName(projects, direction);

    case "duration":
      return groupByDuration(projects, direction);

    default:
      return exhaustiveSwitchCheck(orderBy);
  }
};
