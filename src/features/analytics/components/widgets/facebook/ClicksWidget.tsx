import { MousePointer2 } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getFacebookClicksRepo } from '@/features/analytics/platforms/facebook/repository';
import { calculateTrend } from '@/features/analytics/platforms/facebook/adapter';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const ClicksWidget = async ({ from, to, className, valueClassName }: Props) => {
  const rawData = await getFacebookClicksRepo(from, to);
  const data = calculateTrend(rawData.value, rawData.previousValue);

  return (
    <StatCard title="Clics Totales" icon={MousePointer2} value={rawData.value} previousValue={rawData.previousValue} trendPercentage={data} className={className} valueClassName={valueClassName} />
  );
};
