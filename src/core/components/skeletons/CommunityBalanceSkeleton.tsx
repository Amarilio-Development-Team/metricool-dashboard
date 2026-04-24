export const CommunityBalanceSkeleton = () => {
  // Simulamos alturas "aleatorias" pero estáticas para evitar el error de pureza
  const mockBars = [
    { h1: '40%', h2: '10%' },
    { h1: '60%', h2: '20%' },
    { h1: '30%', h2: '0%' },
    { h1: '80%', h2: '15%' },
    { h1: '50%', h2: '5%' },
    { h1: '70%', h2: '25%' },
    { h1: '45%', h2: '10%' },
  ];

  return (
    <div className="main-container-color border-primary w-full animate-pulse rounded-xl p-6 shadow-sm">
      {/* Header Title */}
      <div className="container-color mb-6 h-6 w-40 rounded" />

      {/* 3 Summary Cards */}
      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="container-color h-20 rounded-lg" />
        <div className="container-color h-20 rounded-lg" />
        <div className="container-color h-20 rounded-lg" />
      </div>

      {/* Chart Area */}
      <div className="mt-4">
        <div className="container-color mb-4 h-4 w-24 rounded" />
        <div className="flex h-[150px] items-end justify-between gap-2">
          {mockBars.map((bar, i) => (
            <div key={i} className="flex h-full w-full items-end justify-center gap-1">
              <div className="container-color w-3 rounded-t-sm" style={{ height: bar.h1 }} />
              <div className="container-color w-3 rounded-t-sm" style={{ height: bar.h2 }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
