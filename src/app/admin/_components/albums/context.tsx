"use client";

import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { Album } from "@/domain/photography/services/albums/types";

interface AlbumContextValue {
  albums: Album[];
  addAlbum: (album: Album) => void;
}

const AlbumContext = createContext<AlbumContextValue | null>(null);

interface AlbumProviderProps {
  initialAlbums: Album[];
}

export const AlbumProvider = ({
  initialAlbums,
  children,
}: PropsWithChildren<AlbumProviderProps>) => {
  const [albums, setAlbums] = useState<Album[]>(initialAlbums);

  const addAlbum = useCallback((album: Album) => {
    setAlbums((current) => [album, ...current]);
  }, []);

  const value = useMemo<AlbumContextValue>(
    () => ({ albums, addAlbum }),
    [albums, addAlbum],
  );

  return (
    <AlbumContext.Provider value={value}>{children}</AlbumContext.Provider>
  );
};

export const useAlbums = () => {
  const context = useContext(AlbumContext);

  if (!context) {
    throw new Error("useAlbums must be used within an AlbumProvider.");
  }

  return context;
};
