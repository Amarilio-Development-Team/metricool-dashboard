'use client';

import { useState, ReactNode } from 'react';
import { ArrowUpRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FacebookChartData } from '@/features/analytics/platforms/facebook/adapter';

export interface BreakdownItem {
  label: string;
  value: number;
  icon: ReactNode;
}

export interface ContentWidgetProps {
  title: string;
  subtitle: string;
  icon: ReactNode;
  colorTheme: 'orange' | 'pink' | 'blue' | 'purple';
  kpis: {
    label: string;
    value: string | number;
    trend?: number;
  }[];
  chartData: FacebookChartData[];
  breakdown: BreakdownItem[];
  insight?: string;
}

const themeStyles = {
  orange: {
    bgIcon: 'bg-orange-100',
    textIcon: 'text-orange-600',
    textDark: 'text-orange-900',
    bgInsight: 'bg-orange-50',
    borderInsight: 'border-orange-100',
    stroke: '#ea580c',
    fill: '#fff7ed',
    gradientId: 'gradient-orange',
  },
  pink: {
    bgIcon: 'bg-pink-100',
    textIcon: 'text-pink-600',
    textDark: 'text-pink-900',
    bgInsight: 'bg-pink-50',
    borderInsight: 'border-pink-100',
    stroke: '#db2777',
    fill: '#fdf2f8',
    gradientId: 'gradient-pink',
  },
  blue: {
    bgIcon: 'bg-blue-100',
    textIcon: 'text-blue-600',
    textDark: 'text-blue-900',
    bgInsight: 'bg-blue-50',
    borderInsight: 'border-blue-100',
    stroke: '#2563eb',
    fill: '#eff6ff',
    gradientId: 'gradient-blue',
  },
  purple: {
    bgIcon: 'bg-purple-100',
    textIcon: 'text-purple-600',
    textDark: 'text-purple-900',
    bgInsight: 'bg-purple-50',
    borderInsight: 'border-purple-100',
    stroke: '#9333ea',
    fill: '#faf5ff',
    gradientId: 'gradient-purple',
  },
};

const CHART_TABS = [
  { id: 'impressions', label: 'Visualizaciones', dataKey: 'impressions' },
  { id: 'interactions', label: 'Interacciones', dataKey: 'interactions' },
];

