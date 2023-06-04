import { format } from 'timeago.js';

type UTCTimestamp = string;

export const toTimeAgo = (date: UTCTimestamp) => {
  if (!date.endsWith('Z')) {
    date = `${date}Z`;
  }

  return format(date);
};
