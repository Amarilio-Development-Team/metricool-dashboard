'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TrafficSourceData } from '@/features/analytics/platforms/tiktok/adapter';

interface Props {
  data: TrafficSourceData[];
}

// Mapeo de Colores (Estilo TikTok / Dashboard)
const SOURCE_COLORS: Record<string, string> = {
  FOR_YOU: '#F43F5E', // Rosa intenso (Para Ti)
  PERSONAL_PROFILE: '#8B5CF6', // Violeta
  FOLLOW: '#0EA5E9', // Azul
  SEARCH: '#F59E0B', // Naranja
  SOUND: '#10B981', // Verde
  HASHTAG: '#EC4899', // Rosa claro
  DEFAULT: '#94A3B8', // Gris
};

// Mapeo de Etiquetas
const SOURCE_LABELS: Record<string, string> = {
  FOR_YOU: 'Para Ti (Recomendados)',
  PERSONAL_PROFILE: 'Perfil Personal',
  FOLLOW: 'Siguiendo',
  SEARCH: 'Búsqueda',
  SOUND: 'Sonido / Música',
  HASHTAG: 'Hashtags',
  DEFAULT: 'Otros',
};

export const TkTrafficSourcesChart = ({ data }: Props) => {
  // 1. Ordenar datos de mayor a menor para la lista y tomar el TOP para el centro
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  const topSourceValue = sortedData[0]?.value || 0;

  const hasData = data && data.length > 0 && data.some(item => item.value > 0);

  const getColor = (key: string) => SOURCE_COLORS[key] || SOURCE_COLORS.DEFAULT;
  const getLabel = (key: string) => SOURCE_LABELS[key] || key;

  if (!hasData) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center py-10 text-gray-400">
        <p className="text-sm font-medium">Sin datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-2 lg:items-center">
      {/* IZQUIERDA: GRÁFICO DONUT */}
      <div className="relative h-full w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.key || '')} className="stroke-white dark:stroke-gray-950" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number | undefined) => {
                return [`${(value || 0).toFixed(2)}%`, ''];
              }}
              contentStyle={{
                borderRadius: '8px',
                border: 'none',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                padding: '6px 12px',
                backgroundColor: 'white',
                color: '#1f2937',
              }}
              itemStyle={{ fontWeight: 600, fontSize: '13px' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Texto Central del Donut */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest">TOP</span>
          <span className="text-strong text-2xl font-black">{topSourceValue.toFixed(0)}%</span>
        </div>
      </div>

      {/* DERECHA: LISTA DE DETALLES CON BARRAS */}
      <div className="flex flex-col gap-5">
        {sortedData.map((item, index) => (
          <div key={index} className="flex flex-col gap-1.5">
            {/* Fila de Texto: Etiqueta y Porcentaje */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: getColor(item.key || '') }} />
                <span className="text-strong font-medium">{getLabel(item.key || '')}</span>
              </div>
              <span className="text-strong font-bold">{item.value.toFixed(2)}%</span>
            </div>

            {/* Barra de Progreso */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{
                  width: `${item.value}%`,
                  backgroundColor: getColor(item.key || ''),
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
