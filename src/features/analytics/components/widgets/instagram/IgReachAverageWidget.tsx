import { Eye } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getIgReachAverageRepo } from '@/features/analytics/platforms/instagram/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const IgReachAverageWidget = async ({ from, to, className, valueClassName }: Props) => {
  const { value, previousValue } = await getIgReachAverageRepo(from, to);

  const trend = previousValue === 0 ? 0 : ((value - previousValue) / previousValue) * 100;

  return <StatCard title="Visualizaciones en este periodo" value={value} previousValue={previousValue} trendPercentage={trend} icon={Eye} className={className} valueClassName={valueClassName} />;
};
