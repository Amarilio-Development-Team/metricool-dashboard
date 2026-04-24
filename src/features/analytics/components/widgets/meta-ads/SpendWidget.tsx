import { StatCard } from '@/core/components/widgets/StatCard';
import { DollarSign } from 'lucide-react';
import { getMetaAdsMetricRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeMetricData } from '@/features/analytics/platforms/meta-ads/adapter';
import { fetchMetaAdsSpend } from '@/services/meta-ads';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const SpendWidget = async ({ from, to, className, valueClassName }: Props) => {
  const rawData = await getMetaAdsMetricRepo(from, to, fetchMetaAdsSpend);
  const data = normalizeMetricData(rawData);

  return (
    <StatCard
      title="Importe Gastado"
      icon={DollarSign}
      value={data.value}
      previousValue={data.previousValue}
      trendPercentage={data.trendPercentage}
      className={className}
      valueClassName={valueClassName}
    />
  );
};
