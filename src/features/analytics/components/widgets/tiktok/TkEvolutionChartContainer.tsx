import { getTkEvolutionRepo } from '@/features/analytics/platforms/tiktok/repository';
import { TikTokEvolutionChart } from './TikTokEvolutionChart';

interface Props {
  from: Date;
  to: Date;
}

export const TkEvolutionChartContainer = async ({ from, to }: Props) => {
  const data = await getTkEvolutionRepo(from, to);

  return <TikTokEvolutionChart data={data} />;
};
