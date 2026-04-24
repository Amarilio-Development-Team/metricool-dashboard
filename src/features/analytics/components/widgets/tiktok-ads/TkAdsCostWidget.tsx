import { DollarSign } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkAdsOverviewRepo } from '@/features/analytics/platforms/tiktok-ads/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkAdsCostWidget = async ({ from, to, className, valueClassName }: Props) => {
  const data = await getTkAdsOverviewRepo(from, to);

  const currentCost = data.cost.value;
  const trend = data.cost.trend;

  const previousCost = trend === 100 && currentCost > 0 ? 0 : currentCost / (1 + trend / 100);

  return <StatCard title="Gasto Total" value={currentCost} previousValue={previousCost} trendPercentage={trend} icon={DollarSign} className={className} valueClassName={valueClassName} />;
};
