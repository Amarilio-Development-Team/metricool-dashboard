import { Heart } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkLikesRepo } from '@/features/analytics/platforms/tiktok/repository';

export const TkLikesWidget = async ({ from, to, className, valueClassName }: { from: Date; to: Date; className?: string; valueClassName?: string }) => {
  const duration = to.getTime() - from.getTime();
  const previousTo = new Date(from.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - duration);

  const [current, prev] = await Promise.all([getTkLikesRepo(from, to), getTkLikesRepo(previousFrom, previousTo)]);
  const trend = prev === 0 ? 0 : ((current - prev) / prev) * 100;

  return <StatCard title="Me Gusta" value={current} previousValue={prev} trendPercentage={trend} icon={Heart} className={className} valueClassName={valueClassName} />;
};
