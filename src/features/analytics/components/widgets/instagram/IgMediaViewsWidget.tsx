import { Play } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getIgMediaViewsRepo } from '@/features/analytics/platforms/instagram/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const IgMediaViewsWidget = async ({ from, to, className, valueClassName }: Props) => {
  const { value, previousValue } = await getIgMediaViewsRepo(from, to);
  const trend = previousValue === 0 ? 0 : ((value - previousValue) / previousValue) * 100;

  return <StatCard title="Visualizaciones totales" value={value} previousValue={previousValue} trendPercentage={trend} icon={Play} className={className} valueClassName={valueClassName} />;
};
