'use client';

import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { IgEvolutionData } from '@/features/analytics/platforms/instagram/repository';

interface Props {
  data: IgEvolutionData[];
}

export const InstagramEvolutionChart = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState<'audience' | 'reach'>('audience');

  const formatDate = (value: unknown): string => {
    if (!value) return '';
    const date = new Date(value as string | number | Date);
    return isNaN(date.getTime()) ? '' : format(date, 'd MMM', { locale: es });
  };

  const formatYAxis = (value: number) => value.toLocaleString('es-MX');

  const formatTooltipValue = (value: number | string | Array<number | string> | undefined) => {
    if (typeof value === 'number') {
      return [value.toLocaleString('es-MX')];
    }
    return [value ?? '', ''];
  };

  return (
    <div className="main-container-color border-primary rounded-xl border p-6 shadow-sm">
      {/* Header */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-strong text-lg font-bold">Evolución de Instagram</h3>
          <p className="text-muted-foreground text-sm">Crecimiento y alcance diario</p>
        </div>

        {/* Tabs */}
        <div className="container-color flex rounded-lg">
          <button
            onClick={() => setActiveTab('audience')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${activeTab === 'audience' ? 'bg-primary font-semibold text-gray-900 shadow-sm' : 'text-strong'}`}
          >
            Audiencia
          </button>
          <button
            onClick={() => setActiveTab('reach')}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${activeTab === 'reach' ? 'bg-primary text-gray-900 shadow-sm' : 'text-strong'}`}
          >
            Alcance e Impacto
          </button>
        </div>
      </div>

      {/* Chart con Scroll Horizontal en Mobile */}
      <div className="w-full overflow-x-auto pb-2">
        <div className="h-[300px] w-full min-w-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                {/* Pink Gradient (Audience) */}
                <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EC4899" stopOpacity={0} />
                </linearGradient>

                {/* Purple Gradient (Reach) */}
                <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                </linearGradient>

                {/* Orange Gradient (Impressions) */}
                <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />

              <XAxis dataKey="date" tickFormatter={formatDate} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />

              <YAxis width={50} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={formatYAxis} />

              <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} labelFormatter={formatDate} formatter={formatTooltipValue} />

              <Legend verticalAlign="top" height={36} iconType="circle" />

              {/* Tab audience (Only Followers) */}
              {activeTab === 'audience' && <Area type="monotone" dataKey="followers" name="Seguidores Totales" stroke="#EC4899" fillOpacity={1} fill="url(#colorPink)" strokeWidth={3} />}

              {/* Tab reach (Impressions + Reach + Profile Views) */}
              {activeTab === 'reach' && (
                <>
                  <Area type="monotone" dataKey="impressions" name="Visualizaciones" stroke="#F97316" fillOpacity={1} fill="url(#colorOrange)" strokeWidth={2} />
                  <Area type="monotone" dataKey="reach" name="Alcance" stroke="#8B5CF6" fillOpacity={1} fill="url(#colorPurple)" strokeWidth={2} />
                  <Area type="monotone" dataKey="profileViews" name="Visitas Perfil" stroke="#10B981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
                </>
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
