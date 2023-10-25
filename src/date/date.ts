import { format as timeAgo } from 'timeago.js';
import { differenceInCalendarDays, format } from 'date-fns';

type UTCTimestamp = string;

export const ensureUTC = (date: string): UTCTimestamp => {
  if (!date.endsWith('Z')) {
    date = `${date}Z`;
  }

  return date;
};

export const toTimeAgo = (date: UTCTimestamp) => timeAgo(ensureUTC(date));

export const formatDate = (date: UTCTimestamp, dateFormat = 'LLLL d, yyyy') =>
  format(new Date(ensureUTC(date)), dateFormat);

export const daysDiff = (
  date1: UTCTimestamp,
  date2: UTCTimestamp = new Date().toISOString()
) =>
  differenceInCalendarDays(
    new Date(ensureUTC(date1)),
    new Date(ensureUTC(date2))
  );
