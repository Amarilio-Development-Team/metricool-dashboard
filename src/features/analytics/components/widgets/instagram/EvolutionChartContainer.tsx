import { getIgEvolutionRepo } from '@/features/analytics/platforms/instagram/repository';
import { InstagramEvolutionChart } from './InstagramEvolutionChart';

interface Props {
  from: Date;
  to: Date;
}

export const EvolutionChartContainer = async ({ from, to }: Props) => {
  const data = await getIgEvolutionRepo(from, to);

  return <InstagramEvolutionChart data={data} />;
};
