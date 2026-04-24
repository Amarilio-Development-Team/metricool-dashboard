'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, subDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, X } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import DateRangePicker from './form-components/DateRangePicker';
import { getRangeFromUrl } from '../utils/date-utils';

const DateCircle = ({ date, label }: { date: Date | undefined; label: string }) => {
  if (!date) return <div className="h-20 w-20 animate-pulse rounded-full bg-gray-100" />;

  return (
    <div className="flex flex-col items-center">
      <div className="main-container-color border-primary flex size-14 flex-col items-center justify-center rounded-full border shadow-sm transition-transform hover:scale-105 mblg:size-16 md:size-20">
        <span className="text-strong text-3xl font-bold mblg:text-4xl">{format(date, 'd')}</span>
      </div>
      <div className="mt-2 text-center">
        <p className="text-strong text-xs font-bold uppercase tracking-wider">{label}</p>
        <p className="text-placeholder text-sm font-medium capitalize">{format(date, 'EEE, MMMM', { locale: es })}</p>
      </div>
    </div>
  );
};

export default function DateSelector() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange | undefined>(() => {
    const urlRange = getRangeFromUrl(searchParams);
    if (urlRange) return urlRange;

    const today = new Date();
    const start = subDays(today, 6);

    return { from: start, to: today };
  });

  const updateUrl = useCallback(
    (from: Date, to: Date) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('from', format(from, 'yyyy-MM-dd'));
      params.set('to', format(to, 'yyyy-MM-dd'));

      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    const hasParams = searchParams.has('from') && searchParams.has('to');

    if (!hasParams && range?.from && range?.to) {
      updateUrl(range.from, range.to);
    }
  }, [searchParams, range, updateUrl]);

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange);

    if (newRange?.from && newRange?.to) {
      updateUrl(newRange.from, newRange.to);
    }
  };

  return (
    <div className="relative flex flex-col items-center">
      <div className="flex items-center gap-6">
        <DateCircle date={range?.from} label="Desde" />

        <div className="hidden h-12 w-[1px] bg-gray-200 md:block"></div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group flex items-center gap-3 rounded-full px-8 py-4 text-black shadow-md transition-all ${isOpen ? 'bg-gray-800 text-white ring-2 ring-gray-200' : 'bg-primary hover:bg-primary/90 hover:shadow-lg'} `}
        >
          <span className="hidden text-sm font-medium mblg:block lg:hidden xl:block 2xl:text-base">{isOpen ? 'Cerrar Calendario' : 'Seleccionar fechas'}</span>
          {isOpen ? <X className="h-5 w-5" /> : <Calendar className="h-5 w-5 transition-transform group-hover:translate-x-1" />}
        </button>

        <div className="hidden h-12 w-[1px] bg-gray-200 md:block"></div>

        <DateCircle date={range?.to || range?.from} label="Hasta" />
      </div>

      {isOpen && (
        <div className="animate-in fade-in zoom-in-95 absolute top-28 z-50 duration-200 lg:left-0">
          <DateRangePicker selected={range} onSelect={handleSelect} />

          <div className="fixed inset-0 -z-10 bg-transparent" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </div>
  );
}
