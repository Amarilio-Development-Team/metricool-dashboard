'use client';

import { MapPin, Globe } from 'lucide-react';
import { DemographicsWidget, DemographicItem } from '@/core/components/widgets/DemographicsWidget';
import { DemographicsRepoData } from '@/features/analytics/platforms/facebook/repository';

interface Props {
  data: DemographicsRepoData;
  className?: string;
}

export const IgDemographicsCard = ({ data, className }: Props) => {
  const cities: DemographicItem[] = data.cities.map(c => ({
    name: c.name,
    value: c.percentage,
  }));

  const countries: DemographicItem[] = data.countries.map(c => ({
    name: c.name,
    value: c.percentage,
    code: c.code,
  }));

  return (
    <DemographicsWidget
      title="Demografía de la Audiencia"
      subtitle="Distribución por región geográfica"
      className={className}
      leftSection={{
        title: 'Ciudades Principales',
        icon: MapPin,
        data: cities,
        emptyMessage: 'No hay datos de ciudades',
      }}
      rightSection={{
        title: 'Países Principales',
        icon: Globe,
        data: countries,
        emptyMessage: 'No hay datos de países',
      }}
    />
  );
};
