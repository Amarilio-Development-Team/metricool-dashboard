import { Suspense } from 'react';
import { SpendWidget } from '@/features/analytics/components/widgets/meta-ads/SpendWidget';
import { ImpressionsWidget } from '@/features/analytics/components/widgets/meta-ads/ImpressionsWidget';
import { ReachWidget } from '@/features/analytics/components/widgets/meta-ads/ReachWidget';
import { ClicksWidget } from '@/features/analytics/components/widgets/meta-ads/ClicksWidget';

// Nuevos imports de Eficiencia
import MetaAdsEfficiencyWidgetChart from '@/features/analytics/components/widgets/meta-ads/MetaAdsEfficiencyWidgetChart';
import { MetaAdsCpmWidget } from '@/features/analytics/components/widgets/meta-ads/MetaAdsCpmWidget';
import { MetaAdsCpcWidget } from '@/features/analytics/components/widgets/meta-ads/MetaAdsCpcWidget';
import { MetaAdsCtrWidget } from '@/features/analytics/components/widgets/meta-ads/MetaAdsCtrWidget';

import StatCardSkeleton from '@/core/components/skeletons/StatCardSkeleton';
import ChartSkeleton from '@/core/components/skeletons/ChartSkeleton';
import MetaAdsWidgetChart from '../widgets/meta-ads/MetaAdsWidgetChart';
import { MetaAdsCampaignsTable } from '../widgets/meta-ads/MetaAdsCampaignsTable';

interface Props {
  from: Date;
  to: Date;
}

export const MetaAdsOverview = ({ from, to }: Props) => {
  const suspenseKey = `${from.toISOString()}-${to.toISOString()}`;
  const heroValueSize = 'text-3xl mblg:text-4xl lg:text-5xl';

  return (
    <section className="flex flex-col gap-14">
      {/* 1. SECCIÓN: RESUMEN DE RESULTADOS (VOLUMEN) */}
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Resumen de <span className="text-primary">Resultados</span>
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Suspense key={`spend-${suspenseKey}`} fallback={<StatCardSkeleton />}>
            <SpendWidget from={from} to={to} className="h-full min-h-[200px]" valueClassName={heroValueSize} />
          </Suspense>

          <Suspense key={`impressions-${suspenseKey}`} fallback={<StatCardSkeleton />}>
            <ImpressionsWidget from={from} to={to} className="h-full min-h-[200px]" valueClassName={heroValueSize} />
          </Suspense>

          <div className="flex h-full flex-col gap-4 md:col-span-2 lg:col-span-1">
            <Suspense key={`clicks-${suspenseKey}`} fallback={<StatCardSkeleton />}>
              <ClicksWidget from={from} to={to} className="flex-1" />
            </Suspense>

            <Suspense key={`reach-${suspenseKey}`} fallback={<StatCardSkeleton />}>
              <ReachWidget from={from} to={to} className="flex-1" />
            </Suspense>
          </div>
        </div>
      </div>

      {/* 2. SECCIÓN: GRÁFICA DE VOLUMEN DIARIO */}
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Gráfica de <span className="text-primary">Resultados</span>
        </h2>
        <Suspense key={`chart-${suspenseKey}`} fallback={<ChartSkeleton />}>
          <MetaAdsWidgetChart from={from} to={to} />
        </Suspense>
      </div>

      {/* 3. SECCIÓN: RENDIMIENTO DE INVERSIÓN (EFICIENCIA) */}
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Rendimiento de <span className="text-primary">Inversión</span>
        </h2>

        {/* Grid Asimétrico: 8 columnas izquierda / 4 columnas derecha en Desktop */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Gráfica Izquierda */}
          <div className="lg:col-span-8">
            <Suspense key={`efficiency-chart-${suspenseKey}`} fallback={<ChartSkeleton />}>
              <MetaAdsEfficiencyWidgetChart from={from} to={to} />
            </Suspense>
          </div>

          {/* Tarjetas Derecha (Apiladas en móvil/desktop, en fila para tablets) */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 lg:col-span-4 lg:flex lg:flex-col">
            <Suspense key={`cpm-${suspenseKey}`} fallback={<StatCardSkeleton />}>
              <MetaAdsCpmWidget from={from} to={to} className="h-full" />
            </Suspense>

            <Suspense key={`cpc-${suspenseKey}`} fallback={<StatCardSkeleton />}>
              <MetaAdsCpcWidget from={from} to={to} className="h-full" />
            </Suspense>

            <Suspense key={`ctr-${suspenseKey}`} fallback={<StatCardSkeleton />}>
              <MetaAdsCtrWidget from={from} to={to} className="h-full" />
            </Suspense>
          </div>
        </div>
      </div>

      {/* 4. SECCIÓN: DESGLOSE POR CAMPAÑAS */}
      <div className="flex flex-col gap-6">
        <h2 className="text-medium text-2xl font-bold lg:text-3xl">
          Listado de tus <span className="text-primary">Campañas</span>
        </h2>
        <Suspense key={`meta-campaigns-${suspenseKey}`} fallback={<div className="h-[300px] w-full animate-pulse rounded-xl bg-gray-100 dark:bg-gray-800" />}>
          <MetaAdsCampaignsTable from={from} to={to} />
        </Suspense>
      </div>
    </section>
  );
};
