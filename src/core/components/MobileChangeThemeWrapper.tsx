'use client';

import React from 'react';
import { useMediaQuery } from '@/core/hooks/useMediaQuery';

const MobileChangeThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  return (
    <main className="container relative flex h-max w-full max-w-[2400px] px-0 lg:h-screen" data-theme={isDesktop ? 'acid' : 'black'}>
      {children}
    </main>
  );
};

export default MobileChangeThemeWrapper;
