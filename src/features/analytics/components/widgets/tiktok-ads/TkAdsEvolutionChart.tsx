'use client';

import { useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TkAdsEvolutionData } from '@/features/analytics/platforms/tiktok-ads/adapter';

interface Props {
  data: TkAdsEvolutionData[];
}

type TabType = 'reach' | 'results' | 'efficiency';

export const TkAdsEvolutionChart = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState<TabType>('reach');

  // Formatters
  const formatDate = (value: unknown) => {
    if (!value) return '';
    const date = new Date(value as string | number | Date);
    return isNaN(date.getTime()) ? '' : format(date, 'd MMM', { locale: es });
  };

  const formatCompactNumber = (value: number) => {
    return new Intl.NumberFormat('es-MX', { notation: 'compact', compactDisplay: 'short' }).format(value);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(value);
  };

  const formatTooltipValue = (value: number | string | Array<number | string> | undefined, name: string | undefined) => {
    const safeName = name || '';

    if (typeof value === 'number') {
      if (safeName.includes('Gasto') || safeName.includes('CPM') || safeName.includes('CPC')) {
        return [new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)];
      }
      if (safeName.includes('CTR')) {
        return [`${value.toFixed(2)}%`];
      }
      return [new Intl.NumberFormat('es-MX').format(value)];
    }

    return [value ?? '', ''];
  };

  return (
    <div className="main-container-color border-primary rounded-xl border p-6 shadow-sm">
      {/* HEADER */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-strong text-lg font-bold sm:text-xl">Evolución de Campañas</h3>
          <p className="text-low text-xs font-medium sm:text-sm">Inversión versus rendimiento diario</p>
        </div>

        {/* TABS */}
        <div className="container-color flex overflow-x-auto rounded-lg p-1">
          <button
            onClick={() => setActiveTab('reach')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'reach' ? 'bg-primary font-semibold text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'
            }`}
          >
            Alcance
          </button>
          <button
            onClick={() => setActiveTab('results')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'results' ? 'bg-primary font-semibold text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'
            }`}
          >
            Resultados
          </button>
          <button
            onClick={() => setActiveTab('efficiency')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'efficiency' ? 'bg-primary font-semibold text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'
            }`}
          >
            Costos
          </button>
        </div>
      </div>

      {/* CHART */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="h-[300px] w-full min-w-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {/* Gradiente sutil para el Gasto (Área de fondo) */}
                <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9CA3AF" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#9CA3AF" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

              <XAxis dataKey="date" tickFormatter={formatDate} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} minTickGap={30} />

              {/* EJE Y PRINCIPAL (Izquierda) - Para Impresiones, Clics, etc. */}
              <YAxis yAxisId="left" width={45} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={formatCompactNumber} />

              {/* EJE Y SECUNDARIO (Derecha) - Para el Gasto en MXN */}
              <YAxis yAxisId="right" orientation="right" width={60} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={formatCurrency} />

              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} labelFormatter={formatDate} formatter={formatTooltipValue} />

              <Legend verticalAlign="top" height={36} iconType="circle" formatter={value => <span className="text-strong ml-1 text-sm font-medium">{value}</span>} />

              {/* ÁREA BASE: GASTO TOTAL (Siempre visible, atado al eje derecho) */}
              <Area yAxisId="right" type="monotone" dataKey="cost" name="Gasto Total" stroke="#9CA3AF" fillOpacity={1} fill="url(#colorCost)" strokeWidth={2} activeDot={{ r: 4 }} />

              {/* TAB 1: ALCANCE */}
              {activeTab === 'reach' && (
                <Line yAxisId="left" type="monotone" dataKey="impressions" name="Impresiones" stroke="#FE2C55" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#FE2C55', strokeWidth: 0 }} />
              )}

              {/* TAB 2: RESULTADOS */}
              {activeTab === 'results' && (
                <>
                  <Line yAxisId="left" type="monotone" dataKey="clicks" name="Clics" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#8B5CF6', strokeWidth: 0 }} />
                  <Line yAxisId="left" type="monotone" dataKey="conversions" name="Conversiones" stroke="#0EA5E9" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#0EA5E9', strokeWidth: 0 }} />
                </>
              )}

              {/* TAB 3: EFICIENCIA (Costos unitarios) */}
              {activeTab === 'efficiency' && (
                <>
                  <Line yAxisId="left" type="monotone" dataKey="cpm" name="CPM" stroke="#F59E0B" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#F59E0B', strokeWidth: 0 }} />
                  <Line yAxisId="left" type="monotone" dataKey="cpc" name="CPC" stroke="#10B981" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#10B981', strokeWidth: 0 }} />
                </>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
