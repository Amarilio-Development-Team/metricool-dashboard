import { cache } from 'react';
import { getComparisonPeriod } from '@/core/utils/date-utils';
import {
  fetchTikTokVideoViews,
  fetchTikTokEngagement,
  fetchTikTokLikes,
  fetchTikTokComments,
  fetchTikTokShares,
  fetchTikTokFollowers,
  fetchTikTokProfileViews,
  fetchTikTokImpressionSources,
  fetchTikTokCountryDistribution,
  fetchTikTokGenderDistribution,
  fetchTikTokDailyNewFollowers,
  fetchTikTokDailyLostFollowers,
  fetchTikTokAvgVideoMetrics,
  TikTokDistributionItem,
} from '@/services/tiktok';

import {
  adaptTikTokPerformance,
  getValues,
  TrafficSourceData,
  TkDemographicsData,
  CommunityBalanceData,
  TkEvolutionData,
  ContentPerformanceData,
  CleanMetricData,
  DemographicItem,
  VideoPerformanceData,
} from './adapter';

//! Internal Helpers
const getSum = (values: CleanMetricData[]): number => {
  return values.reduce((acc, curr) => acc + curr.value, 0);
};

const getLast = (values: CleanMetricData[]): number => {
  return values.length > 0 ? values[values.length - 1].value : 0;
};

const getAvg = (values: CleanMetricData[]): number => {
  return values.length > 0 ? getSum(values) / values.length : 0;
};

//! Main Performance Repository
export const getTikTokContentPerformanceRepo = cache(async (from: Date, to: Date): Promise<ContentPerformanceData> => {
  const { previousFrom, previousTo } = getComparisonPeriod(from, to);

  const [
    // Current
    views,
    engagement,
    likes,
    comments,
    shares,
    // Previous
    prevViews,
    prevEngagement,
    prevLikes,
    prevComments,
    prevShares,
  ] = await Promise.all([
    fetchTikTokVideoViews(from, to),
    fetchTikTokEngagement(from, to),
    fetchTikTokLikes(from, to),
    fetchTikTokComments(from, to),
    fetchTikTokShares(from, to),
    // Fetch Prev
    fetchTikTokVideoViews(previousFrom, previousTo),
    fetchTikTokEngagement(previousFrom, previousTo),
    fetchTikTokLikes(previousFrom, previousTo),
    fetchTikTokComments(previousFrom, previousTo),
    fetchTikTokShares(previousFrom, previousTo),
  ]);

  return adaptTikTokPerformance(views, engagement, likes, comments, shares, prevViews, prevEngagement, prevLikes, prevComments, prevShares);
});

//! Individual Repositories (Legacy / KPIs)
export const getTkVideoViewsRepo = cache(async (from: Date, to: Date): Promise<number> => {
  const res = await fetchTikTokVideoViews(from, to);
  return getSum(getValues(res));
});

export const getTkEngagementRepo = cache(async (from: Date, to: Date): Promise<number> => {
  const res = await fetchTikTokEngagement(from, to);
  return getAvg(getValues(res));
});

export const getTkLikesRepo = cache(async (from: Date, to: Date): Promise<number> => {
  const res = await fetchTikTokLikes(from, to);
  return getSum(getValues(res));
});

export const getTkCommentsRepo = cache(async (from: Date, to: Date): Promise<number> => {
  const res = await fetchTikTokComments(from, to);
  return getSum(getValues(res));
});

export const getTkSharesRepo = cache(async (from: Date, to: Date): Promise<number> => {
  const res = await fetchTikTokShares(from, to);
  return getSum(getValues(res));
});

export const getTkFollowersRepo = cache(async (from: Date, to: Date): Promise<number> => {
  const res = await fetchTikTokFollowers(from, to);
  return getLast(getValues(res));
});

export const getTkProfileViewsRepo = cache(async (from: Date, to: Date): Promise<number> => {
  const res = await fetchTikTokProfileViews(from, to);
  return getSum(getValues(res));
});

