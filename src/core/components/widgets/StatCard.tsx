import React, { useId } from 'react';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: number;
  previousValue: number;
  trendPercentage: number;
  className?: string;
  valueClassName?: string;
  icon?: React.ElementType;
}

const TREND_VARIANTS = {
  positive: { color: 'text-emerald-600 bg-emerald-50 border-emerald-100', Icon: TrendingUp, sign: '+' },
  negative: { color: 'text-rose-600 bg-rose-50 border-rose-100', Icon: TrendingDown, sign: '' },
  neutral: { color: 'text-gray-500 bg-gray-100 border-gray-100', Icon: Minus, sign: '' },
};

export const StatCard = ({ title, value, previousValue, trendPercentage, className = '', valueClassName, icon: Icon = Activity }: StatCardProps) => {
  const uniqueId = useId();
  const difference = value - previousValue;

  const formatter = new Intl.NumberFormat('es-MX', {
    maximumFractionDigits: 1,
    notation: value > 1000000 ? 'compact' : 'standard',
  });

  const variant = difference === 0 ? 'neutral' : difference > 0 ? 'positive' : 'negative';
  const { color: trendColor, Icon: TrendIcon, sign } = TREND_VARIANTS[variant];

  const valueSizeClass = valueClassName || 'text-3xl mblg:text-4xl';

  return (
    <article
      aria-labelledby={uniqueId}
      className={`group main-container-color border-primary relative flex flex-col justify-between overflow-hidden rounded-2xl border p-6 shadow-md transition-all hover:scale-[0.98] hover:shadow-lg ${className}`}
    >
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div aria-hidden="true" className={`flex h-10 w-10 items-center justify-center rounded-full ${variant === 'positive' ? 'bg-green-100 text-green-700' : 'text-medium container-color'}`}>
            <Icon className="h-5 w-5" />
          </div>
          <h3 id={uniqueId} className="text-lower text-sm font-semibold uppercase tracking-wide">
            {title}
          </h3>
        </div>
        <div role="status" className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${trendColor}`}>
          <TrendIcon className="h-3 w-3" aria-hidden="true" />
          <span aria-hidden="true">{variant === 'neutral' ? '0%' : `${Math.abs(trendPercentage).toFixed(1)}%`}</span>
        </div>
      </header>

      <div className="mb-2">
        <data value={value} className={`text-strong font-bold tracking-tight ${valueSizeClass}`}>
          {title.includes('CPC') || title.includes('Gastado') || title.includes('Gasto') || title.includes('CPM')
            ? `$${formatter.format(value)}`
            : title.includes('CTR') || title.includes('Click-Through Rate')
              ? `${formatter.format(value)}%`
              : formatter.format(value)}
        </data>
      </div>

      <footer className="flex items-center gap-2 text-xs font-medium">
        <span className={`${variant === 'positive' ? 'text-emerald-600' : variant === 'negative' ? 'text-rose-600' : 'text-gray-400'}`}>
          {sign}
          {formatter.format(difference)}
        </span>
        <span className="text-placeholder truncate">vs periodo anterior ({formatter.format(previousValue)})</span>
      </footer>
    </article>
  );
};
