import React from 'react';
import { Megaphone, Ban } from 'lucide-react';
import { TkAdsCampaignClean } from '@/features/analytics/platforms/tiktok-ads/adapter';

interface Props {
  data: TkAdsCampaignClean[];
}

// Helper para traducir y estilizar los objetivos de campaña
const getObjectiveBadge = (objective: string) => {
  const map: Record<string, { label: string; style: string }> = {
    LEAD_GENERATION: { label: 'Generación de Leads', style: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    ENGAGEMENT: { label: 'Engagement', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    REACH: { label: 'Alcance', style: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    CONVERSIONS: { label: 'Conversiones', style: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  };

  const badge = map[objective] || { label: objective, style: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };

  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.style}`}>{badge.label}</span>;
};

export const TkAdsCampaignsTable = ({ data }: Props) => {
  // Formatters
  const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
  const formatNumber = (val: number) => new Intl.NumberFormat('es-MX').format(val);
  const formatPercent = (val: number) => `${val.toFixed(2)}%`;

  if (!data || data.length === 0) {
    return (
      <div className="main-container-color border-primary flex flex-col items-center justify-center rounded-xl border py-16 shadow-sm">
        <div className="mb-4 rounded-full bg-gray-50 p-4 dark:bg-gray-800">
          <Ban className="h-8 w-8 text-gray-300 dark:text-gray-600" />
        </div>
        <p className="text-strong text-sm font-medium">No se encontraron campañas en este periodo</p>
      </div>
    );
  }

  return (
    <div className="main-container-color border-primary flex flex-col rounded-xl border shadow-sm">
      {/* HEADER DE LA TABLA */}
      <div className="border-primary flex items-center gap-3 border-b p-6">
        <div className="rounded-md bg-pink-100 p-2 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400">
          <Megaphone className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-strong text-lg font-bold">Rendimiento por Campaña</h3>
          <p className="text-low text-xs font-medium">Desglose detallado de tus anuncios en TikTok</p>
        </div>
      </div>

      {/* CONTENEDOR SCROLLABLE PARA RESPONSIVE */}
      <div className="w-full overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-primary border-b bg-gray-50/50 text-xs uppercase tracking-wider dark:bg-gray-900/20">
            <tr>
              <th scope="col" className="text-low px-6 py-4 font-semibold">
                Campaña
              </th>
              <th scope="col" className="text-low px-6 py-4 text-right font-semibold">
                Gasto
              </th>
              <th scope="col" className="text-low px-6 py-4 text-right font-semibold">
                Impresiones
              </th>
              <th scope="col" className="text-low px-6 py-4 text-right font-semibold">
                Clics
              </th>
              <th scope="col" className="text-low px-6 py-4 text-right font-semibold">
                CPM
              </th>
              <th scope="col" className="text-low px-6 py-4 text-right font-semibold">
                CPC
              </th>
              <th scope="col" className="text-low px-6 py-4 text-right font-semibold">
                CTR
              </th>
              <th scope="col" className="text-low px-6 py-4 text-right font-semibold">
                Conversiones
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-primary">
            {data.map(campaign => (
              <tr key={campaign.id} className="transition-colors hover:bg-gray-50/80 dark:hover:bg-gray-800/40">
                {/* Nombre y Objetivo */}
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-strong font-semibold">{campaign.name}</span>
                    <div>{getObjectiveBadge(campaign.objective)}</div>
                  </div>
                </td>

                {/* Métricas */}
                <td className="text-strong whitespace-nowrap px-6 py-4 text-right font-medium">{formatCurrency(campaign.spent)}</td>
                <td className="text-strong whitespace-nowrap px-6 py-4 text-right">{formatNumber(campaign.impressions)}</td>
                <td className="text-strong whitespace-nowrap px-6 py-4 text-right">{formatNumber(campaign.clicks)}</td>
                <td className="text-strong whitespace-nowrap px-6 py-4 text-right">{formatCurrency(campaign.cpm)}</td>
                <td className="text-strong whitespace-nowrap px-6 py-4 text-right">{formatCurrency(campaign.cpc)}</td>
                <td className="text-strong whitespace-nowrap px-6 py-4 text-right">{formatPercent(campaign.ctr)}</td>
                <td className="text-strong whitespace-nowrap px-6 py-4 text-right font-bold">{formatNumber(campaign.conversions)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