//! Evolution Charts
export const getTkEvolutionRepo = cache(async (from: Date, to: Date): Promise<TkEvolutionData[]> => {
  const [followersRes, viewsRes] = await Promise.all([fetchTikTokFollowers(from, to), fetchTikTokVideoViews(from, to)]);

  const followers = getValues(followersRes);
  const views = getValues(viewsRes);
  const dataMap = new Map<string, TkEvolutionData>();

  followers.forEach(f => {
    dataMap.set(f.date, { date: f.date, followers: f.value, videoViews: 0 });
  });

  views.forEach(v => {
    if (dataMap.has(v.date)) {
      dataMap.get(v.date)!.videoViews = v.value;
    } else {
      dataMap.set(v.date, { date: v.date, followers: 0, videoViews: v.value });
    }
  });

  return Array.from(dataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
});

export const getTkTrafficSourcesRepo = cache(async (from: Date, to: Date): Promise<TrafficSourceData[]> => {
  const res = await fetchTikTokImpressionSources(from, to);
  const data = res.data || [];

  const nameMapping: Record<string, string> = {
    FOR_YOU: 'Para ti',
    PERSONAL_PROFILE: 'Perfil',
    FOLLOW: 'Seguidores',
    SEARCH: 'Búsqueda',
    SOUND: 'Sonido',
  };

  return data
    .filter(item => item.value > 0)
    .map(item => ({
      name: nameMapping[item.key] || item.key,
      key: item.key,
      value: item.value,
    }))
    .sort((a, b) => b.value - a.value);
});

//! Demographics
export const getTkDemographicsRepo = cache(async (from: Date, to: Date): Promise<TkDemographicsData> => {
  const [countryRes, genderRes] = await Promise.all([fetchTikTokCountryDistribution(from, to), fetchTikTokGenderDistribution(from, to)]);

  const processCountries = (items: TikTokDistributionItem[]): DemographicItem[] => {
    const sorted = items.filter(i => i.value > 0).sort((a, b) => b.value - a.value);
    const top5 = sorted.slice(0, 5);
    const others = sorted.slice(5);
    const othersValue = others.reduce((acc, curr) => acc + curr.value, 0);

    const result: DemographicItem[] = top5.map(item => ({
      name: item.key === 'OTHERS' ? 'Otros' : item.key,
      code: item.key === 'OTHERS' ? undefined : item.key,
      percentage: item.value,
    }));

    if (othersValue > 0) {
      result.push({ name: 'Otros', percentage: othersValue, code: undefined });
    }
    return result;
  };

  //! Gender mapping
  const genderMap: Record<string, string> = {
    M: 'Hombres',
    F: 'Mujeres',
    U: 'Desconocido',
  };

  const processGender = (items: TikTokDistributionItem[]) => {
    return items
      .filter(i => i.value > 0)
      .map(item => ({
        name: genderMap[item.key] || item.key,
        value: item.value,
      }))
      .sort((a, b) => b.value - a.value);
  };

  return {
    countries: processCountries(countryRes.data || []),
    gender: processGender(genderRes.data || []),
  };
});

export const getTkCommunityBalanceRepo = cache(async (from: Date, to: Date): Promise<CommunityBalanceData> => {
  const [newRes, lostRes] = await Promise.all([fetchTikTokDailyNewFollowers(from, to), fetchTikTokDailyLostFollowers(from, to)]);

  const gained = getSum(getValues(newRes));
  const lost = getSum(getValues(lostRes));

  return {
    totals: {
      gained,
      lost,
      net: gained - lost,
    },
  };
});

//! Video Performance
export const getTkVideoPerformanceRepo = cache(async (from: Date, to: Date): Promise<VideoPerformanceData> => {
  const res = await fetchTikTokAvgVideoMetrics(from, to);
  const data = res.data || [];

  const findValue = (key: string): number => {
    const item = data.find(i => i.key === key);
    if (!item || item.value === undefined || item.value === null) return 0;
    return Number(item.value);
  };

  return {
    avgWatchTime: findValue('averageTimeWatched'),
    avgDuration: findValue('averageVideoDuration'),
  };
});
