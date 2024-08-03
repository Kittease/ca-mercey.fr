import { SimplifiedAlbum } from "@/domain/spotify/services/album/types";
import { SpotifyImage } from "@/domain/spotify/types";

export const getAlbumReleaseDateObject = (
  date: SimplifiedAlbum["releaseDate"],
  datePrecision: SimplifiedAlbum["releaseDatePrecision"]
) => {
  const parts = date.split("-");

  return {
    year: parts[0],
    month: datePrecision === "month" ? parts[1] : null,
    day: datePrecision === "day" ? parts[2] : null,
  };
};

export const getHighestDefinitionSpotifyImage = (images: SpotifyImage[]) => {
  if (images.length === 0) {
    return null;
  }

  return images.reduce(
    (acc, val) => (acc.width > val.width ? acc : val),
    images[0]
  );
};
