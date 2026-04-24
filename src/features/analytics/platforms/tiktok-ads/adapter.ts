import { TkAdsTimelineRaw, TkAdsCampaignsResponse, TkAdsCampaignRaw } from '@/services/tiktok-ads';

export interface CleanMetricData {
  date: string;
  value: number;
}

export interface TkAdsKpi {
  value: number;
  trend: number;
}

export interface TkAdsOverviewData {
  cost: TkAdsKpi;
  impressions: TkAdsKpi;
  clicks: TkAdsKpi;
  conversions: TkAdsKpi;
  cpm: TkAdsKpi;
  cpc: TkAdsKpi;
  ctr: TkAdsKpi;
}

export interface TkAdsEvolutionData {
  date: string;
  cost: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpm: number;
  cpc: number;
  ctr: number;
}

export interface TkAdsCampaignClean {
  id: string;
  name: string;
  objective: string;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpm: number;
  cpc: number;
  ctr: number;
}

export const parseTimeline = (data: TkAdsTimelineRaw): CleanMetricData[] => {
  if (!data || !Array.isArray(data)) return [];
  return data
    .map(([timestamp, value]) => ({
      date: new Date(parseInt(timestamp)).toISOString(),
      value: parseFloat(value) || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const sumValues = (data: CleanMetricData[]) => data.reduce((acc, curr) => acc + curr.value, 0);
const avgValues = (data: CleanMetricData[]) => (data.length ? sumValues(data) / data.length : 0);

const calcTrend = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const adaptTkAdsOverview = (
  currCost: TkAdsTimelineRaw,
  currImp: TkAdsTimelineRaw,
  currClicks: TkAdsTimelineRaw,
  currConv: TkAdsTimelineRaw,
  currCpm: TkAdsTimelineRaw,
  currCpc: TkAdsTimelineRaw,
  currCtr: TkAdsTimelineRaw,
  prevCost: TkAdsTimelineRaw,
  prevImp: TkAdsTimelineRaw,
  prevClicks: TkAdsTimelineRaw,
  prevConv: TkAdsTimelineRaw,
  prevCpm: TkAdsTimelineRaw,
  prevCpc: TkAdsTimelineRaw,
  prevCtr: TkAdsTimelineRaw
): TkAdsOverviewData => {
  const costVal = sumValues(parseTimeline(currCost));
  const impVal = sumValues(parseTimeline(currImp));
  const clicksVal = sumValues(parseTimeline(currClicks));
  const convVal = sumValues(parseTimeline(currConv));
  const cpmVal = avgValues(parseTimeline(currCpm));
  const cpcVal = avgValues(parseTimeline(currCpc));
  const ctrVal = avgValues(parseTimeline(currCtr));

  const pCostVal = sumValues(parseTimeline(prevCost));
  const pImpVal = sumValues(parseTimeline(prevImp));
  const pClicksVal = sumValues(parseTimeline(prevClicks));
  const pConvVal = sumValues(parseTimeline(prevConv));
  const pCpmVal = avgValues(parseTimeline(prevCpm));
  const pCpcVal = avgValues(parseTimeline(prevCpc));
  const pCtrVal = avgValues(parseTimeline(prevCtr));

  return {
    cost: { value: costVal, trend: calcTrend(costVal, pCostVal) },
    impressions: { value: impVal, trend: calcTrend(impVal, pImpVal) },
    clicks: { value: clicksVal, trend: calcTrend(clicksVal, pClicksVal) },
    conversions: { value: convVal, trend: calcTrend(convVal, pConvVal) },
    cpm: { value: cpmVal, trend: calcTrend(cpmVal, pCpmVal) },
    cpc: { value: cpcVal, trend: calcTrend(cpcVal, pCpcVal) },
    ctr: { value: ctrVal, trend: calcTrend(ctrVal, pCtrVal) },
  };
};

export const adaptTkAdsCampaigns = (response: TkAdsCampaignsResponse): TkAdsCampaignClean[] => {
  if (!response?.data) return [];

  return response.data
    .map((camp: TkAdsCampaignRaw) => ({
      id: camp.providerCampaignId,
      name: camp.name,
      objective: camp.objective,
      spent: camp.metrics.SPENT || 0,
      impressions: camp.metrics.IMPRESSIONS || 0,
      clicks: camp.metrics.CLICKS || 0,
      conversions: camp.metrics.CONVERSIONS || 0,
      cpm: camp.metrics.CPM || 0,
      cpc: camp.metrics.CPC || 0,
      ctr: camp.metrics.CTR || 0,
    }))
    .sort((a, b) => b.spent - a.spent);
};
