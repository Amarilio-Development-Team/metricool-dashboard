import { format } from 'date-fns';

const BASE_URL = process.env.METRICOOL_BASE_URL || 'https://app.metricool.com/api';
const BLOG_ID = process.env.METRICOOL_BLOG_ID;
const USER_ID = process.env.METRICOOL_USER_ID;
const X_MC_AUTH = process.env.X_MC_AUTH;

export interface InstagramTimelineValue {
  dateTime: string;
  value: number;
}

export interface InstagramTimelineResponse {
  data: {
    metric: string;
    values: InstagramTimelineValue[];
  }[];
}

export interface InstagramDistributionItem {
  key: string;
  value: number;
}

export interface InstagramDistributionResponse {
  data: InstagramDistributionItem[];
}

export type InstagramMetricType = 'followers' | 'reach' | 'impressions' | 'profile_views' | 'views' | 'delta_followers';
export type InstagramDistributionType = 'city' | 'country' | 'gender' | 'age';

const DEFAULT_PARAMS = {
  network: 'instagram',
  subject: 'account',
  userId: USER_ID || '',
  blogId: BLOG_ID || '',
  timezone: 'America/Mexico_City',
};

// --- FUNCIÓN FETCH CORREGIDA ---
const fetchFromMetricool = async <T>(
  from: Date,
  to: Date,
  // CORRECCIÓN: El endpoint SOLO puede ser 'timelines' o 'distribution'
  // El nombre de la métrica ('shares', 'likes') va en el parámetro 'metric', no aquí.
  endpoint: 'timelines' | 'distribution',
  metric: string,
  subject: 'account' | 'posts' | 'reels' = 'account'
): Promise<T> => {
  const fromString = format(from, "yyyy-MM-dd'T'HH:mm:ss");
  const toString = format(to, "yyyy-MM-dd'T'HH:mm:ss");

  const params = new URLSearchParams({
    from: fromString,
    to: toString,
    metric: metric,
    ...DEFAULT_PARAMS,
    subject: subject,
  });

  try {
    // Ahora la URL siempre será .../v2/analytics/timelines?... o .../distribution?...
    const response = await fetch(`${BASE_URL}/v2/analytics/${endpoint}?${params.toString()}`, {
      headers: {
        'X-Mc-Auth': X_MC_AUTH || '',
        Accept: 'application/json',
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`[Metricool Service Error] ${endpoint}/${metric}: ${response.status} ${response.statusText}`);
      return { data: [] } as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`[Metricool Network Error] ${endpoint}/${metric}:`, error);
    return { data: [] } as T;
  }
};

//! Timelines (Account Level)
export const fetchInstagramMetric = async (from: Date, to: Date, metric: InstagramMetricType): Promise<InstagramTimelineResponse> => {
  return fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', metric, 'account');
};

//! Delta followers
export const fetchInstagramDeltaFollowers = async (from: Date, to: Date): Promise<InstagramTimelineResponse> => {
  return fetchInstagramMetric(from, to, 'delta_followers');
};

//! Distributions
export const fetchInstagramDistribution = async (from: Date, to: Date, metric: InstagramDistributionType): Promise<InstagramDistributionResponse> => {
  return fetchFromMetricool<InstagramDistributionResponse>(from, to, 'distribution', metric, 'account');
};

export const fetchInstagramCityDistribution = (from: Date, to: Date) => fetchInstagramDistribution(from, to, 'city');
export const fetchInstagramCountryDistribution = (from: Date, to: Date) => fetchInstagramDistribution(from, to, 'country');
export const fetchInstagramGenderDistribution = (from: Date, to: Date) => fetchInstagramDistribution(from, to, 'gender');
export const fetchInstagramAgeDistribution = (from: Date, to: Date) => fetchInstagramDistribution(from, to, 'age');

// ==========================================
// MÉTRICAS DE POSTS (subject='posts')
// ==========================================
// Nota: Observa que el 3er argumento SIEMPRE es 'timelines'

export const fetchIgPostImpressions = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'impressions', 'posts');

export const fetchIgPostInteractions = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'interactions', 'posts');

export const fetchIgPostEngagement = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'engagement', 'posts');

export const fetchIgPostLikes = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'likes', 'posts');

export const fetchIgPostComments = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'comments', 'posts');

export const fetchIgPostShares = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'shares', 'posts');

export const fetchIgPostSaved = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'saved', 'posts');

// ==========================================
// MÉTRICAS DE REELS (subject='reels')
// ==========================================

export const fetchIgReelsViews = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'views', 'reels');

export const fetchIgReelsInteractions = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'interactions', 'reels');

export const fetchIgReelsEngagement = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'engagement', 'reels');

export const fetchIgReelsLikes = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'likes', 'reels');

export const fetchIgReelsComments = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'comments', 'reels');

export const fetchIgReelsShares = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'shares', 'reels');

export const fetchIgReelsSaved = (from: Date, to: Date) => fetchFromMetricool<InstagramTimelineResponse>(from, to, 'timelines', 'saved', 'reels');
