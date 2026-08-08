import { useEffect, useState } from 'react';

const HERO_FRAME = '/assets/heroimg/frame_000_delay-0.06s.jpg';
const MIN_LOAD_MS = 300;
const MAX_LOAD_MS = 3000;

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = src;
  });
}

function waitForFonts() {
  if (document.fonts?.ready) {
    return document.fonts.ready.catch(() => undefined);
  }
  return Promise.resolve();
}

export function usePageLoad() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      const minDelay = new Promise((resolve) => setTimeout(resolve, MIN_LOAD_MS));
      const maxTimeout = new Promise((resolve) => setTimeout(resolve, MAX_LOAD_MS));

      await Promise.race([
        Promise.all([preloadImage(HERO_FRAME), waitForFonts(), minDelay]),
        maxTimeout,
      ]);

      if (!cancelled) {
        setIsLoading(false);
      }
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return isLoading;
}
