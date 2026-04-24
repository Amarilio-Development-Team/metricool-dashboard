import { getTkTrafficSourcesRepo } from '@/features/analytics/platforms/tiktok/repository';
import { TkTrafficSourcesChart } from './TkTrafficSourcesChart';

interface Props {
  from: Date;
  to: Date;
}

export const TkTrafficSourcesCard = async ({ from, to }: Props) => {
  const data = await getTkTrafficSourcesRepo(from, to);

  return (
    <div className="main-container-color border-primary flex h-full flex-col rounded-2xl border p-6 pt-0 shadow-sm">
      <div className="border-primary mb-4 border-b py-4">
        <h3 className="text-default text-lg font-semibold">Fuentes de Impresiones</h3>
      </div>

      <div className="h-full w-full">
        <TkTrafficSourcesChart data={data} />
      </div>
    </div>
  );
};
