import { Suspense } from 'react';
import StatCardSkeleton from '@/core/components/skeletons/StatCardSkeleton';
import { InteractionBreakdownSkeleton } from '@/core/components/skeletons/InteractionBreakdownSkeleton';
import { FollowersWidget } from '../widgets/facebook/FollowersWidget';
import { MediaViewsWidget } from '../widgets/facebook/MediaViewsWidget';
import { PageViewsWidget } from '../widgets/facebook/PageViewsWidget';
import { ClicksWidget } from '../widgets/facebook/ClicksWidget';
import { CommunityBalanceSkeleton } from '@/core/components/skeletons/CommunityBalanceSkeleton';
import { EvolutionChartContainer } from '../widgets/facebook/EvolutionChartContainer';
import { CommunityBalanceWidget } from '../../../../core/components/widgets/CommunityBalanceWidget';
import { FbDemographicsWidget } from '../widgets/facebook/FbDemographicsWidget';
import { FacebookContentAnalysis } from '../widgets/facebook/FacebookContentAnalysis';
import ChartSkeleton from '@/core/components/skeletons/ChartSkeleton';

interface Props {
  from: Date;
  to: Date;
}

export const FacebookOverview = ({ from, to }: Props) => {
  const suspenseKey = `${from.toISOString()}-${to.toISOString()}`;
  const cardTitleFontSize = 'text-3xl mblg:text-4xl lg:text-5xl';

  return (
    <section className="flex flex-col gap-14">
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl xl:text-4xl">
          Rendimiento de la <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-black text-transparent">Cuenta</span>
        </h2>

        <div className="grid h-auto grid-cols-1 gap-4 md:grid-cols-3 lg:h-[400px] lg:grid-rows-2">
          {/* Followers */}
          <div className="md:col-span-1 md:row-span-2">
            <Suspense key={`followers-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full" />}>
              <FollowersWidget from={from} to={to} className="h-full lg:min-h-[300px]" valueClassName="text-5xl lg:text-7xl" />
            </Suspense>
          </div>

          {/* Total Views */}
          <div className="md:col-span-2">
            <Suspense key={`media-views-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full" />}>
              <MediaViewsWidget from={from} to={to} className="h-full lg:min-h-[160px]" valueClassName="text-5xl lg:text-6xl" />
            </Suspense>
          </div>

          {/* Clicks */}
          <div className="md:col-span-1">
            <Suspense key={`clicks-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full" />}>
              <ClicksWidget from={from} to={to} className="h-full" valueClassName={cardTitleFontSize} />
            </Suspense>
          </div>

          {/* Page Views */}
          <div className="md:col-span-1">
            <Suspense key={`page-views-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full" />}>
              <PageViewsWidget from={from} to={to} className="h-full" valueClassName={cardTitleFontSize} />
            </Suspense>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Rendimiento del <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-black text-transparent">Contenido</span>
        </h2>

        <div className="grid grid-cols-1 gap-6">
          <Suspense key={`facebook-breakdown-${suspenseKey}`} fallback={<InteractionBreakdownSkeleton />}>
            <FacebookContentAnalysis from={from} to={to} />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Pulso de la <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-black text-transparent">Comunidad</span>
        </h2>
        <Suspense key={`facebook-evolution-${suspenseKey}`} fallback={<ChartSkeleton />}>
          <EvolutionChartContainer from={from} to={to} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Crecimiento de tu <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-black text-transparent">Comunidad</span>
        </h2>

        <Suspense key={`facebook-community-balance-${suspenseKey}`} fallback={<CommunityBalanceSkeleton />}>
          <CommunityBalanceWidget from={from} to={to} platform="facebook" className="h-full" />
        </Suspense>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Demografía de tu <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text font-black text-transparent">Audiencia</span>
        </h2>

        <Suspense key={`facebook-demographics-${suspenseKey}`} fallback={<div className="h-[400px] w-full animate-pulse rounded-xl bg-gray-100" />}>
          <FbDemographicsWidget from={from} to={to} />
        </Suspense>
      </div>
    </section>
  );
};
