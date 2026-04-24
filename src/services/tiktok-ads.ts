import { format } from 'date-fns';

const BASE_URL = process.env.METRICOOL_BASE_URL || 'https://app.metricool.com/api';
const BLOG_ID = process.env.METRICOOL_BLOG_ID;
const USER_ID = process.env.METRICOOL_USER_ID;
const X_MC_AUTH = process.env.X_MC_AUTH;

export type TkAdsTimelineRaw = [string, string][]; // Formato: [["1771264800000", "650.22"], ...]

export interface TkAdsCampaignRaw {
  network: string;
  providerCampaignId: string;
  name: string;
  objective: string;
  updated: { dateTime: string; timezone: string };
  currency: string;
  metrics: {
    SPENT: number;
    IMPRESSIONS: number;
    CLICKS: number;
    CONVERSIONS: number;
    CPM: number;
    CTR: number;
    CPC: number;
    [key: string]: number; // Para el resto de métricas de video
  };
}

export interface TkAdsCampaignsResponse {
  data: TkAdsCampaignRaw[];
}

// --- FETCHERS BASE ---

// Fetcher para Timelines (KPIs y Eficiencia)
const fetchAdsTimeline = async (from: Date, to: Date, endpointName: string): Promise<TkAdsTimelineRaw> => {
  const start = format(from, 'yyyyMMdd');
  const end = format(to, 'yyyyMMdd');

  const params = new URLSearchParams({
    start,
    end,
    timezone: 'America/Mexico_City',
    userId: USER_ID || '',
    blogId: BLOG_ID || '',
  });

  try {
    const response = await fetch(`${BASE_URL}/stats/timeline/${endpointName}?${params.toString()}`, {
      headers: { 'X-Mc-Auth': X_MC_AUTH || '', Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`[TikTok Ads Service Error] ${endpointName}:`, error);
    return [];
  }
};

// Fetcher para Campañas (API v2)
export const fetchTikTokAdsCampaigns = async (from: Date, to: Date): Promise<TkAdsCampaignsResponse> => {
  const fromString = format(from, "yyyy-MM-dd'T'00:00:00-06:00");
  const toString = format(to, "yyyy-MM-dd'T'23:59:59-06:00");

  const params = new URLSearchParams({
    from: fromString,
    to: toString,
    timezone: 'America/Mexico_City',
    userId: USER_ID || '',
    blogId: BLOG_ID || '',
  });

  // Métricas solicitadas
  const metrics = [
    'impressions',
    'clicks',
    'conversions',
    'cpm',
    'cpc',
    'ctr',
    'spent',
    'real_time_conversion',
    'video_play_actions',
    'video_views_p25',
    'video_views_p50',
    'video_views_p75',
    'video_views_p100',
    'engaged_view_15s',
    'engaged_view',
    'profile_visits',
  ];
  metrics.forEach(m => params.append('metrics[]', m));

  try {
    const response = await fetch(`${BASE_URL}/v2/analytics/campaigns/tiktokads?${params.toString()}`, {
      headers: { 'X-Mc-Auth': X_MC_AUTH || '', Accept: 'application/json' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) throw new Error(`${response.status}`);
    return await response.json();
  } catch (error) {
    console.error(`[TikTok Ads Service Error] campaigns:`, error);
    return { data: [] };
  }
};

// --- ENDPOINTS INDIVIDUALES ---

export const fetchTkAdsCost = (from: Date, to: Date) => fetchAdsTimeline(from, to, 'tiktokAdsCost');
export const fetchTkAdsImpressions = (from: Date, to: Date) => fetchAdsTimeline(from, to, 'tiktokAdsImpressions');
export const fetchTkAdsClicks = (from: Date, to: Date) => fetchAdsTimeline(from, to, 'tiktokAdsClicks');
export const fetchTkAdsConversions = (from: Date, to: Date) => fetchAdsTimeline(from, to, 'tiktokAdsConversions');

export const fetchTkAdsCpm = (from: Date, to: Date) => fetchAdsTimeline(from, to, 'tiktokAdsCpm');
export const fetchTkAdsCpc = (from: Date, to: Date) => fetchAdsTimeline(from, to, 'tiktokAdsCpc');
export const fetchTkAdsCtr = (from: Date, to: Date) => fetchAdsTimeline(from, to, 'tiktokAdsCtr');
