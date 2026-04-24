import { PlayCircle, Clock, Eye } from 'lucide-react';
import { getTkVideoPerformanceRepo } from '@/features/analytics/platforms/tiktok/repository';

export const TkVideoPerformanceCard = async ({ from, to }: { from: Date; to: Date }) => {
  const { avgWatchTime, avgDuration } = await getTkVideoPerformanceRepo(from, to);

  const validDuration = Number.isFinite(avgDuration) && avgDuration > 0 ? avgDuration : 0;
  const validWatchTime = Number.isFinite(avgWatchTime) && avgWatchTime >= 0 ? avgWatchTime : 0;

  //! Retention Rate
  const retentionRate = validDuration > 0 ? (validWatchTime / validDuration) * 100 : 0;

  //! Progress Styles
  const getProgressStyles = (rate: number) => {
    if (rate >= 40) return { bg: 'bg-emerald-500', text: 'text-emerald-600' };
    if (rate >= 15) return { bg: 'bg-indigo-600', text: 'text-indigo-600' };
    return { bg: 'bg-amber-500', text: 'text-amber-600' };
  };

  const styles = getProgressStyles(retentionRate);

  return (
    <div className="main-container-color border-primary flex flex-col justify-between rounded-2xl border p-6 shadow-sm">
      {/* --- Header --- */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="text-strong container-color rounded-lg p-2">
            <PlayCircle size={24} />
          </div>
          <div>
            <h3 className="text-strong text-lg font-bold sm:text-xl">Retención</h3>
            <p className="text-low text-xs font-medium sm:text-sm">Promedio de visualización</p>
          </div>
        </div>

        <div className="text-right">
          <p className={`text-2xl font-black ${styles.text}`}>{retentionRate.toFixed(1)}%</p>
        </div>
      </div>

      {/* --- Progress Bar --- */}
      <div className="relative mb-6">
        <div className="text-placeholder mb-2 flex justify-between text-[11px] font-semibold uppercase tracking-wider">
          <span>0s</span>
          <span>Duración Total ({validDuration.toFixed(0)}s)</span>
        </div>

        <div className="container-color relative h-4 w-full overflow-hidden rounded-full shadow-inner">
          <div className={`h-full ${styles.bg} transition-all duration-1000 ease-out`} style={{ width: `${Math.min(retentionRate, 100)}%` }} />
        </div>

        <div className="text-placeholder mt-3 text-center text-sm font-medium">
          Tus usuarios ven <span className="text-default font-bold">{validWatchTime.toFixed(1)} segundos</span> en promedio.
        </div>
      </div>

      {/* --- Details Grid --- */}
      <div className="border-primary grid grid-cols-2 gap-4 border-t pt-4">
        <div className="container-color border-primary flex items-center gap-3 rounded-lg border p-3">
          <Clock className="text-placeholder" size={18} />
          <div className="flex flex-col">
            <span className="text-placeholder text-[10px] font-bold uppercase">Duración</span>
            <span className="text-default font-bold">{validDuration.toFixed(1)}s</span>
          </div>
        </div>
        <div className="container-color border-primary flex items-center gap-3 rounded-lg border p-3">
          <Eye className="text-placeholder" size={18} />
          <div className="flex flex-col">
            <span className="text-placeholder text-[10px] font-bold uppercase">Visto</span>
            <span className="text-default font-bold">{validWatchTime.toFixed(1)}s</span>
          </div>
        </div>
      </div>
    </div>
  );
};
