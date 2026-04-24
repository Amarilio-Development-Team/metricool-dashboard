import DateSelector from '@/core/components/DateSelector';
import PlatformSelector from '@/core/components/PlatformSelect';
import { PlatformContent } from '@/features/analytics/components/PlatformContent';
import { parseISO, isValid } from 'date-fns';

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage(props: PageProps) {
  const searchParams = await props.searchParams;

  const fromParam = searchParams['from'] as string;
  const toParam = searchParams['to'] as string;
  const platformParam = searchParams['platform'] as string;

  const today = new Date();
  const from = fromParam && isValid(parseISO(fromParam)) ? parseISO(fromParam) : today;
  const to = toParam && isValid(parseISO(toParam)) ? parseISO(toParam) : today;

  return (
    <section className="flex min-h-[calc(100vh-80px)] w-full flex-col py-16">
      <header className="flex h-max w-full flex-col-reverse items-center justify-between gap-6 lg:flex-row lg:gap-10">
        <DateSelector />
        <div className="flex w-full max-w-3xl flex-col overflow-x-hidden">
          <h2 className="text-strong text-2xl font-light 2xl:text-3xl">
            Selecciona una <span className="font-bold text-primary">plataforma</span>
          </h2>
          <PlatformSelector />
        </div>
      </header>

      <div className="mt-12 flex flex-1 flex-col">
        <PlatformContent platform={platformParam} from={from} to={to} />
      </div>
    </section>
  );
}
