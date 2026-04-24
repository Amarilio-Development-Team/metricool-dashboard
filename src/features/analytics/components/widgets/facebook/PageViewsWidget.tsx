import { MousePointerClick } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getFacebookPageViewsRepo } from '@/features/analytics/platforms/facebook/repository';
import { calculateTrend } from '@/features/analytics/platforms/facebook/adapter';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const PageViewsWidget = async ({ from, to, className, valueClassName }: Props) => {
  const rawData = await getFacebookPageViewsRepo(from, to);
  const data = calculateTrend(rawData.value, rawData.previousValue);

  return (
    <StatCard
      title="Visitas a página"
      icon={MousePointerClick}
      value={rawData.value}
      previousValue={rawData.previousValue}
      trendPercentage={data}
      className={className}
      valueClassName={valueClassName}
    />
  );
};
