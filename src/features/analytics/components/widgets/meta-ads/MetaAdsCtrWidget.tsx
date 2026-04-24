import { StatCard } from '@/core/components/widgets/StatCard';
import { Percent } from 'lucide-react';
import { getMetaAdsMetricRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeAverageMetricData } from '@/features/analytics/platforms/meta-ads/adapter';
import { fetchMetaAdsCtr } from '@/services/meta-ads';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const MetaAdsCtrWidget = async ({ from, to, className, valueClassName }: Props) => {
  const rawData = await getMetaAdsMetricRepo(from, to, fetchMetaAdsCtr);
  const data = normalizeAverageMetricData(rawData);

  return <StatCard title="CTR" icon={Percent} value={data.value} previousValue={data.previousValue} trendPercentage={data.trendPercentage} className={className} valueClassName={valueClassName} />;
};
