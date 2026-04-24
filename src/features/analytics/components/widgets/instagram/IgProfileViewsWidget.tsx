import { UserRoundSearch } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getIgProfileViewsRepo } from '@/features/analytics/platforms/instagram/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const IgProfileViewsWidget = async ({ from, to, className, valueClassName }: Props) => {
  const { value, previousValue } = await getIgProfileViewsRepo(from, to);

  const trend = previousValue === 0 ? 0 : ((value - previousValue) / previousValue) * 100;

  return <StatCard title="Visitas al Perfil" value={value} previousValue={previousValue} trendPercentage={trend} icon={UserRoundSearch} className={className} valueClassName={valueClassName} />;
};
