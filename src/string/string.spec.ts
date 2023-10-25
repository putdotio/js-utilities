import { dotsToSpaces, truncate, truncateMiddle } from './string';

describe('string', () => {
  describe('dotsToSpaces', () => {
    it('should replace dots with spaces', () => {
      expect(dotsToSpaces('a.b.c')).toEqual('a b c');
    });
  });

  describe('truncate', () => {
    it('should truncate a string', () => {
      expect(truncate('abcdef', { length: 3 })).toEqual('abc...');
    });

    it('should truncate a string with custom ellipsis', () => {
      expect(truncate('abcdef', { length: 3, ellipsis: '-' })).toEqual('abc-');
    });
  });

  describe('truncateMiddle', () => {
    it('should truncate a string in the middle', () => {
      expect(
        truncateMiddle('abcdef', { frontLength: 1, backLength: 1 })
      ).toEqual('a...f');
    });
  });
});
