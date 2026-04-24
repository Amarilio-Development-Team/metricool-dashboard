import { Suspense } from 'react';
import StatCardSkeleton from '@/core/components/skeletons/StatCardSkeleton';
import { TkAdsCostWidget } from '../widgets/tiktok-ads/TkAdsCostWidget';
import { TkAdsConversionsWidget } from '../widgets/tiktok-ads/TkAdsConversionsWidget';
import { TkAdsImpressionsWidget } from '../widgets/tiktok-ads/TkAdsImpressionsWidget';
import { TkAdsClicksWidget } from '../widgets/tiktok-ads/TkAdsClicksWidget';
import { TkAdsCpmWidget } from '../widgets/tiktok-ads/TkAdsCpmWidget';
import { TkAdsCpcWidget } from '../widgets/tiktok-ads/TkAdsCpcWidget';
import { TkAdsCtrWidget } from '../widgets/tiktok-ads/TkAdsCtrWidget';
import { TkAdsEvolutionChartContainer } from '../widgets/tiktok-ads/TkAdsEvolutionChartContainer';
import ChartSkeleton from '@/core/components/skeletons/ChartSkeleton';
import { TkAdsCampaignsTableContainer } from '../widgets/tiktok-ads/TkAdsCampaignsTableContainer';

interface Props {
  from: Date;
  to: Date;
}

export const TikTokAdsOverview = ({ from, to }: Props) => {
  const suspenseKey = `${from.toISOString()}-${to.toISOString()}`;

  const heroValueSize = 'text-5xl lg:text-6xl font-black tracking-tight';
  const subValueSize = 'text-4xl lg:text-5xl font-bold';

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl xl:text-4xl">
          Rendimiento en{' '}
          <span className="inline-block bg-gradient-to-r from-cyan-500 via-black to-pink-500 bg-clip-text font-black text-transparent dark:from-cyan-400 dark:via-gray-200 dark:to-pink-500">
            TikTok
          </span>{' '}
          <span className="font-extralight text-gray-500 dark:text-gray-400">Ads</span>
        </h2>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="flex flex-col gap-4 lg:col-span-4">
            <Suspense key={`tiktok-ads-cost-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[180px]" />}>
              <TkAdsCostWidget from={from} to={to} className="h-full border-l-4 border-gray-900 shadow-md dark:border-gray-100" valueClassName={heroValueSize} />
            </Suspense>

            <Suspense key={`tiktok-ads-conversions-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[180px]" />}>
              <TkAdsConversionsWidget from={from} to={to} className="h-full border-l-4 border-pink-500 shadow-md" valueClassName={heroValueSize} />
            </Suspense>
          </div>

          <div className="flex flex-col gap-4 lg:col-span-8">
            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-2">
              <Suspense key={`tiktok-ads-impressions-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[180px]" />}>
                <TkAdsImpressionsWidget from={from} to={to} className="h-full shadow-sm" valueClassName={subValueSize} />
              </Suspense>

              <Suspense key={`tiktok-ads-clicks-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[180px]" />}>
                <TkAdsClicksWidget from={from} to={to} className="h-full shadow-sm" valueClassName={subValueSize} />
              </Suspense>
            </div>

            <div className="grid h-full grid-cols-1 gap-4 sm:grid-cols-3">
              <Suspense key={`tiktok-ads-cpm-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[120px]" />}>
                <TkAdsCpmWidget from={from} to={to} className="h-full border-dashed bg-gray-50 dark:bg-gray-900/40" />
              </Suspense>

              <Suspense key={`tiktok-ads-cpc-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[120px]" />}>
                <TkAdsCpcWidget from={from} to={to} className="h-full border-dashed bg-gray-50 dark:bg-gray-900/40" />
              </Suspense>

              <Suspense key={`tiktok-ads-ctr-${suspenseKey}`} fallback={<StatCardSkeleton className="h-[120px]" />}>
                <TkAdsCtrWidget from={from} to={to} className="h-full border-dashed bg-gray-50 dark:bg-gray-900/40" />
              </Suspense>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
          Pulso de tus{' '}
          <span className="inline-block bg-gradient-to-r from-cyan-500 via-black to-pink-500 bg-clip-text font-black text-transparent dark:from-cyan-400 dark:via-gray-200 dark:to-pink-500">
            Campañas
          </span>
        </h2>

        {/* Temporal Evolution */}
        <Suspense key={`chart-${suspenseKey}`} fallback={<ChartSkeleton />}>
          <TkAdsEvolutionChartContainer from={from} to={to} />
        </Suspense>
      </div>

      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold text-gray-900 dark:text-white lg:text-3xl">
          Información de tus{' '}
          <span className="inline-block bg-gradient-to-r from-cyan-500 via-black to-pink-500 bg-clip-text font-black text-transparent dark:from-cyan-400 dark:via-gray-200 dark:to-pink-500">
            Campañas
          </span>
        </h2>

        <Suspense key={`table-${suspenseKey}`} fallback={<div className="h-[300px] w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />}>
          <TkAdsCampaignsTableContainer from={from} to={to} />
        </Suspense>
      </div>
    </section>
  );
};
