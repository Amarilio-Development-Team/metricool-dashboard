'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FacebookEvolutionData } from '@/features/analytics/platforms/facebook/adapter';

interface EvolutionChartProps {
  data: FacebookEvolutionData[];
}

export const EvolutionChart = ({ data }: EvolutionChartProps) => {
  const [activeTab, setActiveTab] = useState<'visibility' | 'activity' | 'community'>('visibility');

  const formatDate = (value: unknown): string => {
    if (!value) return '';
    const date = new Date(value as string | number | Date);
    return isNaN(date.getTime()) ? '' : format(date, 'd MMM', { locale: es });
  };

  return (
    <div className="main-container-color border-primary rounded-xl border p-6 shadow-sm">
      {/* Header and tabs */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-default text-lg font-semibold">Actividad diaria</h3>
          <p className="text-muted-foreground text-sm">Comparativa de rendimiento diario</p>
        </div>

        {/* Navigation tabs */}
        <div className="container-color flex overflow-x-auto rounded-lg">
          <button
            onClick={() => setActiveTab('visibility')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold transition-all ${activeTab === 'visibility' ? 'bg-primary text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'}`}
          >
            Visibilidad
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold transition-all ${activeTab === 'activity' ? 'bg-primary text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'}`}
          >
            Actividad
          </button>
          <button
            onClick={() => setActiveTab('community')}
            className={`whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-bold transition-all ${activeTab === 'community' ? 'bg-primary text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'}`}
          >
            Comunidad
          </button>
        </div>
      </div>

      {/* Graph area */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="h-[300px] w-full min-w-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {/* Visibility gradients */}
                <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorSecond" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>

                <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="date" tickFormatter={formatDate} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} labelFormatter={formatDate} />
              <Legend verticalAlign="top" height={36} iconType="circle" />

              {activeTab === 'visibility' && (
                <>
                  <Area type="monotone" dataKey="mediaViews" name="Visualizaciones" stroke="#8884d8" fillOpacity={1} fill="url(#colorMain)" strokeWidth={2} />
                  <Area type="monotone" dataKey="impressions" name="Impresiones" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSecond)" strokeWidth={2} />
                </>
              )}

              {activeTab === 'activity' && (
                <>
                  <Area type="monotone" dataKey="interactions" name="Interacciones Totales" stroke="#F59E0B" fillOpacity={0.1} fill="#F59E0B" strokeWidth={2} strokeDasharray="5 5" />
                  <Area type="monotone" dataKey="clicks" name="Clics" stroke="#EC4899" fillOpacity={0.2} fill="#EC4899" strokeWidth={2} />
                  <Area type="monotone" dataKey="reactions" name="Reacciones" stroke="#3B82F6" fillOpacity={0.2} fill="url(#colorBlue)" strokeWidth={2} />
                </>
              )}

              {activeTab === 'community' && (
                <>
                  <Area type="monotone" dataKey="follows" name="Nuevos Seguidores" stroke="#22C55E" fillOpacity={1} fill="url(#colorGreen)" strokeWidth={2} />
                  <Area type="monotone" dataKey="unfollows" name="Seguidores Perdidos" stroke="#EF4444" fillOpacity={1} fill="url(#colorRed)" strokeWidth={2} />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
