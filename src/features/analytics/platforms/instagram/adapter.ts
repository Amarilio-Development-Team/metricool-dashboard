import { InstagramTimelineResponse, InstagramDistributionResponse } from '@/services/instagram';

export interface CleanMetricData {
  date: string;
  value: number;
}

export interface DemographicItem {
  name: string;
  code?: string;
  percentage: number;
}

export interface GenderChartItem {
  name: string;
  value: number;
  color: string;
}

export interface AgeChartItem {
  range: string;
  value: number;
}

export interface ContentPerformanceKpi {
  label: string;
  value: string | number;
  trend?: number;
}

export interface InstagramChartData {
  date: string;
  impressions: number;
  interactions: number;
}

export interface ContentPerformanceData {
  chartData: InstagramChartData[];
  kpis: ContentPerformanceKpi[];
  breakdown: {
    metric1: number;
    metric2: number;
    metric3: number;
    metric4: number;
  };
}

const getValues = (response: InstagramTimelineResponse): CleanMetricData[] => {
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

const calculateTrendPercentage = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

const mergeTimelineData = (datesSource: CleanMetricData[], metric1: CleanMetricData[], metric2: CleanMetricData[]): InstagramChartData[] => {
  const map1 = new Map(metric1.map(i => [i.date, i.value]));
  const map2 = new Map(metric2.map(i => [i.date, i.value]));

  return datesSource.map(item => ({
    date: item.date,
    impressions: map1.get(item.date) || 0,
    interactions: map2.get(item.date) || 0,
  }));
};

export const adaptInstagramDemographics = (response: InstagramDistributionResponse, isCountry: boolean = false): DemographicItem[] => {
  const rawData = response?.data;

  if (!rawData || !Array.isArray(rawData)) {
    return [];
  }

  return rawData
    .sort((a, b) => b.value - a.value)
    .slice(0, 10)
    .map(item => {
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

export const adaptInstagramGender = (response: InstagramDistributionResponse): GenderChartItem[] => {
  const rawData = response?.data || [];

  const genderMap: Record<string, number> = { M: 0, F: 0, U: 0 };

  rawData.forEach(item => {
    if (genderMap[item.key] !== undefined) {
      genderMap[item.key] = item.value;
    }
  });

  return [
    { name: 'Mujeres', value: genderMap['F'], color: '#EC4899' },
    { name: 'Hombres', value: genderMap['M'], color: '#3B82F6' },
    { name: 'Desconocido', value: genderMap['U'], color: '#94A3B8' },
  ].filter(g => g.value > 0);
};

export const adaptInstagramAge = (response: InstagramDistributionResponse): AgeChartItem[] => {
  const rawData = response?.data || [];
  const sortOrder = ['13-17', '18-24', '25-34', '35-44', '45-54', '55-64', '65+'];

  return rawData
    .map(item => ({
      range: item.key,
      value: item.value,
    }))
    .sort((a, b) => sortOrder.indexOf(a.range) - sortOrder.indexOf(b.range));
};

export const adaptInstagramTimeline = (response: InstagramTimelineResponse): CleanMetricData[] => {
  return getValues(response);
};

export const adaptIgPostsPerformance = (
  impressionsRes: InstagramTimelineResponse,
  interactionsRes: InstagramTimelineResponse,
  engagementRes: InstagramTimelineResponse,
  likesRes: InstagramTimelineResponse,
  commentsRes: InstagramTimelineResponse,
  sharesRes: InstagramTimelineResponse,
  savedRes: InstagramTimelineResponse,
  prevImpressionsRes: InstagramTimelineResponse,
  prevInteractionsRes: InstagramTimelineResponse,
  prevEngagementRes: InstagramTimelineResponse
): ContentPerformanceData => {
  const impressionsSeries = getValues(impressionsRes);
  const interactionsSeries = getValues(interactionsRes);
  const engagementSeries = getValues(engagementRes);

  const chartData = mergeTimelineData(impressionsSeries, impressionsSeries, interactionsSeries);

  const likes = sumValues(getValues(likesRes));
  const comments = sumValues(getValues(commentsRes));
  const shares = sumValues(getValues(sharesRes));
  const saved = sumValues(getValues(savedRes));

  const totalImpressions = sumValues(impressionsSeries);
  const totalInteractions = sumValues(interactionsSeries);
  const avgEngagement = avgValues(engagementSeries);

  const totalPrevImpressions = sumValues(getValues(prevImpressionsRes));
  const totalPrevInteractions = sumValues(getValues(prevInteractionsRes));
  const avgPrevEngagement = avgValues(getValues(prevEngagementRes));

  const trendImpressions = calculateTrendPercentage(totalImpressions, totalPrevImpressions);
  const trendInteractions = calculateTrendPercentage(totalInteractions, totalPrevInteractions);
  const trendEngagement = calculateTrendPercentage(avgEngagement, avgPrevEngagement);

  return {
    chartData,
    kpis: [
      { label: 'Impresiones', value: totalImpressions.toLocaleString('es-MX'), trend: trendImpressions },
      { label: 'Interacciones', value: totalInteractions.toLocaleString('es-MX'), trend: trendInteractions },
      { label: 'Engagement', value: `${avgEngagement.toFixed(2)}%`, trend: trendEngagement },
    ],
    breakdown: {
      metric1: likes,
      metric2: comments,
      metric3: shares,
      metric4: saved,
    },
  };
};

export const adaptIgReelsPerformance = (
  viewsRes: InstagramTimelineResponse,
  interactionsRes: InstagramTimelineResponse,
  engagementRes: InstagramTimelineResponse,
  likesRes: InstagramTimelineResponse,
  commentsRes: InstagramTimelineResponse,
  sharesRes: InstagramTimelineResponse,
  savedRes: InstagramTimelineResponse,
  prevViewsRes: InstagramTimelineResponse,
  prevInteractionsRes: InstagramTimelineResponse,
  prevEngagementRes: InstagramTimelineResponse
): ContentPerformanceData => {
  const viewsSeries = getValues(viewsRes);
  const interactionsSeries = getValues(interactionsRes);
  const engagementSeries = getValues(engagementRes);

  const chartData = mergeTimelineData(viewsSeries, viewsSeries, interactionsSeries);

  const likes = sumValues(getValues(likesRes));
  const comments = sumValues(getValues(commentsRes));
  const shares = sumValues(getValues(sharesRes));
  const saved = sumValues(getValues(savedRes));

  const totalViews = sumValues(viewsSeries);
  const totalInteractions = sumValues(interactionsSeries);
  const avgEngagement = avgValues(engagementSeries);

  const totalPrevViews = sumValues(getValues(prevViewsRes));
  const totalPrevInteractions = sumValues(getValues(prevInteractionsRes));
  const avgPrevEngagement = avgValues(getValues(prevEngagementRes));

  const trendViews = calculateTrendPercentage(totalViews, totalPrevViews);
  const trendInteractions = calculateTrendPercentage(totalInteractions, totalPrevInteractions);
  const trendEngagement = calculateTrendPercentage(avgEngagement, avgPrevEngagement);

  return {
    chartData,
    kpis: [
      { label: 'Visualizaciones', value: totalViews.toLocaleString('es-MX'), trend: trendViews },
      { label: 'Interacciones', value: totalInteractions.toLocaleString('es-MX'), trend: trendInteractions },
      { label: 'Engagement', value: `${avgEngagement.toFixed(2)}%`, trend: trendEngagement },
    ],
    breakdown: {
      metric1: likes,
      metric2: comments,
      metric3: shares,
      metric4: saved,
    },
  };
};
