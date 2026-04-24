import { TikTokTimelineResponse } from '@/services/tiktok';

export interface CleanMetricData {
  date: string;
  value: number;
}

export interface DemographicItem {
  name: string;
  code?: string;
  percentage: number;
}

export interface TrafficSourceData {
  name: string;
  value: number;
  key: string;
}

export interface TkEvolutionData {
  date: string;
  followers: number;
  videoViews: number;
}

export interface TkDemographicsData {
  countries: DemographicItem[];
  gender: { name: string; value: number }[];
}

export interface CommunityBalanceData {
  totals: {
    gained: number;
    lost: number;
    net: number;
  };
}

export interface VideoPerformanceData {
  avgWatchTime: number;
  avgDuration: number;
}

export interface ContentPerformanceKpi {
  label: string;
  value: string | number;
  trend?: number;
}

export interface ContentPerformanceData {
  chartData: CleanMetricData[];
  kpis: ContentPerformanceKpi[];
  breakdown: {
    metric1: number;
    metric2: number;
    metric3: number;
    metric4: number;
  };
}

//! Helpers

export const getValues = (response: TikTokTimelineResponse): CleanMetricData[] => {
  const rawValues = response?.data?.[0]?.values;
  if (!rawValues || !Array.isArray(rawValues)) return [];

  return rawValues
    .map(item => ({
      date: item.dateTime,
      value: item.value || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

//! Internal Helpers
const sumValues = (data: CleanMetricData[]) => data.reduce((acc, curr) => acc + curr.value, 0);
const avgValues = (data: CleanMetricData[]) => (data.length ? sumValues(data) / data.length : 0);
const calculateTrendPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

//! Main Adapters
export const adaptTikTokPerformance = (
  // Current
  viewsRes: TikTokTimelineResponse,
  engagementRes: TikTokTimelineResponse,
  likesRes: TikTokTimelineResponse,
  commentsRes: TikTokTimelineResponse,
  sharesRes: TikTokTimelineResponse,
  // Previous
  prevViewsRes: TikTokTimelineResponse,
  prevEngagementRes: TikTokTimelineResponse,
  prevLikesRes: TikTokTimelineResponse,
  prevCommentsRes: TikTokTimelineResponse,
  prevSharesRes: TikTokTimelineResponse
): ContentPerformanceData => {
  // 1. Process Current
  const views = getValues(viewsRes);
  const engagement = getValues(engagementRes);
  const likes = sumValues(getValues(likesRes));
  const comments = sumValues(getValues(commentsRes));
  const shares = sumValues(getValues(sharesRes));
  const totalViews = sumValues(views);
  const totalInteractions = likes + comments + shares;
  const avgEngagement = avgValues(engagement);

  // 2. Process Previous
  const totalPrevViews = sumValues(getValues(prevViewsRes));
  const prevLikesVal = sumValues(getValues(prevLikesRes));
  const prevCommentsVal = sumValues(getValues(prevCommentsRes));
  const prevSharesVal = sumValues(getValues(prevSharesRes));
  const totalPrevInteractions = prevLikesVal + prevCommentsVal + prevSharesVal;
  const avgPrevEngagement = avgValues(getValues(prevEngagementRes));

  // 3. Trends
  const trendViews = calculateTrendPercentage(totalViews, totalPrevViews);
  const trendInteractions = calculateTrendPercentage(totalInteractions, totalPrevInteractions);
  const trendEngagement = calculateTrendPercentage(avgEngagement, avgPrevEngagement);

  return {
    chartData: views,
    kpis: [
      { label: 'Visualizaciones', value: totalViews.toLocaleString('es-MX'), trend: trendViews },
      { label: 'Interacciones', value: totalInteractions.toLocaleString('es-MX'), trend: trendInteractions },
      { label: 'Engagement', value: `${avgEngagement.toFixed(2)}%`, trend: trendEngagement },
    ],
    breakdown: {
      metric1: likes,
      metric2: comments,
      metric3: shares,
      metric4: 0,
    },
  };
};

export const adaptTikTokTimeline = (response: TikTokTimelineResponse): CleanMetricData[] => {
  return getValues(response);
};
