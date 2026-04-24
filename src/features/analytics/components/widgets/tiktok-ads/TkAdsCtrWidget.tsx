import { Percent } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkAdsOverviewRepo } from '@/features/analytics/platforms/tiktok-ads/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkAdsCtrWidget = async ({ from, to, className, valueClassName }: Props) => {
  const data = await getTkAdsOverviewRepo(from, to);
  const current = data.ctr.value;
  const trend = data.ctr.trend;
  const previous = trend === 100 && current > 0 ? 0 : current / (1 + trend / 100);

  return <StatCard title="CTR (Click-Through Rate)" value={current} previousValue={previous} trendPercentage={trend} icon={Percent} className={className} valueClassName={valueClassName} />;
};
