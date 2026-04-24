import { getTkAdsEvolutionRepo } from '@/features/analytics/platforms/tiktok-ads/repository';
import { TkAdsEvolutionChart } from './TkAdsEvolutionChart';

interface Props {
  from: Date;
  to: Date;
}

export const TkAdsEvolutionChartContainer = async ({ from, to }: Props) => {
  const data = await getTkAdsEvolutionRepo(from, to);

  return <TkAdsEvolutionChart data={data} />;
};
