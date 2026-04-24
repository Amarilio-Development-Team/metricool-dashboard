import { StatCard } from '@/core/components/widgets/StatCard';
import { Users } from 'lucide-react';
import { getMetaAdsValueRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeValueData } from '@/features/analytics/platforms/meta-ads/adapter';
import { fetchMetaAdsReachValue } from '@/services/meta-ads';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const ReachWidget = async ({ from, to, className, valueClassName }: Props) => {
  const rawData = await getMetaAdsValueRepo(from, to, fetchMetaAdsReachValue);
  const data = normalizeValueData(rawData);

  return <StatCard title="Alcance" icon={Users} value={data.value} previousValue={data.previousValue} trendPercentage={data.trendPercentage} className={className} valueClassName={valueClassName} />;
};
