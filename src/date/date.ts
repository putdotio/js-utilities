import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

export const ensureUTC = (date: unknown = null): string => {
  if (date instanceof Date) {
    return date.toISOString();
  }

  if (typeof date === 'string') {
    return date.endsWith('Z') ? date : `${date}Z`;
  }

  return new Date().toISOString();
};

export const toTimeAgo = (date: unknown = null) => {
  if (!date) {
    return 'N/A';
  }

  return dayjs(ensureUTC(date)).fromNow();
};

export const formatDate = (date: unknown = null, dateFormat = 'LL') => {
  if (!date) {
    return 'N/A';
  }

  return dayjs(ensureUTC(date)).format(dateFormat);
};

export const daysDiff = (date1: unknown, date2: unknown) => {
  const day1 = dayjs(ensureUTC(date1)).startOf('day');
  const day2 = dayjs(ensureUTC(date2)).startOf('day');
  return Math.abs(day2.diff(day1, 'day'));
};

export const daysDiffFromNow = (date: unknown = null) => {
  if (!date) {
    return 'N/A';
  }

  return daysDiff(date, new Date());
};

export const getUnixTimestamp = (date: unknown) => {
  return dayjs(ensureUTC(date)).unix();
};
