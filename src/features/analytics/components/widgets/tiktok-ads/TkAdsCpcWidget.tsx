import { CreditCard } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkAdsOverviewRepo } from '@/features/analytics/platforms/tiktok-ads/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkAdsCpcWidget = async ({ from, to, className, valueClassName }: Props) => {
  const data = await getTkAdsOverviewRepo(from, to);
  const current = data.cpc.value;
  const trend = data.cpc.trend;
  const previous = trend === 100 && current > 0 ? 0 : current / (1 + trend / 100);

  return <StatCard title="CPC (Costo por Clic)" value={current} previousValue={previous} trendPercentage={trend} icon={CreditCard} className={className} valueClassName={valueClassName} />;
};
