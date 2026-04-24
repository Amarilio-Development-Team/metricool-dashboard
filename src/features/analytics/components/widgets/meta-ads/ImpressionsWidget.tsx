import { StatCard } from '@/core/components/widgets/StatCard';
import { Megaphone } from 'lucide-react';
import { getMetaAdsMetricRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeMetricData } from '@/features/analytics/platforms/meta-ads/adapter';
import { fetchMetaAdsImpressions } from '@/services/meta-ads';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const ImpressionsWidget = async ({ from, to, className, valueClassName }: Props) => {
  const rawData = await getMetaAdsMetricRepo(from, to, fetchMetaAdsImpressions);
  const data = normalizeMetricData(rawData);

  return (
    <StatCard title="Impresiones" icon={Megaphone} value={data.value} previousValue={data.previousValue} trendPercentage={data.trendPercentage} className={className} valueClassName={valueClassName} />
  );
};
