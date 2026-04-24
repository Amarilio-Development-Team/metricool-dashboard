import { FacebookTimelineResponse, FacebookDistributionResponse, FacebookDistributionItem } from '@/services/facebook';

export interface CleanMetricData {
  date: string;
  value: number;
}

export interface MetricTrendData {
  value: number;
  previousValue: number;
}

export interface DemographicItem {
  name: string;
  code?: string;
  percentage: number;
}

export interface ContentPerformanceKpi {
  label: string;
  value: string | number;
  trend?: number;
}

export interface FacebookChartData {
  date: string;
  impressions: number;
  interactions: number;
  engagementRate?: number;
}

export interface ContentPerformanceData {
  chartData: FacebookChartData[];
  kpis: ContentPerformanceKpi[];
  breakdown: {
    metric1: number;
    metric2: number;
    metric3: number;
    metric4: number;
  };
}

export interface FacebookEvolutionData {
  date: string;
  impressions: number;
  mediaViews: number;
  clicks: number;
  interactions: number;
  reactions: number;
  follows: number;
  unfollows: number;
}

//! Helpers
const calculateTrendPercentage = (current: number, previous: number): number => {
  if (previous === 0) {
    return current > 0 ? 100 : 0;
  }
  return ((current - previous) / previous) * 100;
};

