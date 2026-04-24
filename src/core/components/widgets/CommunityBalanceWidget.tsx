import { getCommunityBalanceRepo as getFbBalance } from '@/features/analytics/platforms/facebook/repository';
import { getIgCommunityBalanceRepo as getIgBalance } from '@/features/analytics/platforms/instagram/repository';
import { getTkCommunityBalanceRepo as getTkBalance } from '@/features/analytics/platforms/tiktok/repository';

import { CommunityBalanceCard, BalanceData } from '@/core/components/widgets/CommunityBalanceCard';

interface Props {
  from: Date;
  to: Date;
  platform: 'facebook' | 'instagram' | 'tiktok';
  className?: string;
}

interface TikTokResponse {
  totals: BalanceData;
}

export const CommunityBalanceWidget = async ({ from, to, platform, className }: Props) => {
  const getNormalizedData = async (): Promise<BalanceData> => {
    let rawData: unknown;

    switch (platform) {
      case 'facebook':
        rawData = await getFbBalance(from, to);
        break;
      case 'instagram':
        rawData = await getIgBalance(from, to);
        break;
      case 'tiktok':
        rawData = await getTkBalance(from, to);
        break;
      default:
        return { gained: 0, lost: 0, net: 0 };
    }

    if (typeof rawData === 'number') {
      return { gained: 0, lost: 0, net: rawData };
    }

    if (isTikTokStyleResponse(rawData)) {
      return rawData.totals;
    }

    if (isBalanceData(rawData)) {
      return rawData;
    }

    return { gained: 0, lost: 0, net: 0 };
  };

  const data = await getNormalizedData();

  return <CommunityBalanceCard data={data} className={className} />;
};

function isTikTokStyleResponse(data: unknown): data is TikTokResponse {
  return typeof data === 'object' && data !== null && 'totals' in data && isBalanceData((data as TikTokResponse).totals);
}

function isBalanceData(data: unknown): data is BalanceData {
  return typeof data === 'object' && data !== null && 'gained' in data && 'lost' in data && 'net' in data;
}
