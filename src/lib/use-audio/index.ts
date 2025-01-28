import { useEffect, useState } from "react";

import { useAudioContext } from "./context";

export const useAudio = (audioUrl: string) => {
  const [audio] = useState(new Audio(audioUrl));
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { currentlyPlayingUrl, setCurrentlyPlayingUrl } = useAudioContext();

  const playPause = () => {
    setIsPlaying(!isPlaying);
    setCurrentlyPlayingUrl(audioUrl);
  };

  useEffect(() => {
    if (currentlyPlayingUrl !== audioUrl && isPlaying) {
      setIsPlaying(false);
      audio.pause();
      audio.currentTime = 0;
      setCurrentTime(0);
    }
  }, [currentlyPlayingUrl, audioUrl, audio, isPlaying]);

  useEffect(() => {
    if (isPlaying) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [audio, isPlaying]);

  useEffect(() => {
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentlyPlayingUrl(null);
    };

    const handleTimeUpdate = () => {
      if (audio.currentTime < audio.duration) {
        setCurrentTime(audio.currentTime);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentlyPlayingUrl(null);
      }
    };

    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [audio, setCurrentlyPlayingUrl]);

  return {
    audio,
    playPause,
    isPlaying,
    currentTime,
    duration: audio.duration,
  };
};