const getValues = (response: FacebookTimelineResponse): CleanMetricData[] => {
  const rawValues = response?.data?.[0]?.values;
  if (!rawValues || !Array.isArray(rawValues)) return [];
  return rawValues
    .map(item => ({
      date: item.dateTime,
      value: item.value || 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

const sumValues = (data: CleanMetricData[]) => data.reduce((acc, curr) => acc + curr.value, 0);
const avgValues = (data: CleanMetricData[]) => (data.length ? sumValues(data) / data.length : 0);

//! Helper to merge two timelines in one for the chart
const mergeTimelineData = (datesSource: CleanMetricData[], metric1: CleanMetricData[], metric2: CleanMetricData[]): FacebookChartData[] => {
  const map1 = new Map(metric1.map(i => [i.date, i.value]));
  const map2 = new Map(metric2.map(i => [i.date, i.value]));

  return datesSource.map(item => ({
    date: item.date,
    impressions: map1.get(item.date) || 0,
    interactions: map2.get(item.date) || 0,
  }));
};

export const calculateTrend = calculateTrendPercentage;

export const adaptFacebookTimeline = (response: FacebookTimelineResponse): CleanMetricData[] => {
  return getValues(response);
};

export const adaptFacebookDemographics = (response: FacebookDistributionResponse, isCountry: boolean = false): DemographicItem[] => {
  const data = response?.data || [];
  return data
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map((item: FacebookDistributionItem) => {
      let name = item.key;
      if (!isCountry && name.includes(',')) {
        name = name.split(',')[0];
      }
      return {
        name: name,
        code: isCountry ? item.key : undefined,
        percentage: item.value,
      };
    });
};

export const adaptFacebookEvolution = (
  impressions: FacebookTimelineResponse,
  mediaViews: FacebookTimelineResponse,
  clicks: FacebookTimelineResponse,
  interactions: FacebookTimelineResponse,
  reactions: FacebookTimelineResponse,
  follows: FacebookTimelineResponse,
  unfollows: FacebookTimelineResponse
): FacebookEvolutionData[] => {
  const dataMap = new Map<string, FacebookEvolutionData>();

  const getOrInitEntry = (date: string): FacebookEvolutionData => {
    if (!dataMap.has(date)) {
      dataMap.set(date, {
        date,
        impressions: 0,
        mediaViews: 0,
        clicks: 0,
        interactions: 0,
        reactions: 0,
        follows: 0,
        unfollows: 0,
      });
    }
    return dataMap.get(date)!;
  };

  getValues(impressions).forEach(i => (getOrInitEntry(i.date).impressions = i.value));
  getValues(mediaViews).forEach(i => (getOrInitEntry(i.date).mediaViews = i.value));
  getValues(clicks).forEach(i => (getOrInitEntry(i.date).clicks = i.value));
  getValues(interactions).forEach(i => (getOrInitEntry(i.date).interactions = i.value));
  getValues(reactions).forEach(i => (getOrInitEntry(i.date).reactions = i.value));
  getValues(follows).forEach(i => (getOrInitEntry(i.date).follows = i.value));
  getValues(unfollows).forEach(i => (getOrInitEntry(i.date).unfollows = i.value));

  return Array.from(dataMap.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const adaptFacebookPostsPerformance = (
  impressionsRes: FacebookTimelineResponse,
  interactionsRes: FacebookTimelineResponse,
  engagementRes: FacebookTimelineResponse,
  clicksRes: FacebookTimelineResponse,
  sharesRes: FacebookTimelineResponse,
  commentsRes: FacebookTimelineResponse,
  reactionsRes: FacebookTimelineResponse,
  prevImpressionsRes: FacebookTimelineResponse,
  prevInteractionsRes: FacebookTimelineResponse,
  prevEngagementRes: FacebookTimelineResponse
): ContentPerformanceData => {
  const impressionsSeries = getValues(impressionsRes);
  const interactionsSeries = getValues(interactionsRes);
  const engagementSeries = getValues(engagementRes);
  const chartData = mergeTimelineData(impressionsSeries, impressionsSeries, interactionsSeries);

  const totalClicks = sumValues(getValues(clicksRes));
  const totalShares = sumValues(getValues(sharesRes));
  const totalComments = sumValues(getValues(commentsRes));
  const totalReactions = sumValues(getValues(reactionsRes));

  //! KPIs
  const totalImpressions = sumValues(impressionsSeries);
  const totalInteractions = sumValues(interactionsSeries);
  const avgEngagement = avgValues(engagementSeries);

  //! Previous Data
  const totalPrevImpressions = sumValues(getValues(prevImpressionsRes));
  const totalPrevInteractions = sumValues(getValues(prevInteractionsRes));
  const avgPrevEngagement = avgValues(getValues(prevEngagementRes));

  //! Trends
  const trendImpressions = calculateTrendPercentage(totalImpressions, totalPrevImpressions);
  const trendInteractions = calculateTrendPercentage(totalInteractions, totalPrevInteractions);
  const trendEngagement = calculateTrendPercentage(avgEngagement, avgPrevEngagement);

  return {
    chartData,
    kpis: [
      {
        label: 'Impresiones',
        value: totalImpressions.toLocaleString('es-MX'),
        trend: trendImpressions,
      },
      {
        label: 'Interacciones',
        value: totalInteractions.toLocaleString('es-MX'),
        trend: trendInteractions,
      },
      {
        label: 'Engagement',
        value: `${avgEngagement.toFixed(2)}%`,
        trend: trendEngagement,
      },
    ],
    breakdown: {
      metric1: totalReactions,
      metric2: totalComments,
      metric3: totalShares,
      metric4: totalClicks,
    },
  };
};

//! Process Reels data
export const adaptFacebookReelsPerformance = (
  // Current
  playsRes: FacebookTimelineResponse,
  likesRes: FacebookTimelineResponse,
  socialActionsRes: FacebookTimelineResponse,
  // Previous
  prevPlaysRes: FacebookTimelineResponse,
  prevLikesRes: FacebookTimelineResponse,
  prevSocialActionsRes: FacebookTimelineResponse
): ContentPerformanceData => {
  const playsSeries = getValues(playsRes);
  const likesData = getValues(likesRes);
  const socialActionsData = getValues(socialActionsRes);

  //! Create maps for fast value lookup
  const likesMap = new Map(likesData.map(i => [i.date, i.value]));
  const socialActionsMap = new Map(socialActionsData.map(i => [i.date, i.value]));

  //! Calculate daily interactions (Likes + Social Actions)
  const chartData = playsSeries.map(p => {
    const dailyLikes = likesMap.get(p.date) || 0;
    const dailySocial = socialActionsMap.get(p.date) || 0;

    return {
      date: p.date,
      impressions: p.value,
      interactions: dailyLikes + dailySocial,
    };
  });

  const totalPlays = sumValues(playsSeries);
  const totalLikes = sumValues(likesData);
  const totalSocialActions = sumValues(socialActionsData);
  const totalInteractions = totalLikes + totalSocialActions;

  const engagementRate = totalPlays > 0 ? (totalInteractions / totalPlays) * 100 : 0;

  const totalPrevPlays = sumValues(getValues(prevPlaysRes));
  const totalPrevLikes = sumValues(getValues(prevLikesRes));
  const totalPrevSocialActions = sumValues(getValues(prevSocialActionsRes));

  const totalPrevInteractions = totalPrevLikes + totalPrevSocialActions;
  const prevEngagementRate = totalPrevPlays > 0 ? (totalPrevInteractions / totalPrevPlays) * 100 : 0;

  const trendPlays = calculateTrendPercentage(totalPlays, totalPrevPlays);
  const trendInteractions = calculateTrendPercentage(totalInteractions, totalPrevInteractions);
  const trendEngagement = calculateTrendPercentage(engagementRate, prevEngagementRate);

  return {
    chartData,
    kpis: [
      {
        label: 'Visualizaciones',
        value: totalPlays.toLocaleString('es-MX'),
        trend: trendPlays,
      },
      {
        label: 'Interacciones',
        value: totalInteractions.toLocaleString('es-MX'),
        trend: trendInteractions,
      },
      {
        label: 'Engagement',
        value: `${engagementRate.toFixed(2)}%`,
        trend: trendEngagement,
      },
    ],
    breakdown: {
      metric1: totalLikes,
      metric2: totalSocialActions,
      metric3: 0,
      metric4: 0,
    },
  };
};
