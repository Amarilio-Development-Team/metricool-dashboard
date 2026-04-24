export const InteractionBreakdownSkeleton = () => {
  return (
    <div className="w-full animate-pulse rounded-xl border bg-white shadow-sm">
      {/* Título del Header */}
      <div className="flex flex-col space-y-1.5 p-6 pb-2">
        <div className="h-6 w-48 rounded bg-gray-200" />
      </div>

      {/* Contenido Grid */}
      <div className="grid grid-cols-1 items-center gap-6 p-6 pt-4 md:grid-cols-2">
        {/* LADO IZQUIERDO: Caja del Total */}
        <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-6">
          {/* Círculo del icono */}
          <div className="mb-3 h-14 w-14 rounded-full bg-gray-200" />

          {/* Número Grande */}
          <div className="mb-2 h-10 w-20 rounded bg-gray-200" />

          {/* Texto Label */}
          <div className="mb-3 h-4 w-32 rounded bg-gray-200" />

          {/* Badge */}
          <div className="h-6 w-24 rounded-full bg-gray-200" />
        </div>

        {/* LADO DERECHO: Lista de Items */}
        <div className="space-y-5">
          {[1, 2, 3, 4].map(item => (
            <div key={item} className="flex items-center justify-between">
              {/* Icono + Texto */}
              <div className="flex items-center gap-3">
                <div className="h-5 w-5 rounded bg-gray-200" />
                <div className="h-4 w-24 rounded bg-gray-200" />
              </div>

              {/* Barra + Valor */}
              <div className="flex items-center gap-3">
                <div className="h-2 w-24 rounded-full bg-gray-200" />
                <div className="h-4 w-8 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
