import { Image as ImageIcon, PlaySquare, ThumbsUp, MessageCircle, Share2, MousePointer2, Heart, Activity } from 'lucide-react';
import { ContentPerformanceWidget } from '@/core/components/widgets/ContentPerformanceWidget';
import { getFacebookPostsPerformanceRepo, getFacebookReelsPerformanceRepo } from '@/features/analytics/platforms/facebook/repository';

interface Props {
  from: Date;
  to: Date;
  className?: string;
}

export const FacebookContentAnalysis = async ({ from, to, className }: Props) => {
  const [postsData, reelsData] = await Promise.all([getFacebookPostsPerformanceRepo(from, to), getFacebookReelsPerformanceRepo(from, to)]);

  return (
    <div className={`flex flex-col gap-8 ${className}`}>
      {/* Post widget */}
      <ContentPerformanceWidget
        title="Rendimiento de Posts"
        subtitle="Métricas de Publicaciones (Imagen/Link)"
        icon={<ImageIcon size={24} />}
        colorTheme="orange"
        chartData={postsData.chartData}
        kpis={postsData.kpis}
        breakdown={[
          {
            label: 'Reacciones',
            value: postsData.breakdown.metric1,
            icon: <ThumbsUp size={16} />,
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
            label: 'Clics en enlace',
            value: postsData.breakdown.metric4,
            icon: <MousePointer2 size={16} />,
          },
        ]}
      />

      {/* Reels widget */}
      <ContentPerformanceWidget
        title="Rendimiento de Reels"
        subtitle="Métricas de Video (Reels)"
        icon={<PlaySquare size={24} />}
        colorTheme="pink"
        chartData={reelsData.chartData}
        kpis={reelsData.kpis}
        breakdown={[
          {
            label: 'Me Gusta',
            value: reelsData.breakdown.metric1,
            icon: <Heart size={16} />,
          },
          {
            label: 'Acciones (Coment. + Share)',
            value: reelsData.breakdown.metric2,
            icon: <Activity size={16} />,
          },
        ]}
        insight="El engagement de Reels se calcula sobre visualizaciones totales."
      />
    </div>
  );
};
