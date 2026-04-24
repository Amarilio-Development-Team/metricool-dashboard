import { getTkDemographicsRepo } from '@/features/analytics/platforms/tiktok/repository';
import { TkDemographicsCard } from './TkDemographicsCard';

interface Props {
  from: Date;
  to: Date;
  className?: string;
}

export const TkDemographicsWidget = async ({ from, to, className }: Props) => {
  const data = await getTkDemographicsRepo(from, to);

  return <TkDemographicsCard data={data} className={className} />;
};
