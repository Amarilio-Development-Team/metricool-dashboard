'use server';

import React from 'react';
import { MetaAdsEfficiencyChart } from './MetaAdsEfficiencyChart';
import { getMetaAdsEfficiencyChartRepo, getMetaAdsChartRepo } from '@/features/analytics/platforms/meta-ads/repository';
import { normalizeEfficiencyChartData } from '@/features/analytics/platforms/meta-ads/adapter';

interface Props {
  from: Date;
  to: Date;
}

const MetaAdsEfficiencyWidgetChart = async ({ from, to }: Props) => {
  // Obtenemos simultáneamente la data de eficiencia y la de inversión (spend)
  const [efficiencyRaw, chartRaw] = await Promise.all([getMetaAdsEfficiencyChartRepo(from, to), getMetaAdsChartRepo(from, to)]);

  // Combinamos spend en el objeto para el normalizador
  const combinedData = {
    ...efficiencyRaw,
    spend: chartRaw.spend,
  };

  const chartData = normalizeEfficiencyChartData(combinedData);

  return <MetaAdsEfficiencyChart data={chartData} />;
};

export default MetaAdsEfficiencyWidgetChart;
