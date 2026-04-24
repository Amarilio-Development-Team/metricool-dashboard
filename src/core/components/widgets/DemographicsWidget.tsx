'use client';

import { useMemo } from 'react';
import { LucideIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Image from 'next/image';
import { CountryName } from '@/features/analytics/components/CountryName';

export interface DemographicItem {
  name: string;
  value: number;
  code?: string;
  color?: string;
}

interface ChartConfig {
  title: string;
  icon: LucideIcon;
  data: DemographicItem[];
  emptyMessage?: string;
  type?: 'standard' | 'gender';
}

interface Props {
  title?: string;
  subtitle?: string;
  leftSection: ChartConfig;
  rightSection: ChartConfig;
  className?: string;
}

const DEFAULT_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#64748B'];

export const DemographicsWidget = ({ title = 'Demografía de la Audiencia', subtitle, leftSection, rightSection, className }: Props) => {
  return (
    <div className={`main-container-color border-primary flex flex-col rounded-xl border shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-primary border-b px-6 py-4">
        <h3 className="text-default text-lg font-semibold">{title}</h3>
        {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
      </div>

      {/* Body */}
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="border-primary border-b p-6 lg:border-b-0 lg:border-r">
          <ChartSection config={leftSection} />
        </div>

        <div className="p-6">
          <ChartSection config={rightSection} />
        </div>
      </div>
    </div>
  );
};

const ChartSection = ({ config }: { config: ChartConfig }) => {
  const { title, icon: Icon, data, emptyMessage = 'No hay datos disponibles' } = config;

  const processedData = useMemo(() => {
    if (!data || data.length === 0) return [];
    //! We sort the data in descending order and take the top 5
    return [...data].sort((a, b) => b.value - a.value).slice(0, 5);
  }, [data]);

  if (processedData.length === 0) {
    return (
      <div className="text-placeholder flex h-40 flex-col items-center justify-center gap-2">
        <Icon size={24} className="opacity-20" />
        <span className="text-sm">{emptyMessage}</span>
      </div>
    );
  }

  const topValue = processedData[0].value;

  return (
    <div className="flex flex-col gap-6">
      {/* Title */}
      <div className="flex items-center gap-2">
        <div className="text-placeholder container-color rounded-md p-1.5">
          <Icon size={16} />
        </div>
        <span className="text-medium font-semibold">{title}</span>
      </div>

      <div className="flex flex-col items-center gap-6 xl:flex-row">
        {/* Donut Chart */}
        <div className="relative h-[160px] w-[160px] min-w-[160px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={processedData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                {processedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                wrapperStyle={{ zIndex: 1000 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="container-color border-primary rounded-lg border p-2 text-xs font-medium shadow-lg">
                        {data.name}: <span className="font-bold">{data.value.toFixed(1)}%</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Donut Center */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lower text-[10px] font-bold uppercase tracking-widest">Top 1</span>
            <span className="text-medium text-xl font-bold">{topValue.toFixed(0)}%</span>
          </div>
        </div>

        {/* Legend / List */}
        <div className="flex w-full flex-col gap-2.5">
          {processedData.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <div className="h-2.5 w-2.5 flex-shrink-0 rounded-full" style={{ backgroundColor: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length] }} />

                {/* Flag (if code exists) */}
                {item.code && (
                  <div className="relative h-3 w-4 flex-shrink-0 overflow-hidden rounded-[2px] shadow-sm">
                    <Image src={`https://flagcdn.com/w20/${item.code.toLowerCase()}.png`} alt={item.name} fill className="object-cover" />
                  </div>
                )}

                {/* Name */}
                <span className="text-medium truncate" title={item.name}>
                  {item.code ? <CountryName code={item.code} fallback={item.name} /> : item.name}
                </span>
              </div>

              {/* Value */}
              <span className="text-strong font-semibold">{item.value.toFixed(1)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
