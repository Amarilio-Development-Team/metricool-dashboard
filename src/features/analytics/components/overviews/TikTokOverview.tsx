import { Suspense } from 'react';
import StatCardSkeleton from '@/core/components/skeletons/StatCardSkeleton';
import { CommunityBalanceSkeleton } from '@/core/components/skeletons/CommunityBalanceSkeleton';
import { TkEvolutionChartContainer } from '../widgets/tiktok/TkEvolutionChartContainer';
import { TkFollowersWidget } from '../widgets/tiktok/TkFollowersWidget';
import { TkVideoViewsWidget } from '../widgets/tiktok/TkVideoViewsWidget';
import { TkProfileViewsWidget } from '../widgets/tiktok/TkProfileViewsWidget';
import { TkEngagementWidget } from '../widgets/tiktok/TkEngagementWidget';
import { TkLikesWidget } from '../widgets/tiktok/TkLikesWidget';
import { TkCommentsWidget } from '../widgets/tiktok/TkCommentsWidget';
import { TkSharesWidget } from '../widgets/tiktok/TkSharesWidget';
import { TkTrafficSourcesCard } from '../widgets/tiktok/TkTrafficSourcesCard';
import { TkVideoPerformanceCard } from '../widgets/tiktok/TkVideoPerformanceCard';
import { CommunityBalanceWidget } from '../../../../core/components/widgets/CommunityBalanceWidget';
import { TkDemographicsWidget } from '../widgets/tiktok/TkDemographicsWidget';
import ChartSkeleton from '@/core/components/skeletons/ChartSkeleton';

interface Props {
  from: Date;
  to: Date;
}

export const TikTokOverview = ({ from, to }: Props) => {
  const suspenseKey = `${from.toISOString()}-${to.toISOString()}`;
  const heroValueSize = 'text-5xl lg:text-6xl';
  const subValueSize = 'text-4xl lg:text-5xl';

  return (
    <section className="flex flex-col gap-8">
      {/* Main KPIs */}
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl xl:text-4xl">
          Rendimiento en{' '}
          <span className="inline-block bg-gradient-to-r from-cyan-500 via-black to-pink-500 bg-clip-text font-black text-transparent dark:from-cyan-400 dark:via-gray-200 dark:to-pink-500">
            TikTok
          </span>
        </h2>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Suspense key={`tiktok-followers-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[200px]" />}>
              <TkFollowersWidget from={from} to={to} className="h-full" valueClassName={heroValueSize} />
            </Suspense>
            <Suspense key={`tiktok-profile-views-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[150px]" />}>
              <TkProfileViewsWidget from={from} to={to} className="h-full" valueClassName={subValueSize} />
            </Suspense>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Suspense key={`tiktok-video-views-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[180px]" />}>
                <TkVideoViewsWidget from={from} to={to} className="h-full" valueClassName={heroValueSize} />
              </Suspense>
              <Suspense key={`tiktok-engagement-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[180px]" />}>
                <TkEngagementWidget from={from} to={to} className="h-full" valueClassName={heroValueSize} />
              </Suspense>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <Suspense key={`tiktok-likes-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[120px]" />}>
                <TkLikesWidget from={from} to={to} className="h-full" valueClassName={subValueSize} />
              </Suspense>
              <Suspense key={`tiktok-comments-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[120px]" />}>
                <TkCommentsWidget from={from} to={to} className="h-full" valueClassName={subValueSize} />
              </Suspense>
              <Suspense key={`tiktok-shares-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[120px]" />}>
                <TkSharesWidget from={from} to={to} className="h-full" valueClassName={subValueSize} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
          Pulso de tu{' '}
          <span className="inline-block bg-gradient-to-r from-cyan-500 via-black to-pink-500 bg-clip-text font-black text-transparent dark:from-cyan-400 dark:via-gray-200 dark:to-pink-500">
            Comunidad
          </span>
        </h2>

        {/* Temporal Evolution */}
        <Suspense key={`tiktok-evolution-${suspenseKey}`} fallback={<ChartSkeleton />}>
          <TkEvolutionChartContainer from={from} to={to} />
        </Suspense>
      </div>

      {/* Content Quality */}
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Calidad del{' '}
          <span className="inline-block bg-gradient-to-r from-cyan-500 via-black to-pink-500 bg-clip-text font-black text-transparent dark:from-cyan-400 dark:via-gray-200 dark:to-pink-500">
            Contenido
          </span>
        </h2>

        {/* Followers Evolution and Traffic Sources */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Suspense key={`tiktok-community-balance-${suspenseKey}`} fallback={<CommunityBalanceSkeleton />}>
            <CommunityBalanceWidget platform="tiktok" from={from} to={to} className="h-full" />
          </Suspense>

          {/* Traffic Sources */}
          <Suspense key={`tiktok-traffic-sources-${suspenseKey}`} fallback={<div className="h-[300px] rounded-xl bg-gray-100" />}>
            <TkTrafficSourcesCard from={from} to={to} />
          </Suspense>
        </div>

        {/* Video Performance */}
        <div className="grid grid-cols-1">
          <Suspense key={`tiktok-video-performance-${suspenseKey}`} fallback={<div className="h-[200px] rounded-xl bg-gray-100" />}>
            <TkVideoPerformanceCard from={from} to={to} />
          </Suspense>
        </div>
      </div>

      {/* Demographics */}
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Demografía de la{' '}
          <span className="inline-block bg-gradient-to-r from-cyan-500 via-black to-pink-500 bg-clip-text font-black text-transparent dark:from-cyan-400 dark:via-gray-200 dark:to-pink-500">
            Comunidad
          </span>
        </h2>
        <Suspense key={`tiktok-demographics-${suspenseKey}`} fallback={<div className="h-[400px] rounded-xl bg-gray-100" />}>
          <TkDemographicsWidget from={from} to={to} />
        </Suspense>
      </div>
    </section>
  );
};
