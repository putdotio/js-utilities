import { toTimeAgo, ensureUTC, formatDate } from './date';

describe('date', () => {
  beforeAll(() => {
    jest.useFakeTimers().setSystemTime(new Date('2023-06-04T09:39:03.488Z'));
  });

  describe('ensureUTC', () => {
    it('handles put.io API timestamps', () => {
      expect(ensureUTC('2023-06-03T18:30:03')).toBe('2023-06-03T18:30:03Z');
    });
  });

  describe('toTimeAgo', () => {
    it('handles relativitization of ISO 8601 timestaps', () => {
      expect(toTimeAgo('2023-06-03T18:30:03Z')).toBe('15 hours ago');
    });
  });

  describe('formatDate', () => {
    it('formats a date', () => {
      expect(formatDate('2023-06-03T18:30:03Z')).toBe('June 3, 2023');
    });
  });
});
