import { MessageCircle } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkCommentsRepo } from '@/features/analytics/platforms/tiktok/repository';

export const TkCommentsWidget = async ({ from, to, className, valueClassName }: { from: Date; to: Date; className?: string; valueClassName?: string }) => {
  const duration = to.getTime() - from.getTime();
  const previousTo = new Date(from.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - duration);

  const [current, prev] = await Promise.all([getTkCommentsRepo(from, to), getTkCommentsRepo(previousFrom, previousTo)]);
  const trend = prev === 0 ? 0 : ((current - prev) / prev) * 100;

  return <StatCard title="Comentarios" value={current} previousValue={prev} trendPercentage={trend} icon={MessageCircle} className={className} valueClassName={valueClassName} />;
};
