import { cache } from 'react';
import { getComparisonPeriod } from '@/core/utils/date-utils';
import { fetchMetaAdsImpressions, fetchMetaAdsSpend, fetchMetaAdsClicksValue, MetricoolTimelineResponse } from '@/services/meta-ads';
import { fetchMetaAdsCampaigns } from '@/services/meta-ads';
import { adaptMetaAdsCampaigns, MetaAdsCampaignClean } from './adapter';
import { fetchMetaAdsCpm, fetchMetaAdsCpc, fetchMetaAdsCtr } from '@/services/meta-ads';

type MetricTimelineFetcher = (start: Date, end: Date) => Promise<MetricoolTimelineResponse>;
type MetricValueFetcher = (start: Date, end: Date) => Promise<number>;

export interface MetaAdsRepositoryData {
  current: MetricoolTimelineResponse;
  previous: MetricoolTimelineResponse;
}

export interface MetaAdsValueRepositoryData {
  current: number;
  previous: number;
}

//! Generic Timeline Repo
export const getMetaAdsMetricRepo = cache(async (currentStart: Date, currentEnd: Date, fetcher: MetricTimelineFetcher): Promise<MetaAdsRepositoryData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(currentStart, currentEnd);

  const [current, previous] = await Promise.all([fetcher(currentStart, currentEnd), fetcher(previousFrom, previousTo)]);

  return { current, previous };
});

//! Generic unic value repo
export const getMetaAdsValueRepo = cache(async (currentStart: Date, currentEnd: Date, fetcher: MetricValueFetcher): Promise<MetaAdsValueRepositoryData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(currentStart, currentEnd);

  const [current, previous] = await Promise.all([fetcher(currentStart, currentEnd), fetcher(previousFrom, previousTo)]);

  return { current, previous };
});

//! Chart repo
export const getMetaAdsChartRepo = cache(async (from: Date, to: Date) => {
  const [spend, impressions, clicks] = await Promise.all([fetchMetaAdsSpend(from, to), fetchMetaAdsImpressions(from, to), fetchMetaAdsClicksValue(from, to)]);

  return { spend, impressions, clicks };
});

//! Campaigns repo
export const getMetaAdsCampaignsRepo = cache(async (from: Date, to: Date): Promise<MetaAdsCampaignClean[]> => {
  const rawData = await fetchMetaAdsCampaigns(from, to);
  return adaptMetaAdsCampaigns(rawData);
});

export const getMetaAdsEfficiencyChartRepo = cache(async (from: Date, to: Date) => {
  const [cpm, cpc, ctr] = await Promise.all([fetchMetaAdsCpm(from, to), fetchMetaAdsCpc(from, to), fetchMetaAdsCtr(from, to)]);

  // Regresamos la data cruda. El componente visual se encargará de pasarla por normalizeEfficiencyChartData
  return { cpm, cpc, ctr };
});
