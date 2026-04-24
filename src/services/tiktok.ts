import { format } from 'date-fns';

const BASE_URL = process.env.METRICOOL_BASE_URL || 'https://app.metricool.com/api';
const BLOG_ID = process.env.METRICOOL_BLOG_ID;
const USER_ID = process.env.METRICOOL_USER_ID;
const X_MC_AUTH = process.env.X_MC_AUTH;

export interface TikTokTimelineValue {
  dateTime: string;
  value: number;
}

export interface TikTokTimelineResponse {
  data: {
    metric: string;
    values: TikTokTimelineValue[];
  }[];
}

export interface TikTokDistributionItem {
  key: string;
  value: number;
}

export interface TikTokDistributionResponse {
  data: TikTokDistributionItem[];
}

const DEFAULT_PARAMS = {
  network: 'tiktok',
  userId: USER_ID || '',
  blogId: BLOG_ID || '',
  timezone: 'America/Mexico_City',
};

// --- FUNCIÓN FETCH GENÉRICA ---
const fetchFromMetricool = async <T>(from: Date, to: Date, endpoint: 'timelines' | 'distribution', metric: string, extraParams: Record<string, string> = {}): Promise<T> => {
  const fromString = format(from, "yyyy-MM-dd'T'HH:mm:ss");
  const toString = format(to, "yyyy-MM-dd'T'HH:mm:ss");

  const params = new URLSearchParams({
    from: fromString,
    to: toString,
    metric: metric,
    ...DEFAULT_PARAMS,
    ...extraParams,
  });

  try {
    const response = await fetch(`${BASE_URL}/v2/analytics/${endpoint}?${params.toString()}`, {
      headers: {
        'X-Mc-Auth': X_MC_AUTH || '',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`[TikTok Service Error] ${endpoint}/${metric}: ${response.status} ${response.statusText}`);
      return { data: [] } as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`[TikTok Network Error] ${endpoint}/${metric}:`, error);
    return { data: [] } as T;
  }
};

//! Main KPIs

export const fetchTikTokFollowers = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'followers_count', { subject: 'account' });

export const fetchTikTokProfileViews = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'profile_views', { subject: 'account' });

export const fetchTikTokDailyNewFollowers = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'daily_new_followers', { subject: 'account' });

export const fetchTikTokDailyLostFollowers = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'daily_lost_followers', { subject: 'account' });

//! Content Metrics
export const fetchTikTokVideoViews = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'video_views', { metricType: 'account' });

export const fetchTikTokEngagement = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'engagement', { subject: 'video' });

export const fetchTikTokLikes = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'likes');

export const fetchTikTokComments = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'comments');

export const fetchTikTokShares = (from: Date, to: Date) => fetchFromMetricool<TikTokTimelineResponse>(from, to, 'timelines', 'shares');

//! Distribution Metrics
export const fetchTikTokImpressionSources = (from: Date, to: Date) => fetchFromMetricool<TikTokDistributionResponse>(from, to, 'distribution', 'impressionSources');

export const fetchTikTokCountryDistribution = (from: Date, to: Date) => fetchFromMetricool<TikTokDistributionResponse>(from, to, 'distribution', 'country', { subject: 'account' });

export const fetchTikTokGenderDistribution = (from: Date, to: Date) => fetchFromMetricool<TikTokDistributionResponse>(from, to, 'distribution', 'gender', { subject: 'account' });

export const fetchTikTokAvgVideoMetrics = (from: Date, to: Date) => fetchFromMetricool<TikTokDistributionResponse>(from, to, 'distribution', 'averageVideoViews');
