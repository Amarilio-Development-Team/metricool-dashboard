import { getIgDemographicsRepo } from '@/features/analytics/platforms/instagram/repository';
import { IgDemographicsCard } from './IgDemographicsCard';

interface Props {
  from: Date;
  to: Date;
  className?: string;
}

export const IgDemographicsWidget = async ({ from, to, className }: Props) => {
  const data = await getIgDemographicsRepo(from, to);

  return <IgDemographicsCard data={data} className={className} />;
};
