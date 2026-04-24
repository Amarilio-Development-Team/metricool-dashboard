'use client';

import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window.matchMedia !== 'function') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMatches(false);
      return;
    }

    const mediaQueryList = window.matchMedia(query);

    const updateMatch = () => setMatches(mediaQueryList.matches);

    updateMatch();

    mediaQueryList.addEventListener('change', updateMatch);

    return () => {
      mediaQueryList.removeEventListener('change', updateMatch);
    };
  }, [query]);

  return matches;
}
