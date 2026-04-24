import { StatCard } from '@/core/components/widgets/StatCard';
import { CreditCard } from 'lucide-react';
import { getMetaAdsMetricRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeAverageMetricData } from '@/features/analytics/platforms/meta-ads/adapter';
import { fetchMetaAdsCpc } from '@/services/meta-ads';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const MetaAdsCpcWidget = async ({ from, to, className, valueClassName }: Props) => {
  const rawData = await getMetaAdsMetricRepo(from, to, fetchMetaAdsCpc);
  const data = normalizeAverageMetricData(rawData);

  return <StatCard title="CPC" icon={CreditCard} value={data.value} previousValue={data.previousValue} trendPercentage={data.trendPercentage} className={className} valueClassName={valueClassName} />;
};
