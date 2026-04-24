import { cache } from 'react';
import { getComparisonPeriod } from '@/core/utils/date-utils';
import { fetchTkAdsCost, fetchTkAdsImpressions, fetchTkAdsClicks, fetchTkAdsConversions, fetchTkAdsCpm, fetchTkAdsCpc, fetchTkAdsCtr, fetchTikTokAdsCampaigns } from '@/services/tiktok-ads';
import { adaptTkAdsOverview, adaptTkAdsCampaigns, parseTimeline, TkAdsOverviewData, TkAdsEvolutionData, TkAdsCampaignClean } from './adapter';

export const getTkAdsOverviewRepo = cache(async (from: Date, to: Date): Promise<TkAdsOverviewData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(from, to);

  const [
    // Current
    currCost,
    currImp,
    currClicks,
    currConv,
    currCpm,
    currCpc,
    currCtr,
    // Previous
    prevCost,
    prevImp,
    prevClicks,
    prevConv,
    prevCpm,
    prevCpc,
    prevCtr,
  ] = await Promise.all([
    fetchTkAdsCost(from, to),
    fetchTkAdsImpressions(from, to),
    fetchTkAdsClicks(from, to),
    fetchTkAdsConversions(from, to),
    fetchTkAdsCpm(from, to),
    fetchTkAdsCpc(from, to),
    fetchTkAdsCtr(from, to),
    fetchTkAdsCost(previousFrom, previousTo),
    fetchTkAdsImpressions(previousFrom, previousTo),
    fetchTkAdsClicks(previousFrom, previousTo),
    fetchTkAdsConversions(previousFrom, previousTo),
    fetchTkAdsCpm(previousFrom, previousTo),
    fetchTkAdsCpc(previousFrom, previousTo),
    fetchTkAdsCtr(previousFrom, previousTo),
  ]);

  return adaptTkAdsOverview(currCost, currImp, currClicks, currConv, currCpm, currCpc, currCtr, prevCost, prevImp, prevClicks, prevConv, prevCpm, prevCpc, prevCtr);
});

//! EVOLUTION CHART (Gráfica unificada con Tabs)
export const getTkAdsEvolutionRepo = cache(async (from: Date, to: Date): Promise<TkAdsEvolutionData[]> => {
  const [costRes, impRes, clicksRes, convRes, cpmRes, cpcRes, ctrRes] = await Promise.all([
    fetchTkAdsCost(from, to),
    fetchTkAdsImpressions(from, to),
    fetchTkAdsClicks(from, to),
    fetchTkAdsConversions(from, to),
    fetchTkAdsCpm(from, to),
    fetchTkAdsCpc(from, to),
    fetchTkAdsCtr(from, to),
  ]);

  const cost = parseTimeline(costRes);
  const imp = parseTimeline(impRes);
  const clicks = parseTimeline(clicksRes);
  const conv = parseTimeline(convRes);
  const cpm = parseTimeline(cpmRes);
  const cpc = parseTimeline(cpcRes);
  const ctr = parseTimeline(ctrRes);

  const dataMap = new Map<string, TkAdsEvolutionData>();

  cost.forEach(c => {
    dataMap.set(c.date, {
      date: c.date,
      cost: c.value,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      cpm: 0,
      cpc: 0,
      ctr: 0,
    });
  });

  const mergeToMap = (dataArray: { date: string; value: number }[], key: keyof Omit<TkAdsEvolutionData, 'date'>) => {
    dataArray.forEach(item => {
      if (dataMap.has(item.date)) {
        dataMap.get(item.date)![key] = item.value;
      }
    });
  };

  mergeToMap(imp, 'impressions');
  mergeToMap(clicks, 'clicks');
  mergeToMap(conv, 'conversions');
  mergeToMap(cpm, 'cpm');
  mergeToMap(cpc, 'cpc');
  mergeToMap(ctr, 'ctr');

  return Array.from(dataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

//! 3. CAMPAIGNS TABLE
export const getTkAdsCampaignsRepo = cache(async (from: Date, to: Date): Promise<TkAdsCampaignClean[]> => {
  const res = await fetchTikTokAdsCampaigns(from, to);
  return adaptTkAdsCampaigns(res);
});
