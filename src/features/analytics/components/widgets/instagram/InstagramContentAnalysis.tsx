'use server';

import { Image as ImageIcon, PlaySquare, Heart, MessageCircle, Share2, Bookmark } from 'lucide-react';
import { ContentPerformanceWidget } from '@/core/components/widgets/ContentPerformanceWidget';
import { getIgPostsPerformanceRepo, getIgReelsPerformanceRepo } from '@/features/analytics/platforms/instagram/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
}

export const InstagramContentAnalysis = async ({ from, to, className }: Props) => {
  // 1. Carga paralela de datos (Posts y Reels) con sus comparativas históricas
  const [postsData, reelsData] = await Promise.all([getIgPostsPerformanceRepo(from, to), getIgReelsPerformanceRepo(from, to)]);

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {/* ========================================================= */}
      {/* 1. WIDGET DE POSTS (Tema: Pink) */}
      {/* ========================================================= */}
      <ContentPerformanceWidget
        title="Rendimiento de Posts"
        subtitle="Métricas de Publicaciones (Imagen/Carrusel)"
        icon={<ImageIcon size={24} />}
        colorTheme="pink" // Usamos Pink para IG Posts
        // Datos del Repo
        chartData={postsData.chartData}
        kpis={postsData.kpis} // Incluye trends automáticos
        // Desglose Específico para Instagram
        breakdown={[
          {
            label: 'Me Gusta',
            value: postsData.breakdown.metric1,
            icon: <Heart size={16} />,
          },
          {
            label: 'Comentarios',
            value: postsData.breakdown.metric2,
            icon: <MessageCircle size={16} />,
          },
          {
            label: 'Compartidos',
            value: postsData.breakdown.metric3,
            icon: <Share2 size={16} />,
          },
          {
            label: 'Guardados', // <--- CAMBIO CLAVE: Guardados en vez de Clics
            value: postsData.breakdown.metric4,
            icon: <Bookmark size={16} />,
          },
        ]}
        insight="El engagement en posts de imagen suele ser menor que en Reels, pero genera más guardados."
      />

      {/* ========================================================= */}
      {/* 2. WIDGET DE REELS (Tema: Purple) */}
      {/* ========================================================= */}
      <ContentPerformanceWidget
        title="Rendimiento de Reels"
        subtitle="Métricas de Video (Reels)"
        icon={<PlaySquare size={24} />}
        colorTheme="purple" // Usamos Purple para IG Reels
        // Datos del Repo
        chartData={reelsData.chartData}
        kpis={reelsData.kpis} // Incluye trends automáticos
        // Desglose Específico
        breakdown={[
          {
            label: 'Me Gusta',
            value: reelsData.breakdown.metric1,
            icon: <Heart size={16} />,
          },
          {
            label: 'Comentarios',
            value: reelsData.breakdown.metric2,
            icon: <MessageCircle size={16} />,
          },
          {
            label: 'Compartidos',
            value: reelsData.breakdown.metric3,
            icon: <Share2 size={16} />,
          },
          {
            label: 'Guardados',
            value: reelsData.breakdown.metric4,
            icon: <Bookmark size={16} />,
          },
        ]}
        insight="Los Reels tienen mayor alcance viral. Revisa la tasa de guardados para medir la calidad del contenido."
      />
    </div>
  );
};
