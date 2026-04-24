import { Users } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkFollowersRepo } from '@/features/analytics/platforms/tiktok/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
  valueClassName?: string;
}

export const TkFollowersWidget = async ({ from, to, className, valueClassName }: Props) => {
  // 1. Calcular periodo anterior
  const duration = to.getTime() - from.getTime();
  const previousTo = new Date(from.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - duration);

  // 2. Obtener datos (Paralelo)
  const [currentValue, previousValue] = await Promise.all([getTkFollowersRepo(from, to), getTkFollowersRepo(previousFrom, previousTo)]);

  // 3. Calcular tendencia
  const trend = previousValue === 0 ? 0 : ((currentValue - previousValue) / previousValue) * 100;

  return <StatCard title="Seguidores" value={currentValue} previousValue={previousValue} trendPercentage={trend} icon={Users} className={className} valueClassName={valueClassName} />;
};
