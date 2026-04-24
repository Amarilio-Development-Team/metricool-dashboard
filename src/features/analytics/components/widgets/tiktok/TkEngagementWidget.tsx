import { Activity } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkEngagementRepo } from '@/features/analytics/platforms/tiktok/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkEngagementWidget = async ({ from, to, className, valueClassName }: Props) => {
  const duration = to.getTime() - from.getTime();
  const previousTo = new Date(from.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - duration);

  const [currentValue, previousValue] = await Promise.all([getTkEngagementRepo(from, to), getTkEngagementRepo(previousFrom, previousTo)]);

  const trend = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue) * 100;

  return <StatCard title="Engagement" value={currentValue} previousValue={previousValue} trendPercentage={trend} icon={Activity} className={className} valueClassName={valueClassName} />;
};
