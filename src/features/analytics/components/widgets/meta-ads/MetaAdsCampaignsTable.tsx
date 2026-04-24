import { Megaphone } from 'lucide-react';
import { CampaignsTable, TableColumn } from '@/core/components/widgets/CampaignsTable';
import { MetaAdsCampaignClean } from '@/features/analytics/platforms/meta-ads/adapter';
import { getMetaAdsCampaignsRepo } from '@/features/analytics/platforms/meta-ads/repository';

interface Props {
  from: Date;
  to: Date;
}

const getMetaObjectiveBadge = (objective: string) => {
  const map: Record<string, { label: string; style: string }> = {
    OUTCOME_LEADS: { label: 'Generación de Leads', style: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
    OUTCOME_ENGAGEMENT: { label: 'Engagement', style: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
    OUTCOME_AWARENESS: { label: 'Reconocimiento', style: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
    OUTCOME_TRAFFIC: { label: 'Tráfico', style: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' },
    OUTCOME_SALES: { label: 'Ventas', style: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' },
  };

  const badge = map[objective] || { label: objective.replace('OUTCOME_', ''), style: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' };

  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${badge.style}`}>{badge.label}</span>;
};

// Formatters
const formatCurrency = (val: number) => new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(val);
const formatNumber = (val: number) => new Intl.NumberFormat('es-MX').format(val);
const formatPercent = (val: number) => `${val.toFixed(2)}%`;

const formatResultLabel = (label: string) => {
  if (!label || label === 'N/A') return 'Resultados';
  if (label.includes('messaging conversation')) return 'Conversaciones';
  if (label.includes('Like')) return 'Me gusta';
  if (label.includes('link_click')) return 'Clics en enlace';
  return label;
};

export const MetaAdsCampaignsTable = async ({ from, to }: Props) => {
  const data = await getMetaAdsCampaignsRepo(from, to);

  const columns: TableColumn<MetaAdsCampaignClean>[] = [
    {
      header: 'Campaña',
      key: 'campaign',
      align: 'left',
      render: row => (
        <div className="flex flex-col items-start gap-1">
          <span className="text-strong font-semibold">{row.name}</span>
          {getMetaObjectiveBadge(row.objective)}
        </div>
      ),
    },
    {
      header: 'Gasto',
      key: 'spent',
      align: 'right',
      render: row => <span className="text-strong font-medium">{formatCurrency(row.spent)}</span>,
    },
    {
      header: 'Impresiones',
      key: 'impressions',
      align: 'right',
      render: row => <span className="text-strong">{formatNumber(row.impressions)}</span>,
    },
    {
      header: 'Clics',
      key: 'clicks',
      align: 'right',
      render: row => <span className="text-strong">{formatNumber(row.clicks)}</span>,
    },
    {
      header: 'CPM',
      key: 'cpm',
      align: 'right',
      render: row => <span className="text-strong">{formatCurrency(row.cpm)}</span>,
    },
    {
      header: 'CPC',
      key: 'cpc',
      align: 'right',
      render: row => <span className="text-strong">{formatCurrency(row.cpc)}</span>,
    },
    {
      header: 'CTR',
      key: 'ctr',
      align: 'right',
      render: row => <span className="text-strong">{formatPercent(row.ctr)}</span>,
    },
    {
      header: 'Resultados',
      key: 'results',
      align: 'right',
      render: row => (
        <div className="flex flex-col items-end">
          <span className="text-strong font-bold">{formatNumber(row.results)}</span>
          <span className="text-low text-[10px] capitalize leading-tight">{formatResultLabel(row.resultsLabel)}</span>
        </div>
      ),
    },
  ];

  return (
    <CampaignsTable
      title="Rendimiento por Campaña"
      subtitle="Desglose detallado de tus anuncios en Meta (Facebook & Instagram)"
      icon={Megaphone}
      iconColorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
      columns={columns}
      data={data}
      emptyMessage="No se encontraron campañas activas en Meta Ads para este periodo"
    />
  );
};
