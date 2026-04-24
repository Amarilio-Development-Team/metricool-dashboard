import React from 'react';

const ChartSkeleton: React.FC = () => (
  <div className="main-container-color border-primary h-[450px] w-full animate-pulse rounded-2xl p-6">
    <div className="mb-6 flex justify-between">
      <div className="container-color h-6 w-32 rounded" />
      <div className="container-color h-8 w-48 rounded" />
    </div>
    <div className="container-color h-[350px] w-full rounded" />
  </div>
);

export default ChartSkeleton;
