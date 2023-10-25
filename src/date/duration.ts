const ensureNumber = (value: number | unknown) => {
  if (typeof value !== 'number') {
    return 0;
  }

  return value;
};

export const secondsToDuration = (seconds: number | unknown) => {
  const normalizedSeconds = Math.floor(ensureNumber(seconds));

  if (normalizedSeconds <= 0) {
    return '00:00';
  }

  const days = Math.floor(normalizedSeconds / (60 * 60 * 24));
  const minutes = Math.floor(normalizedSeconds / 60) % 60;
  let hours = Math.floor(normalizedSeconds / (60 * 60));

  if (days) {
    hours = Math.round((normalizedSeconds - days * (60 * 60 * 24)) / 60 / 60);

    return [days, hours, minutes, normalizedSeconds % 60]
      .map((v) => (v < 10 ? `0${v}` : v))
      .filter((v, i) => v !== '00' || i > 0)
      .join(':');
  }

  return [hours, minutes, normalizedSeconds % 60]
    .map((v) => (v < 10 ? `0${v}` : v))
    .filter((v, i) => v !== '00' || i > 0)
    .join(':');
};

export const secondsToReadableDuration = (seconds: number | unknown) => {
  const normalizedSeconds = Math.floor(ensureNumber(seconds));

  if (normalizedSeconds <= 0) {
    return '';
  }

  const fSec = 's';
  const fMin = 'm';
  const fHour = 'h';
  const fDay = 'd';

  if (normalizedSeconds < 60) {
    return `${seconds} ${fSec}`;
  }

  if (normalizedSeconds > 60 * 60 * 24) {
    const days = Math.floor(normalizedSeconds / (60 * 60 * 24));
    const hour = Math.round(
      (normalizedSeconds - days * (60 * 60 * 24)) / 60 / 60
    );
    return `${days}${fDay}${hour > 0 ? ` ${hour}${fHour}` : ''}`;
  }

  if (normalizedSeconds >= 60 * 60) {
    const hour = Math.floor(normalizedSeconds / (60 * 60));
    const m = Math.round((normalizedSeconds - hour * 60 * 60) / 60);
    let mins = '';

    if (m > 0) {
      mins = ` ${m}${fMin}`;
    }

    return `${hour}${fHour}${mins}`;
  }

  if (normalizedSeconds > 60) {
    const m = Math.round(normalizedSeconds / 60);
    const sec = normalizedSeconds - m * 60;
    const secText = sec > 0 ? ` ${sec}${fSec}` : '';

    return `${m}${fMin}${secText}`;
  }
};
