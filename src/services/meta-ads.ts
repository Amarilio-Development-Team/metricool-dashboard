'use server';

import { formatMetricoolDate } from '@/core/utils/date-utils';

export type MetricoolTimelineResponse = [string, string][];

export interface MetaAdsCampaignRaw {
  providerCampaignId: string | number;
  name: string;
  objective: string;
  status: string;
  spent: number | null;
  impressions: number | null;
  clicks: number | null;
  conversions: number | null;
  cpm: number | null;
  cpc: number | null;
  ctr: number | null;
  results: number | null;
  resultsLabel: string | null;
}

const BASE_URL = process.env.METRICOOL_BASE_URL;
const BLOG_ID = process.env.METRICOOL_BLOG_ID;
const USER_ID = process.env.METRICOOL_USER_ID;
const X_MC_AUTH = process.env.X_MC_AUTH;

const fetchGeneric = async (url: string): Promise<MetricoolTimelineResponse> => {
  const response = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json', 'X-Mc-Auth': X_MC_AUTH || '' },
    next: { revalidate: 3600 },
  });
  if (!response.ok) return [];
  return response.json();
};

export const fetchMetaAdsImpressions = async (start: Date, end: Date): Promise<MetricoolTimelineResponse> => {
  const s = formatMetricoolDate(start);
  const e = formatMetricoolDate(end);
  return fetchGeneric(`${BASE_URL}/stats/timeline/impressions?start=${s}&end=${e}&timezone=America%2FMexico_City&userId=${USER_ID}&blogId=${BLOG_ID}`);
};

export const fetchMetaAdsSpend = async (start: Date, end: Date): Promise<MetricoolTimelineResponse> => {
  const s = formatMetricoolDate(start);
  const e = formatMetricoolDate(end);
  return fetchGeneric(`${BASE_URL}/stats/timeline/spend?start=${s}&end=${e}&timezone=America%2FMexico_City&userId=${USER_ID}&blogId=${BLOG_ID}`);
};

export const fetchMetaAdsClicksValue = async (start: Date, end: Date): Promise<MetricoolTimelineResponse> => {
  const s = formatMetricoolDate(start);
  const e = formatMetricoolDate(end);
  return fetchGeneric(`${BASE_URL}/stats/timeline/clicks?start=${s}&end=${e}&timezone=America%2FMexico_City&userId=${USER_ID}&blogId=${BLOG_ID}`);
};

export const fetchMetaAdsReachValue = async (start: Date, end: Date): Promise<number> => {
  const s = formatMetricoolDate(start);
  const e = formatMetricoolDate(end);
  const url = `${BASE_URL}/stats/facebookads/metricvalue?start=${s}&end=${e}&timezone=America%2FMexico_City&metric=reach&userId=${USER_ID}&blogId=${BLOG_ID}`;

  const response = await fetch(url, {
    headers: { Accept: 'application/json', 'X-Mc-Auth': X_MC_AUTH || '' },
    next: { revalidate: 3600 },
  });

  if (!response.ok) return 0;
  const value = await response.json();
  return Number(value);
};

export const fetchMetaAdsCampaigns = async (start: Date, end: Date): Promise<MetaAdsCampaignRaw[]> => {
  const s = formatMetricoolDate(start);
  const e = formatMetricoolDate(end);
  const url = `${BASE_URL}/stats/facebookads/campaigns?start=${s}&end=${e}&userId=${USER_ID}&blogId=${BLOG_ID}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json', 'X-Mc-Auth': X_MC_AUTH || '' },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error(`[Meta Ads Campaigns Error]: ${response.status} ${response.statusText}`);
      return [];
    }

    return await response.json();
  } catch (error) {
    console.error(`[Meta Ads Network Error] campaigns:`, error);
    return [];
  }
};

export const fetchMetaAdsCpm = async (start: Date, end: Date): Promise<MetricoolTimelineResponse> => {
  const s = formatMetricoolDate(start);
  const e = formatMetricoolDate(end);
  return fetchGeneric(`${BASE_URL}/stats/timeline/cpm?start=${s}&end=${e}&timezone=America%2FMexico_City&userId=${USER_ID}&blogId=${BLOG_ID}`);
};

export const fetchMetaAdsCpc = async (start: Date, end: Date): Promise<MetricoolTimelineResponse> => {
  const s = formatMetricoolDate(start);
  const e = formatMetricoolDate(end);
  return fetchGeneric(`${BASE_URL}/stats/timeline/cpc?start=${s}&end=${e}&timezone=America%2FMexico_City&userId=${USER_ID}&blogId=${BLOG_ID}`);
};

export const fetchMetaAdsCtr = async (start: Date, end: Date): Promise<MetricoolTimelineResponse> => {
  const s = formatMetricoolDate(start);
  const e = formatMetricoolDate(end);
  return fetchGeneric(`${BASE_URL}/stats/timeline/ctr?start=${s}&end=${e}&timezone=America%2FMexico_City&userId=${USER_ID}&blogId=${BLOG_ID}`);
};
