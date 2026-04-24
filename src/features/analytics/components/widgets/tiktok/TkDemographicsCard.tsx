'use client';

import { Users, Globe } from 'lucide-react';
import { DemographicsWidget, DemographicItem } from '@/core/components/widgets/DemographicsWidget';
import { TkDemographicsData } from '@/features/analytics/platforms/tiktok/adapter';

interface Props {
  data: TkDemographicsData;
  className?: string;
}

const GENDER_COLORS: Record<string, string> = {
  Hombres: '#3B82F6',
  Mujeres: '#EC4899',
  Desconocido: '#94A3B8',
};

export const TkDemographicsCard = ({ data, className }: Props) => {
  const genderData: DemographicItem[] = data.gender.map(g => ({
    name: g.name,
    value: g.value,
    color: GENDER_COLORS[g.name],
  }));

  const countryData: DemographicItem[] = data.countries.map(c => ({
    name: c.name,
    value: c.percentage,
    code: c.code,
  }));

  return (
    <DemographicsWidget
      title="Demografía de la Audiencia"
      subtitle="Distribución por Género y País"
      className={className}
      leftSection={{
        title: 'Género',
        icon: Users,
        data: genderData,
        emptyMessage: 'No hay datos de género',
      }}
      rightSection={{
        title: 'Países Principales',
        icon: Globe,
        data: countryData,
        emptyMessage: 'No hay datos de países',
      }}
    />
  );
};
