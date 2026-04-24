import { DateRange } from 'react-day-picker';
import { parseISO, isValid, format, differenceInDays, subDays } from 'date-fns';
import { ReadonlyURLSearchParams } from 'next/navigation';

export const getRangeFromUrl = (params: ReadonlyURLSearchParams): DateRange | null => {
  const from = params.get('from');
  const to = params.get('to');

  if (!from || !to) return null;

  const fromDate = parseISO(from);
  const toDate = parseISO(to);

  if (isValid(fromDate) && isValid(toDate)) {
    return { from: fromDate, to: toDate };
  }

  return null;
};

export const getComparisonPeriod = (start: Date, end: Date) => {
  const durationInDays = differenceInDays(end, start);

  //* The previous period ends one day before the current one starts
  const previousEnd = subDays(start, 1);

  //* The previous start is the previous end minus the duration
  const previousStart = subDays(previousEnd, durationInDays);

  return {
    previousFrom: previousStart,
    previousTo: previousEnd,
  };
};

export const formatMetricoolDate = (date: Date): string => {
  return format(date, 'yyyyMMdd');
};
