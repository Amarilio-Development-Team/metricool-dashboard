import { cache } from 'react';
import { getComparisonPeriod } from '@/core/utils/date-utils';
import {
  fetchInstagramMetric,
  fetchInstagramCityDistribution,
  fetchInstagramCountryDistribution,
  fetchInstagramGenderDistribution,
  fetchInstagramAgeDistribution,
  fetchInstagramDeltaFollowers,
  InstagramMetricType,
  fetchIgPostImpressions,
  fetchIgPostInteractions,
  fetchIgPostEngagement,
  fetchIgPostLikes,
  fetchIgPostComments,
  fetchIgPostShares,
  fetchIgPostSaved,
  // NUEVOS IMPORTS DE REELS
  fetchIgReelsViews,
  fetchIgReelsInteractions,
  fetchIgReelsEngagement,
  fetchIgReelsLikes,
  fetchIgReelsComments,
  fetchIgReelsShares,
  fetchIgReelsSaved,
} from '@/services/instagram';

import {
  adaptInstagramTimeline,
  adaptInstagramDemographics,
  adaptInstagramGender,
  adaptInstagramAge,
  // NUEVOS ADAPTADORES
  adaptIgPostsPerformance,
  adaptIgReelsPerformance,
  CleanMetricData,
  DemographicItem,
  GenderChartItem,
  AgeChartItem,
  ContentPerformanceData,
} from './adapter';

//! --- Interfaces ---

export interface MetricTrendData {
  value: number;
  previousValue: number;
}

//! --- Calculation helpers ---

const calculateMetricValue = (data: CleanMetricData[], type: 'sum' | 'last' | 'avg'): number => {
  if (data.length === 0) return 0;

  if (type === 'last') {
    return data[0].value;
  }

  const sum = data.reduce((acc, curr) => acc + curr.value, 0);

  if (type === 'avg') {
    return sum / data.length;
  }

  return sum;
};

//! Manages the logic of comparison automatically
const getMetricWithTrend = async (from: Date, to: Date, metric: InstagramMetricType, calcType: 'sum' | 'last' | 'avg'): Promise<MetricTrendData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(from, to);

  const [currentRes, previousRes] = await Promise.all([fetchInstagramMetric(from, to, metric), fetchInstagramMetric(previousFrom, previousTo, metric)]);

  const currentClean = adaptInstagramTimeline(currentRes);
  const previousClean = adaptInstagramTimeline(previousRes);

  return {
    value: calculateMetricValue(currentClean.reverse(), calcType),
    previousValue: calculateMetricValue(previousClean.reverse(), calcType),
  };
};

//! --- Main KPIs ---

export const getIgFollowersRepo = cache(async (from: Date, to: Date): Promise<MetricTrendData> => {
  return getMetricWithTrend(from, to, 'followers', 'last');
});

export const getIgReachRepo = cache(async (from: Date, to: Date): Promise<MetricTrendData> => {
  return getMetricWithTrend(from, to, 'reach', 'sum');
});

export const getIgReachAverageRepo = cache(async (from: Date, to: Date): Promise<MetricTrendData> => {
  return getMetricWithTrend(from, to, 'reach', 'avg');
});

export const getIgImpressionsRepo = cache(async (from: Date, to: Date): Promise<MetricTrendData> => {
  return getMetricWithTrend(from, to, 'impressions', 'sum');
});

export const getIgMediaViewsRepo = cache(async (from: Date, to: Date): Promise<MetricTrendData> => {
  return getMetricWithTrend(from, to, 'views', 'sum');
});

export const getIgProfileViewsRepo = cache(async (from: Date, to: Date): Promise<MetricTrendData> => {
  return getMetricWithTrend(from, to, 'profile_views', 'sum');
});

//! --- Evolution (Graph) ---

export interface IgEvolutionData {
  date: string;
  followers: number;
  reach: number;
  impressions: number;
  profileViews: number;
}

