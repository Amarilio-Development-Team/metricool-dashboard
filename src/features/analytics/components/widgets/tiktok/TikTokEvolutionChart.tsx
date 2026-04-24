'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { TkEvolutionData } from '@/features/analytics/platforms/tiktok/adapter';

interface Props {
  data: TkEvolutionData[];
}

export const TikTokEvolutionChart = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'views'>('followers');

  const formatDate = (value: unknown) => {
    if (!value) return '';
    const date = new Date(value as string | number | Date);
    return isNaN(date.getTime()) ? '' : format(date, 'd MMM', { locale: es });
  };

  const formatYAxis = (value: number) => {
    return new Intl.NumberFormat('es-MX', { notation: 'compact', compactDisplay: 'short' }).format(value);
  };

  const formatTooltipValue = (value: number | string | Array<number | string> | undefined) => {
    if (typeof value === 'number') {
      return [new Intl.NumberFormat('es-MX').format(value)];
    }
    return [value ?? '', ''];
  };

  return (
    <div className="main-container-color border-primary rounded-xl border p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-strong text-lg font-bold sm:text-xl">Comunidad</h3>
          <p className="text-low text-xs font-medium sm:text-sm">Crecimiento de audiencia y alcance</p>
        </div>

        {/* Tabs */}
        <div className="container-color flex overflow-x-auto rounded-lg">
          <button
            onClick={() => setActiveTab('followers')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'followers' ? 'bg-primary font-semibold text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'
            }`}
          >
            Seguidores
          </button>
          <button
            onClick={() => setActiveTab('views')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              activeTab === 'views' ? 'bg-primary font-semibold text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'
            }`}
          >
            Visualizaciones
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className="h-[300px] w-full min-w-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorPinkTk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#FE2C55" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#FE2C55" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorVioletTk" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

              <XAxis dataKey="date" tickFormatter={formatDate} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} minTickGap={30} />

              <YAxis width={45} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={formatYAxis} />

              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} labelFormatter={formatDate} formatter={formatTooltipValue} />

              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                formatter={value => {
                  return <span className="text-strong ml-1 text-sm font-medium">{value}</span>;
                }}
              />

              {/* Tab seguidores */}
              {activeTab === 'followers' && (
                <Area
                  type="monotone"
                  dataKey="followers"
                  name="Seguidores Totales"
                  stroke="#FE2C55"
                  fillOpacity={1}
                  fill="url(#colorPinkTk)"
                  strokeWidth={3}
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#FE2C55' }}
                />
              )}

              {/* Tab visualizaciones */}
              {activeTab === 'views' && (
                <Area
                  type="monotone"
                  dataKey="videoViews"
                  name="Visualizaciones de Video"
                  stroke="#8B5CF6"
                  fillOpacity={1}
                  fill="url(#colorVioletTk)"
                  strokeWidth={3}
                  activeDot={{ r: 6, fill: '#8B5CF6', strokeWidth: 0 }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
