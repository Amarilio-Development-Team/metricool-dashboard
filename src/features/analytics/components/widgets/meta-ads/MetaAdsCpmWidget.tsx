import { StatCard } from '@/core/components/widgets/StatCard';
import { Activity } from 'lucide-react';
import { getMetaAdsMetricRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeAverageMetricData } from '@/features/analytics/platforms/meta-ads/adapter';
import { fetchMetaAdsCpm } from '@/services/meta-ads';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const MetaAdsCpmWidget = async ({ from, to, className, valueClassName }: Props) => {
  // Obtenemos la data y la pasamos por el normalizador de PROMEDIOS
  const rawData = await getMetaAdsMetricRepo(from, to, fetchMetaAdsCpm);
  const data = normalizeAverageMetricData(rawData);

  return <StatCard title="CPM" icon={Activity} value={data.value} previousValue={data.previousValue} trendPercentage={data.trendPercentage} className={className} valueClassName={valueClassName} />;
};
