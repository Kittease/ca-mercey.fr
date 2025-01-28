import { createContext, useContext, useMemo, useState } from "react";

interface AudioContextType {
  currentlyPlayingUrl: string | null;
  setCurrentlyPlayingUrl: (url: string | null) => void;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentlyPlayingUrl, setCurrentlyPlayingUrl] = useState<string | null>(
    null
  );

  const value = useMemo(
    () => ({ currentlyPlayingUrl, setCurrentlyPlayingUrl }),
    [currentlyPlayingUrl]
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}

export function useAudioContext() {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error("useAudioContext must be used within an AudioProvider");
  }
  return context;
}
