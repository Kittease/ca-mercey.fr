import { thumbHashToDataURL } from "thumbhash";

export const thumbhashToDataUrl = (
  base64: string | null | undefined,
): string | null => {
  if (!base64) {
    return null;
  }

  return thumbHashToDataURL(Buffer.from(base64, "base64"));
};
