import { Play } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkVideoViewsRepo } from '@/features/analytics/platforms/tiktok/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkVideoViewsWidget = async ({ from, to, className, valueClassName }: Props) => {
  const duration = to.getTime() - from.getTime();
  const previousTo = new Date(from.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - duration);

  const [currentValue, previousValue] = await Promise.all([getTkVideoViewsRepo(from, to), getTkVideoViewsRepo(previousFrom, previousTo)]);

  const trend = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue) * 100;

  return <StatCard title="Visualizaciones" value={currentValue} previousValue={previousValue} trendPercentage={trend} icon={Play} className={className} valueClassName={valueClassName} />;
};
