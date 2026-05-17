"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

interface PhotoSelectionItem {
  src: string;
}

interface PhotoSelectionContextValue {
  selectedPhotos: PhotoSelectionItem[];
  selectedPhotoCount: number;
  clearSelection: () => void;
  isPhotoSelected: (src: string) => boolean;
  togglePhoto: (photo: PhotoSelectionItem) => void;
}

const PhotoSelectionContext = createContext<PhotoSelectionContextValue | null>(
  null,
);

const PhotoSelectionProvider = ({ children }: PropsWithChildren) => {
  const [selectedPhotos, setSelectedPhotos] = useState<PhotoSelectionItem[]>(
    [],
  );

  const isPhotoSelected = useCallback(
    (src: string) => selectedPhotos.some((photo) => photo.src === src),
    [selectedPhotos],
  );

  const togglePhoto = useCallback((photo: PhotoSelectionItem) => {
    setSelectedPhotos((currentPhotos) => {
      if (currentPhotos.some(({ src }) => src === photo.src)) {
        return currentPhotos.filter(({ src }) => src !== photo.src);
      }

      return [...currentPhotos, photo];
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPhotos([]);
  }, []);

  const value = useMemo<PhotoSelectionContextValue>(
    () => ({
      selectedPhotos,
      selectedPhotoCount: selectedPhotos.length,
      clearSelection,
      isPhotoSelected,
      togglePhoto,
    }),
    [clearSelection, isPhotoSelected, selectedPhotos, togglePhoto],
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
