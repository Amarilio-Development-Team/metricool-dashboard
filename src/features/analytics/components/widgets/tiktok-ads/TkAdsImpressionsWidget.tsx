import { Eye } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkAdsOverviewRepo } from '@/features/analytics/platforms/tiktok-ads/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkAdsImpressionsWidget = async ({ from, to, className, valueClassName }: Props) => {
  const data = await getTkAdsOverviewRepo(from, to);
  const current = data.impressions.value;
  const trend = data.impressions.trend;
  const previous = trend === 100 && current > 0 ? 0 : current / (1 + trend / 100);

  return <StatCard title="Impresiones Totales" value={current} previousValue={previous} trendPercentage={trend} icon={Eye} className={className} valueClassName={valueClassName} />;
};
