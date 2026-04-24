import { MousePointerClick } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkAdsOverviewRepo } from '@/features/analytics/platforms/tiktok-ads/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkAdsClicksWidget = async ({ from, to, className, valueClassName }: Props) => {
  const data = await getTkAdsOverviewRepo(from, to);
  const current = data.clicks.value;
  const trend = data.clicks.trend;
  const previous = trend === 100 && current > 0 ? 0 : current / (1 + trend / 100);

  return <StatCard title="Clics Totales" value={current} previousValue={previous} trendPercentage={trend} icon={MousePointerClick} className={className} valueClassName={valueClassName} />;
};
