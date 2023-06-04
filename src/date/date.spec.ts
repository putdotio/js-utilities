import { toTimeAgo } from './date';

describe('toTimeAgo', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(1685871543488));
  });

  it('should handle relativitization of put.io API timestaps', () => {
    expect(toTimeAgo('2023-06-03T18:30:03')).toBe('15 hours ago');
  });

  it('should handle relativitization of ISO 8601 timestaps', () => {
    expect(toTimeAgo('2023-06-03T18:30:03Z')).toBe('15 hours ago');
  });

  afterAll(() => {
    jest.useRealTimers();
  });
});
