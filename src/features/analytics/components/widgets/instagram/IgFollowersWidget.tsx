import { Users } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getIgFollowersRepo } from '@/features/analytics/platforms/instagram/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const IgFollowersWidget = async ({ from, to, className, valueClassName }: Props) => {
  const { value, previousValue } = await getIgFollowersRepo(from, to);

  const trend = previousValue === 0 ? 0 : ((value - previousValue) / previousValue) * 100;

  return <StatCard title="Seguidores" value={value} previousValue={previousValue} trendPercentage={trend} icon={Users} className={className} valueClassName={valueClassName} />;
};
