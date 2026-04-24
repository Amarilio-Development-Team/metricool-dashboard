'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip as RechartsTooltip, YAxis } from 'recharts';
import { AgeGenderData } from '@/features/analytics/platforms/instagram/repository';

interface Props {
  data: AgeGenderData;
}

export const AgeGenderVisuals = ({ data }: Props) => {
  return (
    <div className="grid grid-cols-1 divide-y divide-gray-100 dark:divide-gray-800 lg:grid-cols-2 lg:divide-x lg:divide-y-0">
      {/* Column 1: Gender */}
      <div className="flex flex-col items-center justify-center p-6">
        <h4 className="text-default mb-4 text-sm font-semibold">Distribución por Género</h4>

        <div className="relative h-[180px] w-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.gender} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {data.gender.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>

              <RechartsTooltip
                separator=""
                wrapperStyle={{ zIndex: 1000 }}
                formatter={(value: number | string | Array<number | string> | undefined) => {
                  if (typeof value === 'number') return [`${value.toFixed(1)}%`, ''];
                  return [value ?? '', ''];
                }}
                contentStyle={{
                  borderRadius: '8px',
                  border: 'none',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  backgroundColor: '#fff',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lower text-xs">Mayoría</span>
            <span className="text-strong text-xl font-bold">{data.gender.length > 0 ? data.gender.sort((a, b) => b.value - a.value)[0].name : '-'}</span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {data.gender.map(item => (
            <div key={item.name} className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-medium text-sm">
                {item.name} <span className="text-strong font-bold">({item.value.toFixed(1)}%)</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Column 2: Age */}
      <div className="flex flex-col p-6">
        <h4 className="text-default mb-6 text-center text-sm font-semibold">Rango de Edad</h4>

        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.age} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
              <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#6B7280' }} tickFormatter={val => `${val}%`} />
              <RechartsTooltip
                cursor={{ fill: '#F3F4F6' }}
                formatter={(value: number | string | Array<number | string> | undefined) => {
                  if (typeof value === 'number') return [`${value.toFixed(1)}%`, 'Usuarios'];
                  return [value ?? '', 'Usuarios'];
                }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} barSize={30} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