export const ContentPerformanceWidget = ({ title, subtitle, icon, colorTheme, kpis, chartData, breakdown, insight }: ContentWidgetProps) => {
  const theme = themeStyles[colorTheme] || themeStyles.orange;
  const [activeTabId, setActiveTabId] = useState('impressions');
  const activeTab = CHART_TABS.find(t => t.id === activeTabId) || CHART_TABS[0];

  const formatDate = (value: unknown) => {
    if (!value) return '';
    try {
      return format(new Date(value as string), 'd MMM', { locale: es });
    } catch {
      return String(value);
    }
  };

  const renderTrend = (trend?: number) => {
    if (trend === undefined) return null;
    const isPositive = trend > 0;
    const colorClass = isPositive ? 'bg-green-100 text-green-700' : trend < 0 ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600';
    const Icon = isPositive ? TrendingUp : trend < 0 ? TrendingDown : Minus;
    return (
      <div className={`mt-1 flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-bold ${colorClass}`}>
        <Icon size={12} />
        <span>{Math.abs(trend).toFixed(1)}%</span>
      </div>
    );
  };

  return (
    <div className="main-container-color border-primary flex w-full flex-col rounded-2xl border p-4 shadow-sm transition-shadow hover:shadow-md sm:p-6">
      {/* Header */}
      <div className="border-primary mb-6 flex flex-col gap-6 border-b pb-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4 sm:items-center">
          <div className={`shrink-0 rounded-xl p-3 ${theme.bgIcon} ${theme.textIcon}`}>{icon}</div>
          <div>
            <h3 className="text-strong text-lg font-bold sm:text-xl">{title}</h3>
            <p className="text-low text-xs font-medium sm:text-sm">{subtitle}</p>
          </div>
        </div>

        {/* KPIs */}
        <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0 lg:pb-0">
          {kpis.map((kpi, idx) => (
            <div key={idx} className="border-primary flex min-w-[120px] shrink-0 flex-col justify-center border-l px-4 first:border-0 lg:first:border-l">
              <p className="text-placeholder mb-1 text-[10px] font-bold uppercase tracking-wider">{kpi.label}</p>
              <div className="flex flex-col items-start">
                <p className={`text-xl font-bold ${idx === kpis.length - 1 ? theme.textIcon : 'text-default'}`}>{kpi.value}</p>
                {renderTrend(kpi.trend)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Chart Section */}
        <div className="flex flex-col md:col-span-2 lg:col-span-2">
          {/* Chart Header */}
          <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="text-default font-semibold">Tendencia de Actividad</h4>

            {/* Tabs Selector */}
            <div className="container-color flex w-fit rounded-lg">
              {CHART_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabId(tab.id)}
                  className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                    activeTabId === tab.id ? 'bg-primary font-semibold text-gray-900 shadow-sm' : 'text-strong hover:bg-primary/40'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Area Chart */}
          <div className="border-primary w-full overflow-hidden rounded-xl border p-2">
            <div className="w-full overflow-x-auto pb-2">
              <div className="relative h-[280px] min-w-[600px] lg:min-w-0">
                {chartData && chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id={theme.gradientId} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={theme.stroke} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={theme.stroke} stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3 3" vertical={false} stroke="#e5e7eb" />
                      <XAxis dataKey="date" tickFormatter={formatDate} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#9ca3af' }} dy={10} minTickGap={30} />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 11, fill: '#9ca3af' }}
                        tickFormatter={val => (val >= 1000 ? (val % 1000 === 0 ? `${val / 1000}k` : `${(val / 1000).toFixed(1)}k`) : val)}
                      />

                      <Tooltip
                        labelFormatter={formatDate}
                        formatter={(value: number | string | Array<number | string> | undefined) => {
                          const val = Number(value);
                          const finalValue = !isNaN(val) ? val : 0;

                          return [finalValue.toLocaleString('es-MX'), activeTab.label];
                        }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        itemStyle={{ color: theme.stroke, fontWeight: 'bold' }}
                      />

                      <Area
                        key={activeTabId}
                        type="monotone"
                        dataKey={activeTab.dataKey}
                        stroke={theme.stroke}
                        strokeWidth={3}
                        fillOpacity={1}
                        fill={`url(#${theme.gradientId})`}
                        activeDot={{ r: 6, strokeWidth: 0, fill: theme.stroke }}
                        animationDuration={800}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="text-placeholder flex h-full w-full items-center justify-center text-sm">No hay datos disponibles</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="flex flex-col justify-start pt-2 md:col-span-2 lg:col-span-1 lg:justify-center lg:pt-0">
          <h4 className="text-default mb-4 font-semibold">Detalle de Interacciones</h4>
          <div className="space-y-3">
            {breakdown.map((item, idx) => (
              <div key={idx} className="group flex items-center justify-between rounded-lg border border-transparent p-2 transition-all hover:container-color hover:shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`container-color rounded-md p-2 transition-colors group-hover:main-container-color group-hover:shadow-sm ${theme.textIcon}`}>{item.icon}</div>
                  <span className="text-low text-sm font-medium">{item.label}</span>
                </div>
                <span className="text-medium font-bold">{item.value.toLocaleString('es-MX')}</span>
              </div>
            ))}
          </div>

          {insight && (
            <div className={`mt-6 rounded-lg border p-4 ${theme.bgInsight} ${theme.borderInsight}`}>
              <div className="mb-1 flex items-center gap-2">
                <ArrowUpRight size={14} className={theme.textIcon} />
                <p className={`text-xs font-bold uppercase ${theme.textDark}`}>Insight</p>
              </div>
              <p className={`text-xs font-medium ${theme.textIcon} leading-relaxed opacity-90`}>{insight}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
