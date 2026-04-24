'use client';

import { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  date: string;
  fullDate: string;
  spend: number;
  impressions: number;
  clicks: number;
}

interface PayloadEntry {
  value: number | string;
  name: string;
  color: string;
  dataKey: string;
  payload: ChartData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string;
}

interface Props {
  data: ChartData[];
}

const TABS = [
  {
    id: 'visibility',
    label: 'Visibilidad',
    metric: 'impressions',
    color: '#8b5cf6',
    labelMetric: 'Impresiones',
  },
  {
    id: 'interaction',
    label: 'Interacción',
    metric: 'clicks',
    color: '#10b981',
    labelMetric: 'Clics',
  },
];

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;

    return (
      <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-lg">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-500">{data.fullDate}</p>

        <div className="flex flex-col gap-1">
          {/* Spend */}
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-gray-600">Inversión:</span>
            <span className="font-bold text-gray-900">${data.spend.toLocaleString('es-MX')}</span>
          </div>

          {/* Metric */}
          {payload.map(entry => {
            if (entry.dataKey === 'spend') return null;

            return (
              <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="capitalize text-gray-600">{entry.name}:</span>
                <span className="font-bold text-gray-900">{Number(entry.value).toLocaleString('es-MX')}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const MetaAdsEvolutionChart = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="border-primart main-container-color rounded-2xl p-6 shadow-md">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Evolución Diaria</h3>
          <p className="text-sm text-gray-500">Compara tu inversión con los resultados obtenidos.</p>
        </div>

        <div className="container-color flex rounded-lg p-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${activeTab.id === tab.id ? 'bg-primary text-gray-900 shadow-sm' : 'text-strong'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full overflow-x-auto pb-2">
        <div className="h-[350px] w-full min-w-[600px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />

              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />

              <YAxis
                yAxisId="left"
                orientation="left"
                axisLine={false}
                tickLine={false}
                width={45}
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickFormatter={value => (value >= 1000 ? `${(value / 1000).toFixed(1)}k` : value)}
              />

              <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} hide={true} />

              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />

              <Bar yAxisId="right" dataKey="spend" name="Inversión" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.4} />

              <Line
                yAxisId="left"
                type="monotone"
                dataKey={activeTab.metric}
                name={activeTab.labelMetric}
                stroke={activeTab.color}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: activeTab.color,
                  strokeWidth: 2,
                  stroke: '#fff',
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1000}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
