'use server';

import { formatISO } from 'date-fns';

const BASE_URL = process.env.METRICOOL_BASE_URL || 'https://app.metricool.com/api';
const BLOG_ID = process.env.METRICOOL_BLOG_ID;
const USER_ID = process.env.METRICOOL_USER_ID;
const X_MC_AUTH = process.env.X_MC_AUTH;

export interface FacebookTimelineResponse {
  data: {
    metric: string;
    values: {
      dateTime: string;
      value: number;
    }[];
  }[];
}

export interface FacebookDistributionItem {
  key: string;
  value: number;
}

export interface FacebookDistributionResponse {
  data: FacebookDistributionItem[];
}

//! Fetch Metricool Generic
const fetchMetricool = async <T>(endpoint: string, params: Record<string, string>): Promise<T> => {
  const queryParams = new URLSearchParams({
    ...params,
    network: 'facebook',
    timezone: 'America/Mexico_City',
    userId: USER_ID || '',
    blogId: BLOG_ID || '',
  });

  const url = `${BASE_URL}/v2/analytics/${endpoint}?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'X-Mc-Auth': X_MC_AUTH || '',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Metricool API Error [${endpoint}]: ${response.status}`, errorText);
      throw new Error(`Metricool API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Fetch Error in ${endpoint}:`, error);
    throw error;
  }
};

const fetchTimeline = async (from: Date, to: Date, metric: string, subject: 'account' | 'posts' | 'reels' = 'account'): Promise<FacebookTimelineResponse> => {
  return fetchMetricool<FacebookTimelineResponse>('timelines', {
    from: formatISO(from),
    to: formatISO(to),
    metric,
    subject,
  });
};

//! Account Metrics
export const fetchFacebookPageFollows = async (from: Date, to: Date) => fetchTimeline(from, to, 'pageFollows', 'account');
export const fetchFacebookPageMediaViews = async (from: Date, to: Date) => fetchTimeline(from, to, 'page_media_view', 'account');
export const fetchFacebookPageViews = async (from: Date, to: Date) => fetchTimeline(from, to, 'pageViews', 'account');
export const fetchFacebookDailyFollows = async (from: Date, to: Date) => fetchTimeline(from, to, 'page_daily_follows_unique', 'account');
export const fetchFacebookDailyUnfollows = async (from: Date, to: Date) => fetchTimeline(from, to, 'page_daily_unfollows_unique', 'account');

//! Posts Metrics
export const fetchFacebookPostImpressions = async (from: Date, to: Date) => fetchTimeline(from, to, 'impressions', 'posts');

export const fetchFacebookPostClicks = async (from: Date, to: Date) => fetchTimeline(from, to, 'clicks', 'posts');

export const fetchFacebookPostReactions = async (from: Date, to: Date) => fetchTimeline(from, to, 'reactions', 'posts');

export const fetchFacebookPostComments = async (from: Date, to: Date) => fetchTimeline(from, to, 'comments', 'posts');

export const fetchFacebookPostShares = async (from: Date, to: Date) => fetchTimeline(from, to, 'shares', 'posts');

export const fetchFacebookPostInteractions = async (from: Date, to: Date) => fetchTimeline(from, to, 'interactions', 'posts');

export const fetchFacebookPostEngagement = async (from: Date, to: Date) => fetchTimeline(from, to, 'engagement', 'posts');

//! Reels Metrics
export const fetchFacebookReelsSocialActions = async (from: Date, to: Date) => fetchTimeline(from, to, 'post_video_social_actions', 'reels');

export const fetchFacebookReelsLikes = async (from: Date, to: Date) => fetchTimeline(from, to, 'post_video_likes_by_reaction_type', 'reels');

export const fetchFacebookReelsPlays = async (from: Date, to: Date) => fetchTimeline(from, to, 'blue_reels_play_count', 'reels');

//! Distribution Metrics
const fetchDistribution = async (from: Date, to: Date, metric: string): Promise<FacebookDistributionResponse> => {
  return fetchMetricool<FacebookDistributionResponse>('distribution', {
    from: formatISO(from),
    to: formatISO(to),
    metric,
    subject: 'account',
  });
};

export const fetchFacebookCityDistribution = async (from: Date, to: Date) => fetchDistribution(from, to, 'page_follows_city');
export const fetchFacebookCountryDistribution = async (from: Date, to: Date) => fetchDistribution(from, to, 'page_follows_country');
