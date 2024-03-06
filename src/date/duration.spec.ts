import { secondsToDuration, secondsToReadableDuration } from './duration';

describe('duration', () => {
  describe('secondsToDuration', () => {
    it('handles null input', () => {
      expect(secondsToDuration(null)).toBe('00:00');
    });

    it('formats seconds as mm:ss', () => {
      expect(secondsToDuration(4)).toBe('00:04');
      expect(secondsToDuration(44)).toBe('00:44');
    });

    it('formats minutes as mm:ss', () => {
      expect(secondsToDuration(444)).toBe('07:24');
    });

    it('formats hours as HH:mm:ss', () => {
      expect(secondsToDuration(44444)).toBe('12:20:44');
    });

    it('formats hours (more than 24) as dd:HH:mm:ss', () => {
      expect(secondsToDuration(444444)).toBe('05:03:27:24');
    });

    it('formats hours (more than 24) as dd:HH:mm:ss', () => {
      expect(secondsToDuration(86460)).toBe('01:00:01:00');
    });

    it('handles decimal duration inputs', () => {
      expect(secondsToDuration(2565.568)).toBe('42:45');
    });
  });

  describe('secondsToReadableDuration', () => {
    it('handles weird input', () => {
      expect(secondsToReadableDuration(-500)).toBe('N/A');
    });

    it('handles null input', () => {
      expect(secondsToReadableDuration(null)).toBe('N/A');
    });

    it('formats seconds as s', () => {
      expect(secondsToReadableDuration(4)).toBe('4 s');
      expect(secondsToReadableDuration(44)).toBe('44 s');
    });

    it('formats minutes as mm ss', () => {
      expect(secondsToReadableDuration(444)).toBe('7m 24s');
    });

    it('formats hours as HH mm', () => {
      expect(secondsToReadableDuration(44444)).toBe('12h 21m');
    });

    it('formats hours (more than 24) as dd HH', () => {
      expect(secondsToReadableDuration(86400)).toBe('1d');
    });

    it('formats hours (more than 24) as dd HH', () => {
      expect(secondsToReadableDuration(444444)).toBe('5d 3h');
    });

    it('handles 24 hours', () => {
      expect(secondsToReadableDuration(691200)).toBe('8d');
    });

    it('handles decimal duration inputs', () => {
      expect(secondsToReadableDuration(2565.568)).toBe('43m');
    });
  });
});
