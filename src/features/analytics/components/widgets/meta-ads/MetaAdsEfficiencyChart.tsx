'use client';

import { useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EfficiencyChartData {
  date: string;
  fullDate: string;
  spend: number;
  cpm: number;
  cpc: number;
  ctr: number;
}

interface PayloadEntry {
  value: number | string;
  name: string;
  color: string;
  dataKey: string;
  payload: EfficiencyChartData;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: PayloadEntry[];
  label?: string;
}

interface Props {
  data: EfficiencyChartData[];
}

const TABS = [
  { id: 'cpm', label: 'CPM', metric: 'cpm', color: '#f59e0b', labelMetric: 'CPM', isCurrency: true },
  { id: 'cpc', label: 'CPC', metric: 'cpc', color: '#10b981', labelMetric: 'CPC', isCurrency: true },
  { id: 'ctr', label: 'CTR', metric: 'ctr', color: '#ec4899', labelMetric: 'CTR', isCurrency: false },
];

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length > 0) {
    const data = payload[0].payload;
    const formatCurr = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);

    return (
      <div className="rounded-lg border border-gray-100 bg-white p-3 shadow-lg">
        <p className="mb-2 text-xs font-semibold uppercase text-gray-500">{data.fullDate}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm">
            <div className="h-2 w-2 rounded-full bg-amber-400" />
            <span className="text-gray-600">Inversión:</span>
            <span className="font-bold text-gray-900">{formatCurr(data.spend)}</span>
          </div>
          {payload.map(entry => {
            if (entry.dataKey === 'spend') return null;
            const isPct = entry.dataKey === 'ctr';
            const numericValue = Number(entry.value);

            return (
              <div key={entry.dataKey} className="flex items-center gap-2 text-sm">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                <span className="capitalize text-gray-600">{entry.name}:</span>
                <span className="font-bold text-gray-900">{isPct ? `${numericValue.toFixed(2)}%` : formatCurr(numericValue)}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  return null;
};

export const MetaAdsEfficiencyChart = ({ data }: Props) => {
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <div className="main-container-color border-primary flex h-full flex-col rounded-2xl border p-6 shadow-md">
      <div className="mb-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-strong text-lg font-bold">Rendimiento de Inversión</h3>
          <p className="text-low text-sm">Analiza el costo y efectividad de tus anuncios.</p>
        </div>
        <div className="container-color flex rounded-lg p-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${activeTab.id === tab.id ? 'bg-primary text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="min-h-[300px] w-full min-w-[600px] flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
            <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
            <YAxis yAxisId="left" axisLine={false} tickLine={false} width={45} tick={{ fill: '#9ca3af', fontSize: 12 }} tickFormatter={v => (activeTab.id === 'ctr' ? `${v}%` : `$${v}`)} />
            <YAxis yAxisId="right" orientation="right" hide />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f9fafb' }} />
            <Bar yAxisId="right" dataKey="spend" fill="#fbbf24" radius={[4, 4, 0, 0]} barSize={20} fillOpacity={0.4} />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey={activeTab.metric}
              name={activeTab.labelMetric}
              stroke={activeTab.color}
              strokeWidth={3}
              dot={{ r: 4, fill: activeTab.color, strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
