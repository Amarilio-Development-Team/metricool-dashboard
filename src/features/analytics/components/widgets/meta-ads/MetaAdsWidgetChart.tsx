'use server';
import React from 'react';
import { MetaAdsEvolutionChart } from '@/features/analytics/components/widgets/meta-ads/MetaAdsEvolutionChart';
import { getMetaAdsChartRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeMetaAdsChartData } from '@/features/analytics/platforms/meta-ads/adapter';

const MetaAdsWidgetChart: React.FC<{ from: Date; to: Date }> = async ({ from, to }) => {
  const rawData = await getMetaAdsChartRepo(from, to);
  const chartData = normalizeMetaAdsChartData(rawData);

  return <MetaAdsEvolutionChart data={chartData} />;
};

export default MetaAdsWidgetChart;
