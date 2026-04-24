import { Eye } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getFacebookMediaViewsRepo } from '@/features/analytics/platforms/facebook/repository';
import { calculateTrend } from '@/features/analytics/platforms/facebook/adapter';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const MediaViewsWidget = async ({ from, to, className, valueClassName }: Props) => {
  const rawData = await getFacebookMediaViewsRepo(from, to);
  const data = calculateTrend(rawData.value, rawData.previousValue);

  return (
    <StatCard title="Visualizaciones totales" icon={Eye} value={rawData.value} previousValue={rawData.previousValue} trendPercentage={data} className={className} valueClassName={valueClassName} />
  );
};
