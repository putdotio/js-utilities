import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';

dayjs.extend(localizedFormat);
dayjs.extend(relativeTime);

type UTCTimestamp = string;

export const ensureUTC = (date: string): UTCTimestamp => {
  if (!date.endsWith('Z')) {
    date = `${date}Z`;
  }

  return date;
};

export const toTimeAgo = (date: UTCTimestamp) => {
  return dayjs(ensureUTC(date)).fromNow();
};

export const formatDate = (date: UTCTimestamp, dateFormat = 'LL') => {
  return dayjs(new Date(ensureUTC(date))).format(dateFormat);
};

export const daysDiff = (
  date1: UTCTimestamp,
  date2: UTCTimestamp = new Date().toISOString()
) => {
  return Math.ceil(
    Math.abs(dayjs(ensureUTC(date1)).diff(ensureUTC(date2), 'day', true))
  );
};

export const getUnixTimestamp = (date: UTCTimestamp) => {
  return dayjs(ensureUTC(date)).unix();
};
