import { getTkAdsCampaignsRepo } from '@/features/analytics/platforms/tiktok-ads/repository';
import { TkAdsCampaignsTable } from './TkAdsCampaignsTable';

interface Props {
  from: Date;
  to: Date;
}

export const TkAdsCampaignsTableContainer = async ({ from, to }: Props) => {
  const campaigns = await getTkAdsCampaignsRepo(from, to);

  return <TkAdsCampaignsTable data={campaigns} />;
};
