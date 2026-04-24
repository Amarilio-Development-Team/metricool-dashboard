import { Suspense } from 'react';
import StatCardSkeleton from '@/core/components/skeletons/StatCardSkeleton';
import { CommunityBalanceSkeleton } from '@/core/components/skeletons/CommunityBalanceSkeleton';
import { EvolutionChartContainer } from '../widgets/instagram/EvolutionChartContainer';
import { IgFollowersWidget } from '../widgets/instagram/IgFollowersWidget';
import { IgReachWidget } from '../widgets/instagram/IgReachWidget';
import { IgReachAverageWidget } from '../widgets/instagram/IgReachAverageWidget';
import { IgProfileViewsWidget } from '../widgets/instagram/IgProfileViewsWidget';
import { IgMediaViewsWidget } from '../widgets/instagram/IgMediaViewsWidget';
import { AgeGenderCard } from '../widgets/instagram/AgeGenderCard';
import { CommunityBalanceWidget } from '../../../../core/components/widgets/CommunityBalanceWidget';
import ChartSkeleton from '@/core/components/skeletons/ChartSkeleton';
import { IgDemographicsWidget } from '../widgets/instagram/IgDemographicsWidget';
import { InstagramContentAnalysis } from '../widgets/instagram/InstagramContentAnalysis';

interface Props {
  from: Date;
  to: Date;
}

export const InstagramOverview = ({ from, to }: Props) => {
  const suspenseKey = `${from.toISOString()}-${to.toISOString()}`;

  const heroValueSize = 'text-4xl lg:text-5xl';

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl xl:text-4xl">
          Rendimiento del <span className="bg-gradient-to-tr from-amber-500 via-pink-600 to-purple-600 bg-clip-text font-black text-transparent">Perfil</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-1 md:row-span-2">
            <Suspense key={`instagram-followers-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full min-h-[336px]" />}>
              <IgFollowersWidget from={from} to={to} className="flex h-full flex-col justify-center" valueClassName="text-5xl lg:text-6xl" />
            </Suspense>
          </div>

          <Suspense key={`instagram-reach-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full min-h-[160px]" />}>
            <IgReachWidget from={from} to={to} className="h-full" valueClassName={heroValueSize} />
          </Suspense>

          <Suspense key={`instagram-profile-views-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full min-h-[160px]" />}>
            <IgProfileViewsWidget from={from} to={to} className="h-full" valueClassName={heroValueSize} />
          </Suspense>

          <Suspense key={`instagram-media-views-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full min-h-[160px]" />}>
            <IgMediaViewsWidget from={from} to={to} className="h-full" valueClassName={heroValueSize} />
          </Suspense>

          <Suspense key={`instagram-reach-average-${suspenseKey}`} fallback={<StatCardSkeleton className="h-full min-h-[160px]" />}>
            <IgReachAverageWidget from={from} to={to} className="h-full" valueClassName={heroValueSize} />
          </Suspense>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Rendimiento del <span className="bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 bg-clip-text font-black text-transparent">Contenido</span>
        </h2>
        <InstagramContentAnalysis from={from} to={to} />
      </div>

      {/* Demographics and Community */}
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Demografía y Crecimiento de tu <span className="bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 bg-clip-text font-black text-transparent">Comunidad</span>
        </h2>

        {/* Balance and Age/Gender */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <Suspense key={`instagram-community-balance-${suspenseKey}`} fallback={<CommunityBalanceSkeleton />}>
            <CommunityBalanceWidget from={from} to={to} platform="instagram" className="h-full" />
          </Suspense>

          <Suspense key={`instagram-age-gender-${suspenseKey}`} fallback={<div className="h-[300px] rounded-xl bg-gray-100" />}>
            <AgeGenderCard from={from} to={to} />
          </Suspense>
        </div>

        {/* Evolution Chart */}
        <Suspense key={`instagram-evolution-chart-${suspenseKey}`} fallback={<ChartSkeleton />}>
          <EvolutionChartContainer from={from} to={to} />
        </Suspense>

        {/* Geographic Map */}
        <Suspense key={`instagram-demographics-${suspenseKey}`} fallback={<div className="h-[400px] rounded-xl bg-gray-100" />}>
          <IgDemographicsWidget from={from} to={to} />
        </Suspense>
      </div>
    </section>
  );
};
