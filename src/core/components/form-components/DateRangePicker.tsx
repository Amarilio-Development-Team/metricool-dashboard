'use client';

import { DayPicker, DateRange, SelectRangeEventHandler } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { es } from 'react-day-picker/locale';
import { format, addMonths } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { useMediaQuery } from '@/core/hooks/useMediaQuery';

interface DateRangePickerProps {
  selected: DateRange | undefined;
  onSelect: (range: DateRange | undefined) => void;
  className?: string;
}

export default function DateRangePicker({ selected, onSelect, className }: DateRangePickerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');

  const handleSelect: SelectRangeEventHandler = (range, selectedDay) => {
    if (selected?.from && selected?.to) {
      onSelect({ from: selectedDay, to: undefined });
      return;
    }
    onSelect(range);
  };

  return (
    <div className={`main-container-color flex flex-col gap-2 rounded-xl border border-gray-100 bg-white p-4 shadow-2xl ${className}`}>
      <style jsx global>{`
        .rdp-vhidden {
          display: none;
        }
      `}</style>

      <div className="flex justify-center">
        <DayPicker
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          disabled={{ after: new Date() }}
          locale={es}
          numberOfMonths={isDesktop ? 2 : 1}
          pagedNavigation
          toMonth={addMonths(new Date(), 1)}
          modifiersClassNames={{
            selected: 'bg-primary text-white hover:bg-main/90',
            today: 'font-bold text-red-500',
            range_start: 'bg-main text-strong rounded-l-full',
            range_end: 'bg-main text-strong rounded-r-full',
            range_middle: 'bg-gray-700 text-white rounded-full',
          }}
          classNames={{
            months: 'flex flex-col md:flex-row gap-8',
            month: 'space-y-4',
            caption: 'flex justify-center py-2 mb-4 relative items-center',
            caption_label: 'text-base font-medium text-strong capitalize',
            nav_button: 'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 transition-opacity hover:bg-gray-100 rounded-full flex items-center justify-center',
            nav_button_previous: 'absolute left-1',
            nav_button_next: 'absolute right-1',
            table: 'w-full border-collapse space-y-1',
            head_row: 'flex',
            head_cell: 'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem] capitalize',
            row: 'flex w-full mt-2 text-strong',
            cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
            day: 'h-9 w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-main/10 rounded-full transition-colors text-sm',
            day_selected: 'bg-primary text-white hover:bg-primary hover:text-white',
            day_today: 'bg-accent text-accent',
            day_outside: 'text-muted-foreground opacity-50',
            day_disabled: 'text-muted-foreground opacity-50',
            day_range_middle: 'aria-selected:bg-accent text-white aria-selected:text-white',
            day_hidden: 'invisible',
          }}
        />
      </div>

      <div className="text-lower mt-2 flex items-center gap-2 border-t pt-3">
        <CalendarIcon className="h-4 w-4 text-gray-500" />
        {selected?.from ? (
          selected.to ? (
            <span className="text-xs text-gray-600">
              Del <strong className="text-gray-900">{format(selected.from, 'dd/MM/yyyy')}</strong> al <strong className="text-gray-900">{format(selected.to, 'dd/MM/yyyy')}</strong>
            </span>
          ) : (
            <span className="text-xs text-gray-600">Selecciona fecha final...</span>
          )
        ) : (
          <span className="text-xs text-gray-600">Selecciona un rango de fechas</span>
        )}
      </div>
    </div>
  );
}
