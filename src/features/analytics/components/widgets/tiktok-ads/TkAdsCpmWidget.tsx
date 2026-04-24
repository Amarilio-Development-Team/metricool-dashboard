import { Activity } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkAdsOverviewRepo } from '@/features/analytics/platforms/tiktok-ads/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkAdsCpmWidget = async ({ from, to, className, valueClassName }: Props) => {
  const data = await getTkAdsOverviewRepo(from, to);
  const current = data.cpm.value;
  const trend = data.cpm.trend;
  const previous = trend === 100 && current > 0 ? 0 : current / (1 + trend / 100);

  return <StatCard title="CPM (Costo por Mil)" value={current} previousValue={previous} trendPercentage={trend} icon={Activity} className={className} valueClassName={valueClassName} />;
};