export const getIgEvolutionRepo = cache(async (from: Date, to: Date): Promise<IgEvolutionData[]> => {
  const [followersRes, reachRes, impressionsRes, profileViewsRes] = await Promise.all([
    fetchInstagramMetric(from, to, 'followers'),
    fetchInstagramMetric(from, to, 'reach'),
    fetchInstagramMetric(from, to, 'impressions'),
    fetchInstagramMetric(from, to, 'profile_views'),
  ]);

  const followersData = adaptInstagramTimeline(followersRes);
  const reachData = adaptInstagramTimeline(reachRes);
  const impressionsData = adaptInstagramTimeline(impressionsRes);
  const profileViewsData = adaptInstagramTimeline(profileViewsRes);

  const dataMap = new Map<string, IgEvolutionData>();

  const getOrInitEntry = (date: string): IgEvolutionData => {
    if (!dataMap.has(date)) {
      dataMap.set(date, { date, followers: 0, reach: 0, impressions: 0, profileViews: 0 });
    }
    return dataMap.get(date)!;
  };

  followersData.forEach(i => (getOrInitEntry(i.date).followers = i.value));
  reachData.forEach(i => (getOrInitEntry(i.date).reach = i.value));
  impressionsData.forEach(i => (getOrInitEntry(i.date).impressions = i.value));
  profileViewsData.forEach(i => (getOrInitEntry(i.date).profileViews = i.value));

  return Array.from(dataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

//! --- Demographics and age/gender ---

export interface AgeGenderData {
  gender: GenderChartItem[];
  age: AgeChartItem[];
}

export const getIgAgeGenderRepo = cache(async (from: Date, to: Date): Promise<AgeGenderData> => {
  const [genderRes, ageRes] = await Promise.all([fetchInstagramGenderDistribution(from, to), fetchInstagramAgeDistribution(from, to)]);

  return {
    gender: adaptInstagramGender(genderRes),
    age: adaptInstagramAge(ageRes),
  };
});

export interface DemographicsData {
  cities: DemographicItem[];
  countries: DemographicItem[];
}

export const getIgDemographicsRepo = cache(async (from: Date, to: Date): Promise<DemographicsData> => {
  const [citiesRes, countriesRes] = await Promise.all([fetchInstagramCityDistribution(from, to), fetchInstagramCountryDistribution(from, to)]);

  return {
    cities: adaptInstagramDemographics(citiesRes, false),
    countries: adaptInstagramDemographics(countriesRes, true),
  };
});

//! --- Community balance ---

export interface CommunityBalanceData {
  totals: {
    gained: number;
    lost: number;
    net: number;
  };
}

export const getIgCommunityBalanceRepo = cache(async (from: Date, to: Date): Promise<CommunityBalanceData> => {
  const rawResponse = await fetchInstagramDeltaFollowers(from, to);
  const cleanData = adaptInstagramTimeline(rawResponse);

  let totalGained = 0;
  let totalLost = 0;

  cleanData.forEach(day => {
    if (day.value > 0) {
      totalGained += day.value;
    } else if (day.value < 0) {
      totalLost += Math.abs(day.value);
    }
  });

  return {
    totals: {
      gained: totalGained,
      lost: totalLost,
      net: totalGained - totalLost,
    },
  };
});

export const getIgPostsPerformanceRepo = cache(async (from: Date, to: Date): Promise<ContentPerformanceData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(from, to);

  const [
    // Current
    impressions,
    interactions,
    engagement,
    likes,
    comments,
    shares,
    saved,
    // Previous (Solo KPIs)
    prevImpressions,
    prevInteractions,
    prevEngagement,
  ] = await Promise.all([
    fetchIgPostImpressions(from, to),
    fetchIgPostInteractions(from, to),
    fetchIgPostEngagement(from, to),
    fetchIgPostLikes(from, to),
    fetchIgPostComments(from, to),
    fetchIgPostShares(from, to),
    fetchIgPostSaved(from, to),
    // Fetch Prev
    fetchIgPostImpressions(previousFrom, previousTo),
    fetchIgPostInteractions(previousFrom, previousTo),
    fetchIgPostEngagement(previousFrom, previousTo),
  ]);

  return adaptIgPostsPerformance(impressions, interactions, engagement, likes, comments, shares, saved, prevImpressions, prevInteractions, prevEngagement);
});

export const getIgReelsPerformanceRepo = cache(async (from: Date, to: Date): Promise<ContentPerformanceData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(from, to);

  const [
    // Current
    views,
    interactions,
    engagement,
    likes,
    comments,
    shares,
    saved,
    // Previous
    prevViews,
    prevInteractions,
    prevEngagement,
  ] = await Promise.all([
    fetchIgReelsViews(from, to),
    fetchIgReelsInteractions(from, to),
    fetchIgReelsEngagement(from, to),
    fetchIgReelsLikes(from, to),
    fetchIgReelsComments(from, to),
    fetchIgReelsShares(from, to),
    fetchIgReelsSaved(from, to),
    // Fetch Prev
    fetchIgReelsViews(previousFrom, previousTo),
    fetchIgReelsInteractions(previousFrom, previousTo),
    fetchIgReelsEngagement(previousFrom, previousTo),
  ]);

  return adaptIgReelsPerformance(views, interactions, engagement, likes, comments, shares, saved, prevViews, prevInteractions, prevEngagement);
});
