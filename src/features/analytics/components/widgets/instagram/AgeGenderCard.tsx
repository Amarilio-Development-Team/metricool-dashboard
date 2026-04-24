'use server';

import { getIgAgeGenderRepo } from '@/features/analytics/platforms/instagram/repository';
import { AgeGenderVisuals } from './AgeGenderVisuals';

interface Props {
  from: Date;
  to: Date;
  className?: string;
}

export const AgeGenderCard = async ({ from, to, className }: Props) => {
  const data = await getIgAgeGenderRepo(from, to);

  return (
    <div className={`main-container-color border-primary flex h-full flex-col rounded-xl border p-6 pt-0 shadow-sm ${className}`}>
      {/* Header */}
      <div className="border-primary mb-4 shrink-0 border-b py-4">
        <h3 className="text-strong text-lg font-bold">Edad y Género</h3>
        <p className="text-muted-foreground text-sm">Perfil demográfico de tus seguidores</p>
      </div>

      <div className="flex min-h-[300px] flex-1 flex-col justify-center overflow-hidden">
        <AgeGenderVisuals data={data} />
      </div>
    </div>
  );
};
