"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface PhotoSelectionItem {
  id: string;
}

interface PhotoSelectionContextValue {
  selectedPhotos: PhotoSelectionItem[];
  selectedPhotoCount: number;
  clearSelection: () => void;
  isPhotoSelected: (id: string) => boolean;
  togglePhoto: (photo: PhotoSelectionItem) => void;
  selectRange: (orderedIds: string[], toId: string) => void;
}

const PhotoSelectionContext = createContext<PhotoSelectionContextValue | null>(
  null,
);

const PhotoSelectionProvider = ({ children }: PropsWithChildren) => {
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoSelectionItem[]>(
    [],
  );

  const anchorIdRef = useRef<string | null>(null);

  const isPhotoSelected = useCallback(
    (id: string) => selectedPhotos.some((photo) => photo.id === id),
    [selectedPhotos],
  );

  const togglePhoto = useCallback((photo: PhotoSelectionItem) => {
    setSelectedPhotos((currentPhotos) => {
      if (currentPhotos.some(({ id }) => id === photo.id)) {
        anchorIdRef.current = null;

        return currentPhotos.filter(({ id }) => id !== photo.id);
      }

      anchorIdRef.current = photo.id;

      return [...currentPhotos, photo];
    });
  }, []);

  const selectRange = useCallback((orderedIds: string[], toId: string) => {
    const anchorId = anchorIdRef.current ?? toId;

    anchorIdRef.current = toId;

    setSelectedPhotos((currentPhotos) => {
      const fromIndex = orderedIds.indexOf(anchorId);
      const toIndex = orderedIds.indexOf(toId);

      if (fromIndex === -1 || toIndex === -1) {
        if (currentPhotos.some(({ id }) => id === toId)) {
          return currentPhotos;
        }

        return [...currentPhotos, { id: toId }];
      }

      const [start, end] =
        fromIndex <= toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex];

      const existing = new Set(currentPhotos.map(({ id }) => id));
      const additions = orderedIds
        .slice(start, end + 1)
        .filter((id) => !existing.has(id))
        .map((id) => ({ id }));

      if (additions.length === 0) {
        return currentPhotos;
      }

      return [...currentPhotos, ...additions];
    });
  }, []);

  const clearSelection = useCallback(() => {
    anchorIdRef.current = null;
    // Bail out when nothing is selected so callers (e.g. the Escape handler)
    // don't trigger a re-render of every selection consumer on a no-op.
    setSelectedPhotos((currentPhotos) =>
      currentPhotos.length === 0 ? currentPhotos : [],
    );
  }, []);

  // Pressing Escape clears the current selection.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        clearSelection();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearSelection]);

  const value = useMemo<PhotoSelectionContextValue>(
    () => ({
      selectedPhotos,
      selectedPhotoCount: selectedPhotos.length,
      clearSelection,
      isPhotoSelected,
      togglePhoto,
      selectRange,
    }),
    [clearSelection, isPhotoSelected, selectRange, selectedPhotos, togglePhoto],
  );

  return (
    <PhotoSelectionContext.Provider value={value}>
      {children}
    </PhotoSelectionContext.Provider>
  );
};

const usePhotoSelection = () => {
  const context = useContext(PhotoSelectionContext);

  if (!context) {
    throw new Error(
      "usePhotoSelection must be used within a PhotoSelectionProvider.",
    );
  }

  return context;
};

export { PhotoSelectionProvider, usePhotoSelection };
