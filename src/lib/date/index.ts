import { format } from "date-fns";

const HOUR = 60 * 60 * 1000;

const DAY = 24 * HOUR;

const WEEK = 7 * DAY;

// TODO: localize the formatting
export const formatRelativeTime = (date: Date): string => {
  const diff = new Date().getTime() - date.getTime();

  if (diff < 0) {
    throw new Error("`formatRelativeTime` only supports past dates");
  }

  if (diff < HOUR) {
    return "il y a moins d'une heure";
  }

  if (diff < DAY) {
    const hours = Math.round(diff / HOUR);

    if (hours < 2) {
      return "il y a une heure";
    }

    return `il y a ${hours} heures`;
  }

  if (diff < WEEK) {
    const days = Math.round(diff / WEEK);

    if (days < 2) {
      return "il y a un jour";
    }

    return `il y a ${days} jours`;
  }

  return format(date, "dd/MM/yyyy");
};

export const formatDuration = (duration: number): string => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.round(duration % 60);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString();

  if (hours > 0) {
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();
    return `${hours}:${formattedMinutes}:${formattedSeconds}`;
  }

  if (minutes > 0) {
    return `${minutes}:${formattedSeconds}`;
  }

  return `${seconds}s`;
};
