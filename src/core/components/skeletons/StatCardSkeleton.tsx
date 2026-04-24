import React from 'react';

interface Props {
  className?: string;
}

export const StatCardSkeleton: React.FC<Props> = ({ className }) => {
  return (
    <div className={`main-container-color border-primary flex flex-col justify-center overflow-hidden rounded-2xl p-4 shadow-sm md:p-6 ${className || ''}`}>
      <div className="mb-3 flex items-center gap-3 md:mb-4">
        <div className="container-color h-8 w-8 shrink-0 animate-pulse rounded-full md:h-10 md:w-10" />
        <div className="container-color h-3 w-20 animate-pulse rounded md:h-4 md:w-24" />
      </div>

      <div className="container-color mb-2 h-6 w-24 animate-pulse rounded md:h-8 md:w-32" />

      {/* TENDENCIA (Línea inferior) */}
      <div className="container-color h-3 w-2/3 animate-pulse rounded md:h-4" />
    </div>
  );
};

export default StatCardSkeleton;
