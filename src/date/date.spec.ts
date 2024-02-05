import {
  toTimeAgo,
  ensureUTC,
  formatDate,
  daysDiff,
  getUnixTimestamp,
  daysDiffFromNow,
} from './date';

describe('date', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-06-04T09:39:03.488Z'));
  });

  describe('ensureUTC', () => {
    it('handles empty input', () => {
      expect(ensureUTC()).toBe('2023-06-04T09:39:03.488Z');
    });

    it('handles Date objects', () => {
      expect(ensureUTC(new Date('2023-06-03T18:30:03.488Z'))).toBe(
        '2023-06-03T18:30:03.488Z'
      );
    });

    it('handles put.io API timestamps', () => {
      expect(ensureUTC('2023-06-03T18:30:03')).toBe('2023-06-03T18:30:03Z');
    });

    it('handles proper ISO 8601 timestamps', () => {
      expect(ensureUTC('2023-06-03T18:30:03Z')).toBe('2023-06-03T18:30:03Z');
    });

    it('handles YYYY-MM-DD dates', () => {
      expect(ensureUTC('2023-06-03')).toBe('2023-06-03T00:00:00.000Z');
    });
  });

  describe('toTimeAgo', () => {
    it('handles empty input', () => {
      expect(toTimeAgo()).toBe('N/A');
    });

    it('handles relativitization of ISO 8601 timestaps', () => {
      expect(toTimeAgo('2023-06-03T18:30:03Z')).toBe('15 hours ago');
    });
  });

  describe('formatDate', () => {
    it('handles empty input', () => {
      expect(formatDate()).toBe('N/A');
    });

    it('formats a date', () => {
      expect(formatDate('2023-06-03T18:30:03Z')).toBe('June 3, 2023');
    });
  });

  describe('daysDiff', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2020-02-05'));
    });

    it('calculates the difference between two dates, in calendar days', () => {
      expect(daysDiff('2020-02-05', '2020-02-04')).toBe(1);
    });
  });

  describe('daysDiffFromNow', () => {
    beforeAll(() => {
      jest.useFakeTimers().setSystemTime(new Date('2020-02-05'));
    });

    it('calculates the difference between two dates, in calendar days', () => {
      expect(daysDiffFromNow('2020-02-05T16:13:28')).toBe(0);
      expect(daysDiffFromNow('2020-02-04T06:51:43')).toBe(1);
    });

    it('returns absolute value', () => {
      expect(daysDiffFromNow('2020-02-06T16:13:28')).toBe(1);
    });

    it('handles empty input', () => {
      expect(daysDiffFromNow()).toBe(0);
    });
  });

  describe('getUnixTimestamp', () => {
    it('returns a unix timestamp', () => {
      expect(getUnixTimestamp('2023-06-03T18:30:03Z')).toBe(1685817003);
    });
  });
});
