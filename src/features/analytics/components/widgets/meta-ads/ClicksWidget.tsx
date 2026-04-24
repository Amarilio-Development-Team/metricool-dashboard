import { StatCard } from '@/core/components/widgets/StatCard';
import { MouseIcon } from 'lucide-react';
import { getMetaAdsMetricRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeMetricData } from '@/features/analytics/platforms/meta-ads/adapter';
import { fetchMetaAdsClicksValue } from '@/services/meta-ads';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const ClicksWidget: React.FC<Props> = async ({ from, to, className, valueClassName }) => {
  const rawData = await getMetaAdsMetricRepo(from, to, fetchMetaAdsClicksValue);
  const data = normalizeMetricData(rawData);

  return <StatCard title="Clics" icon={MouseIcon} value={data.value} previousValue={data.previousValue} trendPercentage={data.trendPercentage} className={className} valueClassName={valueClassName} />;
};
