'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback, useRef, useEffect, useMemo } from 'react';
import PLATFORMS from '@/core/constants/platforms';
import Image from 'next/image';
import { useThemeStore } from '@/core/stores/theme.store';

export default function PlatformSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { theme } = useThemeStore();

  const currentPlatform = useMemo(() => {
    const param = searchParams.get('platform');
    const isValidPlatform = PLATFORMS.some(p => p.id === param);

    return isValidPlatform ? param : 'facebook';
  }, [searchParams]);

  const updateMask = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    const isAtStart = scrollLeft <= 2;
    const isAtEnd = Math.abs(scrollWidth - clientWidth - scrollLeft) <= 2;

    let newMask = '';

    if (isAtStart && !isAtEnd) {
      newMask = 'linear-gradient(to right, black 80%, transparent 100%)';
    } else if (!isAtStart && isAtEnd) {
      newMask = 'linear-gradient(to right, transparent 0%, black 20%)';
    } else if (!isAtStart && !isAtEnd) {
      newMask = 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)';
    } else {
      newMask = 'none';
    }

    if (el.style.maskImage !== newMask) {
      el.style.webkitMaskImage = newMask;
      el.style.maskImage = newMask;
    }
  }, []);

  useEffect(() => {
    requestAnimationFrame(() => updateMask());
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', updateMask, { passive: true });
      window.addEventListener('resize', updateMask);
    }
    return () => {
      if (el) el.removeEventListener('scroll', updateMask);
      window.removeEventListener('resize', updateMask);
    };
  }, [updateMask]);

  const handleSelect = useCallback(
    (platformId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (params.get('platform') !== platformId) {
        params.set('platform', platformId);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [pathname, router, searchParams]
  );

  //* When the page loads, check if the platform parameter is valid, if not, redirect to facebook
  useEffect(() => {
    const rawParam = searchParams.get('platform');
    if (rawParam !== currentPlatform) {
      handleSelect('facebook');
    }
  }, [searchParams, currentPlatform, handleSelect]);

  return (
    <div className="w-full max-w-full">
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide flex w-full items-center gap-3 overflow-x-auto px-2 py-4 transition-all duration-300 ease-out md:justify-start md:gap-4"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        {PLATFORMS.map(platform => {
          const isActive = currentPlatform === platform.id;
          const iconSrc = theme === 'fantasy' ? platform.icons.light : platform.icons.dark;

          return (
            <button
              key={platform.id}
              id={`platform-btn-${platform.id}`}
              onClick={() => handleSelect(platform.id)}
              className={`group flex shrink-0 items-center gap-2.5 rounded-full border px-5 py-3 text-sm font-medium shadow-sm backdrop-blur-sm transition-all duration-300 ${
                isActive
                  ? 'scale-105 border-gray-800 bg-gray-900/90 text-white shadow-lg dark:border-gray-100 dark:bg-white/90 dark:text-gray-900'
                  : 'border-gray-200/50 bg-white/50 text-gray-600 hover:scale-110 hover:bg-white/80 hover:text-gray-900 dark:border-gray-700/50 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800/80 dark:hover:text-white'
              } `}
            >
              <Image src={iconSrc} alt={platform.label} width={20} height={20} className="size-5" />

              <span className="whitespace-nowrap">{platform.label}</span>

              {isActive && <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-green-500"></span>}
            </button>
          );
        })}
        <div className="w-4 shrink-0"></div>
      </div>
    </div>
  );
}
