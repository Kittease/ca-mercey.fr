export const formatNumber = (value: number): string =>
  value.toLocaleString("fr"); // TODO: localize the formatting

export const formatTime = (
  timeInSeconds: number,
  options?: { padMinutes?: boolean; hours?: boolean; padHours?: boolean }
): string => {
  if (options?.hours) {
    throw new Error("Hours are not supported yet");
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.round(timeInSeconds - minutes * 60);

  if (options?.padMinutes) {
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }

  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};
