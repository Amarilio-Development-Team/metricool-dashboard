import { Radio } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getIgReachRepo } from '@/features/analytics/platforms/instagram/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const IgReachWidget = async ({ from, to, className, valueClassName }: Props) => {
  const { value, previousValue } = await getIgReachRepo(from, to);

  const trend = previousValue === 0 ? 0 : ((value - previousValue) / previousValue) * 100;

  return <StatCard title="Alcance total" value={value} previousValue={previousValue} trendPercentage={trend} icon={Radio} className={className} valueClassName={valueClassName} />;
};
