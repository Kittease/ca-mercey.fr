import { useMemo, useSyncExternalStore } from "react";

export function useMediaQuery(query: string) {
  const mediaQueryList = useMemo(
    () => (typeof window === "undefined" ? null : window.matchMedia(query)),
    [query],
  );

  return useSyncExternalStore(
    (callback) => {
      if (!mediaQueryList) {
        return () => undefined;
      }

      mediaQueryList.addEventListener("change", callback);
      return () => {
        mediaQueryList.removeEventListener("change", callback);
      };
    },
    () => mediaQueryList?.matches ?? false,
    () => false,
  );
}
