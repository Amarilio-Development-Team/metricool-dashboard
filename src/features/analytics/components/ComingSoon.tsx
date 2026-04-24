import { Rocket } from 'lucide-react';

export const ComingSoon = () => {
  return (
    <section className="flex flex-1 flex-col items-center justify-center">
      <Rocket className="mx-auto mb-4 size-10 opacity-70 lg:size-12" />
      <p className="text-placeholder text-center">Próximamente...</p>
    </section>
  );
};
