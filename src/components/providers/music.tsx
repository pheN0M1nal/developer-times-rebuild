"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

// Header record player: a listener-supported SomaFM lounge stream, started
// only by a click (browsers block audio without a user gesture).
const STREAM = "https://ice1.somafm.com/illstreet-128-mp3";

type Music = { playing: boolean; loading: boolean; toggle: () => void };
const MusicContext = createContext<Music>({ playing: false, loading: false, toggle: () => {} });

export function MusicProvider({ children }: { children: React.ReactNode }) {
  const audio = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => () => audio.current?.pause(), []);

  const toggle = useCallback(() => {
    if (!audio.current) {
      const el = new Audio();
      el.preload = "none";
      el.volume = 0.35;
      el.addEventListener("playing", () => {
        setLoading(false);
        setPlaying(true);
      });
      el.addEventListener("pause", () => setPlaying(false));
      el.addEventListener("error", () => {
        setLoading(false);
        setPlaying(false);
      });
      audio.current = el;
    }
    const el = audio.current;
    if (playing || loading) {
      el.pause();
      el.removeAttribute("src");
      el.load();
      setLoading(false);
      setPlaying(false);
    } else {
      setLoading(true);
      el.src = STREAM;
      el.play().catch(() => setLoading(false));
    }
  }, [playing, loading]);

  return <MusicContext.Provider value={{ playing, loading, toggle }}>{children}</MusicContext.Provider>;
}

export const useMusic = () => useContext(MusicContext);
