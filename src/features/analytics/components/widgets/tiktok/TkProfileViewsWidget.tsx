import { UserRoundSearch } from 'lucide-react'; // O cualquier icono que prefieras
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkProfileViewsRepo } from '@/features/analytics/platforms/tiktok/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkProfileViewsWidget = async ({ from, to, className, valueClassName }: Props) => {
  const duration = to.getTime() - from.getTime();
  const previousTo = new Date(from.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - duration);

  const [currentValue, previousValue] = await Promise.all([getTkProfileViewsRepo(from, to), getTkProfileViewsRepo(previousFrom, previousTo)]);

  const trend = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue) * 100;

  return <StatCard title="Visitas Perfil" value={currentValue} previousValue={previousValue} trendPercentage={trend} icon={UserRoundSearch} className={className} valueClassName={valueClassName} />;
};
