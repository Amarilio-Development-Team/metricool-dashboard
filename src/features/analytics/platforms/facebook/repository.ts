import { cache } from 'react';
import { getComparisonPeriod } from '@/core/utils/date-utils';
import {
  //! Account Metrics
  fetchFacebookPageFollows,
  fetchFacebookPageMediaViews,
  fetchFacebookPageViews,
  fetchFacebookDailyFollows,
  fetchFacebookDailyUnfollows,
  fetchFacebookCityDistribution,
  fetchFacebookCountryDistribution,

  //! Post Metrics
  fetchFacebookPostImpressions,
  fetchFacebookPostClicks,
  fetchFacebookPostReactions,
  fetchFacebookPostComments,
  fetchFacebookPostShares,
  fetchFacebookPostInteractions,
  fetchFacebookPostEngagement,

  //! Reels Metrics
  fetchFacebookReelsSocialActions,
  fetchFacebookReelsLikes,
  fetchFacebookReelsPlays,

  //! Types
  FacebookTimelineResponse,
} from '@/services/facebook';

import {
  adaptFacebookTimeline,
  adaptFacebookDemographics,
  adaptFacebookEvolution,
  adaptFacebookPostsPerformance,
  adaptFacebookReelsPerformance,
  CleanMetricData,
  MetricTrendData,
  DemographicItem,
  FacebookEvolutionData,
  ContentPerformanceData,
} from './adapter';

//! HELPERS
const calculateMetricValue = (data: CleanMetricData[], type: 'sum' | 'last' | 'avg'): number => {
  if (data.length === 0) return 0;
  if (type === 'last') return data[0].value;
  const sum = data.reduce((acc, curr) => acc + curr.value, 0);
  if (type === 'avg') return sum / data.length;
  return sum;
};

const getMetricWithTrend = async (from: Date, to: Date, fetcherFn: (f: Date, t: Date) => Promise<FacebookTimelineResponse>, calcType: 'sum' | 'last' | 'avg'): Promise<MetricTrendData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(from, to);
  const [currentRes, previousRes] = await Promise.all([fetcherFn(from, to), fetcherFn(previousFrom, previousTo)]);
  const currentClean = adaptFacebookTimeline(currentRes);
  const previousClean = adaptFacebookTimeline(previousRes);

  const currentValue = calcType === 'last' ? (currentClean.length > 0 ? currentClean[currentClean.length - 1].value : 0) : calculateMetricValue(currentClean, calcType);
  const previousValue = calcType === 'last' ? (previousClean.length > 0 ? previousClean[previousClean.length - 1].value : 0) : calculateMetricValue(previousClean, calcType);

  return { value: currentValue, previousValue: previousValue };
};

//! Repositories (Legacy & Overview)

export const getFacebookFollowersRepo = cache(async (from: Date, to: Date) => {
  return getMetricWithTrend(from, to, fetchFacebookPageFollows, 'last');
});

export const getFacebookMediaViewsRepo = cache(async (from: Date, to: Date) => {
  return getMetricWithTrend(from, to, fetchFacebookPageMediaViews, 'sum');
});

export const getFacebookPageViewsRepo = cache(async (from: Date, to: Date) => {
  return getMetricWithTrend(from, to, fetchFacebookPageViews, 'sum');
});

export const getFacebookClicksRepo = cache(async (from: Date, to: Date) => {
  return getMetricWithTrend(from, to, fetchFacebookPostClicks, 'sum');
});

//! Interactions Breakdown
export interface InteractionsBreakdownData {
  reactions: MetricTrendData;
  comments: MetricTrendData;
  shares: MetricTrendData;
  clicks: MetricTrendData;
  total: MetricTrendData;
}
export const getInteractionsBreakdownRepo = cache(async (from: Date, to: Date): Promise<InteractionsBreakdownData> => {
  const [reactions, comments, shares, clicks, total] = await Promise.all([
    getMetricWithTrend(from, to, fetchFacebookPostReactions, 'sum'),
    getMetricWithTrend(from, to, fetchFacebookPostComments, 'sum'),
    getMetricWithTrend(from, to, fetchFacebookPostShares, 'sum'),
    getMetricWithTrend(from, to, fetchFacebookPostClicks, 'sum'),
    getMetricWithTrend(from, to, fetchFacebookPostInteractions, 'sum'),
  ]);
  return { reactions, comments, shares, clicks, total };
});

