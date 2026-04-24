import { getEvolutionChartRepo } from '@/features/analytics/platforms/facebook/repository';
import { EvolutionChart } from './EvolutionChart';

interface Props {
  from: Date;
  to: Date;
}

export const EvolutionChartContainer = async ({ from, to }: Props) => {
  const data = await getEvolutionChartRepo(from, to);

  return <EvolutionChart data={data} />;
};
