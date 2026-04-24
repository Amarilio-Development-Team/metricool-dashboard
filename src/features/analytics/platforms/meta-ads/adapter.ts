import { MetaAdsRepositoryData, MetaAdsValueRepositoryData } from './repository';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MetricoolTimelineResponse } from '@/services/meta-ads';
import { MetaAdsCampaignRaw } from '@/services/meta-ads';

interface ChartRawData {
  spend: MetricoolTimelineResponse;
  impressions: MetricoolTimelineResponse;
  clicks: MetricoolTimelineResponse;
}

export interface EfficiencyChartRawData {
  spend?: MetricoolTimelineResponse;
  cpm: MetricoolTimelineResponse;
  cpc: MetricoolTimelineResponse;
  ctr: MetricoolTimelineResponse;
}

export interface MetaAdsCampaignClean {
  id: string;
  name: string;
  objective: string;
  status: string;
  spent: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpm: number;
  cpc: number;
  ctr: number;
  results: number;
  resultsLabel: string;
}

//! Helper to sum the string values of a Metricool Timeline
const sumMetricTimelineValues = (data: MetricoolTimelineResponse): number => {
  if (!data || !Array.isArray(data)) return 0;
  return data.reduce((acc, item) => {
    const value = parseFloat(item[1]);
    return acc + (isNaN(value) ? 0 : value);
  }, 0);
};

//! Helper to calculate the trend percentage
const calculateTrend = (current: number, previous: number) => {
  if (previous > 0) return ((current - previous) / previous) * 100;
  if (current > 0) return 100;
  return 0;
};

//! Normalize Timeline Data
export const normalizeMetricData = (data: MetaAdsRepositoryData) => {
  const currentTotal = sumMetricTimelineValues(data.current);
  const previousTotal = sumMetricTimelineValues(data.previous);

  return {
    value: currentTotal,
    previousValue: previousTotal,
    trendPercentage: calculateTrend(currentTotal, previousTotal),
  };
};

//! Normalize Value Data
export const normalizeValueData = (data: MetaAdsValueRepositoryData) => {
  return {
    value: data.current,
    previousValue: data.previous,
    trendPercentage: calculateTrend(data.current, data.previous),
  };
};

//! Normalize Chart Data
export const normalizeMetaAdsChartData = (data: ChartRawData) => {
  if (!data.spend || !Array.isArray(data.spend)) return [];

  return data.spend.map((item, index) => {
    const dateObj = new Date(parseInt(item[0]));

    return {
      date: format(dateObj, 'd MMM', { locale: es }),
      fullDate: format(dateObj, 'd MMM yyyy', { locale: es }),
      spend: parseFloat(item[1]) || 0,
      impressions: parseFloat(data.impressions[index]?.[1]) || 0,
      clicks: parseFloat(data.clicks[index]?.[1]) || 0,
    };
  });
};

export const adaptMetaAdsCampaigns = (data: MetaAdsCampaignRaw[]): MetaAdsCampaignClean[] => {
  if (!data || !Array.isArray(data)) return [];

  return data
    .map(camp => ({
      id: String(camp.providerCampaignId),
      name: camp.name || 'Campaña Desconocida',
      objective: camp.objective || 'UNKNOWN',
      status: camp.status || 'UNKNOWN',
      spent: camp.spent || 0,
      impressions: camp.impressions || 0,
      clicks: camp.clicks || 0,
      conversions: camp.conversions || 0,
      cpm: camp.cpm || 0,
      cpc: camp.cpc || 0,
      ctr: camp.ctr || 0,
      results: camp.results || 0,
      resultsLabel: camp.resultsLabel || 'N/A',
    }))
    .sort((a, b) => b.spent - a.spent);
};

const avgMetricTimelineValues = (data: MetricoolTimelineResponse): number => {
  if (!data || !Array.isArray(data) || data.length === 0) return 0;
  const sum = sumMetricTimelineValues(data);
  return sum / data.length;
};

export const normalizeAverageMetricData = (data: MetaAdsRepositoryData) => {
  const currentAvg = avgMetricTimelineValues(data.current);
  const previousAvg = avgMetricTimelineValues(data.previous);

  return {
    value: currentAvg,
    previousValue: previousAvg,
    trendPercentage: calculateTrend(currentAvg, previousAvg),
  };
};

export const normalizeEfficiencyChartData = (data: EfficiencyChartRawData) => {
  if (!data.cpm || !Array.isArray(data.cpm)) return [];

  return data.cpm.map((item, index) => {
    const dateObj = new Date(parseInt(item[0]));

    return {
      date: format(dateObj, 'd MMM', { locale: es }),
      fullDate: format(dateObj, 'd MMM yyyy', { locale: es }),
      cpm: parseFloat(item[1]) || 0,
      cpc: parseFloat(data.cpc[index]?.[1]) || 0,
      ctr: parseFloat(data.ctr[index]?.[1]) || 0,
      // Mapeamos el gasto basándonos en el mismo índice, con un fallback a 0
      spend: data.spend ? parseFloat(data.spend[index]?.[1]) || 0 : 0,
    };
  });
};
