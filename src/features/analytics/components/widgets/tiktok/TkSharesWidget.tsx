import { Share2 } from 'lucide-react';
import { StatCard } from '@/core/components/widgets/StatCard';
import { getTkSharesRepo } from '@/features/analytics/platforms/tiktok/repository';

export const TkSharesWidget = async ({ from, to, className, valueClassName }: { from: Date; to: Date; className?: string; valueClassName?: string }) => {
  const duration = to.getTime() - from.getTime();
  const previousTo = new Date(from.getTime() - 1);
  const previousFrom = new Date(previousTo.getTime() - duration);

  const [current, prev] = await Promise.all([getTkSharesRepo(from, to), getTkSharesRepo(previousFrom, previousTo)]);
  const trend = prev === 0 ? 0 : ((current - prev) / prev) * 100;

  return <StatCard title="Compartidos" value={current} previousValue={prev} trendPercentage={trend} icon={Share2} className={className} valueClassName={valueClassName} />;
};
