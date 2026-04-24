import { MetaAdsOverview } from './overviews/MetaAdsOverview';
import { FacebookOverview } from './overviews/FacebookOverview';
import { InstagramOverview } from './overviews/InstagramOverview';
import { TikTokOverview } from './overviews/TikTokOverview';
import { TikTokAdsOverview } from './overviews/TikTokAdsOverview';

interface Props {
  platform: string;
  from: Date;
  to: Date;
}

export const PlatformContent = ({ platform, from, to }: Props) => {
  //* Render the appropriate component based on the platform

  switch (platform) {
    case 'overview':
    case undefined:
      return <FacebookOverview from={from} to={to} />;

    case 'meta_ads':
      return <MetaAdsOverview from={from} to={to} />;

    case 'facebook':
      return <FacebookOverview from={from} to={to} />;

    case 'instagram':
      return <InstagramOverview from={from} to={to} />;

    case 'tiktok':
      return <TikTokOverview from={from} to={to} />;

    case 'tiktok_ads':
      return <TikTokAdsOverview from={from} to={to} />;

    default:
      return <FacebookOverview from={from} to={to} />;
  }
};
