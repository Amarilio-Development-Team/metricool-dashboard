import { getDemographicsRepo } from '@/features/analytics/platforms/facebook/repository';
import { FbDemographicsCard } from './FbDemographicsCard';

interface Props {
  from: Date;
  to: Date;
  className?: string;
}

export const FbDemographicsWidget = async ({ from, to, className }: Props) => {
  const data = await getDemographicsRepo(from, to);

  return <FbDemographicsCard data={data} className={className} />;
};
