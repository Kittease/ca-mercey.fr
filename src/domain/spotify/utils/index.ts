import { RawSimplifiedAlbum } from "@/domain/spotify/services/album/types";
import { SpotifyImage } from "@/domain/spotify/types";

export const getAlbumReleaseDateObject = (
  date: RawSimplifiedAlbum["release_date"],
  datePrecision: RawSimplifiedAlbum["release_date_precision"],
) => {
  const [year = "", month, day] = date.split("-");

  return {
    year,
    month: datePrecision !== "year" ? month : undefined,
    day: datePrecision === "day" ? day : undefined,
  };
};

export const getHighestDefinitionSpotifyImage = (images: SpotifyImage[]) => {
  const [first, ...rest] = images;
  if (!first) {
    return null;
  }

  return rest.reduce((acc, val) => (acc.width > val.width ? acc : val), first);
};
