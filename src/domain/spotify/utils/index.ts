import { RawSimplifiedAlbum } from "@/domain/spotify/services/album/types";
import { SpotifyImage } from "@/domain/spotify/types";

export const getAlbumReleaseDateObject = (
  date: RawSimplifiedAlbum["release_date"],
  datePrecision: RawSimplifiedAlbum["release_date_precision"]
) => {
  const parts = date.split("-");

  return {
    year: parts[0],
    month: datePrecision !== "year" ? parts[1] : undefined,
    day: datePrecision === "day" ? parts[2] : undefined,
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
