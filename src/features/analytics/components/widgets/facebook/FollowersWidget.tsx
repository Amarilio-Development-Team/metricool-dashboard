import { Users } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getFacebookFollowersRepo } from '@/features/analytics/platforms/facebook/repository';
import { calculateTrend } from '@/features/analytics/platforms/facebook/adapter';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const FollowersWidget = async ({ from, to, className, valueClassName }: Props) => {
  const data = await getFacebookFollowersRepo(from, to);
  const trend = calculateTrend(data.value, data.previousValue);

  return <StatCard title="Seguidores" icon={Users} value={data.value} previousValue={data.previousValue} trendPercentage={trend} className={className} valueClassName={valueClassName} />;
};