//! Evolution Chart
export const getEvolutionChartRepo = cache(async (from: Date, to: Date): Promise<FacebookEvolutionData[]> => {
  const [impressions, mediaViews, clicks, interactions, reactions, follows, unfollows] = await Promise.all([
    fetchFacebookPostImpressions(from, to),
    fetchFacebookPageMediaViews(from, to),
    fetchFacebookPostClicks(from, to),
    fetchFacebookPostInteractions(from, to),
    fetchFacebookPostReactions(from, to),
    fetchFacebookDailyFollows(from, to),
    fetchFacebookDailyUnfollows(from, to),
  ]);
  return adaptFacebookEvolution(impressions, mediaViews, clicks, interactions, reactions, follows, unfollows);
});

//! Demographics
export interface DemographicsRepoData {
  cities: DemographicItem[];
  countries: DemographicItem[];
}
export const getDemographicsRepo = cache(async (from: Date, to: Date): Promise<DemographicsRepoData> => {
  const [citiesRes, countriesRes] = await Promise.all([fetchFacebookCityDistribution(from, to), fetchFacebookCountryDistribution(from, to)]);
  return {
    cities: adaptFacebookDemographics(citiesRes, false),
    countries: adaptFacebookDemographics(countriesRes, true),
  };
});

//! Community Balance
export interface CommunityBalanceData {
  totals: { gained: number; lost: number; net: number };
}
export const getCommunityBalanceRepo = cache(async (from: Date, to: Date): Promise<CommunityBalanceData> => {
  const [followsRes, unfollowsRes] = await Promise.all([fetchFacebookDailyFollows(from, to), fetchFacebookDailyUnfollows(from, to)]);
  const followsData = adaptFacebookTimeline(followsRes);
  const unfollowsData = adaptFacebookTimeline(unfollowsRes);
  const totalGained = calculateMetricValue(followsData, 'sum');
  const totalLost = calculateMetricValue(unfollowsData, 'sum');
  return {
    totals: { gained: totalGained, lost: totalLost, net: totalGained - totalLost },
  };
});

//! Widgets
export const getFacebookPostsPerformanceRepo = cache(async (from: Date, to: Date): Promise<ContentPerformanceData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(from, to);

  const [impressions, interactions, engagement, clicks, shares, comments, reactions, prevImpressions, prevInteractions, prevEngagement] = await Promise.all([
    fetchFacebookPostImpressions(from, to),
    fetchFacebookPostInteractions(from, to),
    fetchFacebookPostEngagement(from, to),
    fetchFacebookPostClicks(from, to),
    fetchFacebookPostShares(from, to),
    fetchFacebookPostComments(from, to),
    fetchFacebookPostReactions(from, to),
    fetchFacebookPostImpressions(previousFrom, previousTo),
    fetchFacebookPostInteractions(previousFrom, previousTo),
    fetchFacebookPostEngagement(previousFrom, previousTo),
  ]);

  return adaptFacebookPostsPerformance(impressions, interactions, engagement, clicks, shares, comments, reactions, prevImpressions, prevInteractions, prevEngagement);
});

export const getFacebookReelsPerformanceRepo = cache(async (from: Date, to: Date): Promise<ContentPerformanceData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(from, to);

  const [plays, likes, socialActions, prevPlays, prevLikes, prevSocialActions] = await Promise.all([
    fetchFacebookReelsPlays(from, to),
    fetchFacebookReelsLikes(from, to),
    fetchFacebookReelsSocialActions(from, to),
    fetchFacebookReelsPlays(previousFrom, previousTo),
    fetchFacebookReelsLikes(previousFrom, previousTo),
    fetchFacebookReelsSocialActions(previousFrom, previousTo),
  ]);

  return adaptFacebookReelsPerformance(plays, likes, socialActions, prevPlays, prevLikes, prevSocialActions);
});
