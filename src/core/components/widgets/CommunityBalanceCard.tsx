import { UserPlus, UserMinus } from 'lucide-react';

export interface BalanceData {
  gained: number;
  lost: number;
  net: number;
}

interface Props {
  data: BalanceData;
  className?: string;
}

export const CommunityBalanceCard = ({ data, className }: Props) => {
  const { gained, lost, net } = data;
  const totalActivity = gained + lost;
  const gainedPercent = totalActivity > 0 ? (gained / totalActivity) * 100 : 0;
  const lostPercent = totalActivity > 0 ? 100 - gainedPercent : 0;

  return (
    <div className={`main-container-color border-primary flex h-full flex-col rounded-2xl border p-6 pt-0 shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-primary mb-4 border-b py-4">
        <h3 className="text-default text-lg font-semibold">Balance de Seguidores</h3>
      </div>

      {/* Content Wrapper */}
      <div className="flex flex-1 flex-col justify-center gap-6">
        {/* Progress Bar */}
        <div className="flex flex-col gap-2">
          <div className="main-container-color flex h-3 w-full overflow-hidden rounded-full">
            <div className="bg-emerald-500 transition-all duration-700 ease-out" style={{ width: `${gainedPercent}%` }} />
            <div className="bg-rose-500 transition-all duration-700 ease-out" style={{ width: `${lostPercent}%` }} />
          </div>

          <div className="text-placeholder flex justify-between px-1 text-[10px] font-medium uppercase tracking-wider lg:text-xs">
            <span>{gainedPercent > 0 ? `${gainedPercent.toFixed(0)}% Ganados` : ''}</span>
            <span>{lostPercent > 0 ? `${lostPercent.toFixed(0)}% Perdidos` : ''}</span>
          </div>
        </div>

        {/* Net Number (Responsive) */}
        <div className="text-center">
          <span className="text-strong text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            {net > 0 ? '+' : ''}
            {net.toLocaleString('es-MX')}
          </span>
          <p className="mt-1 text-xs font-medium uppercase text-gray-400 xl:text-sm">Balance Neto</p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 grid grid-cols-2 border-t border-dashed border-gray-100 pt-6 dark:border-gray-800">
        {/* Left: Gained */}
        <div className="border-primary flex flex-col items-center justify-center border-r px-4">
          <div className="mb-1 flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
            <UserPlus className="size-4 lg:size-5" />
            <span className="text-xs font-bold uppercase lg:text-sm">Nuevos</span>
          </div>
          <span className="text-medium text-xl font-bold lg:text-2xl">{gained.toLocaleString('es-MX')}</span>
        </div>

        {/* Right: Lost */}
        <div className="flex flex-col items-center justify-center px-4">
          <div className="mb-1 flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
            <UserMinus className="size-4 lg:size-5" />
            <span className="text-xs font-bold uppercase lg:text-sm">Perdidos</span>
          </div>
          <span className="text-medium text-xl font-bold lg:text-2xl">{lost.toLocaleString('es-MX')}</span>
        </div>
      </div>
    </div>
  );
};
