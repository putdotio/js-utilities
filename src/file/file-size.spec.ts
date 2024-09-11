import { toHumanFileSize } from './file-size';

describe('file-size', () => {
  describe('toHumanFileSize', () => {
    it('should convert bytes to human readable format', () => {
      expect(toHumanFileSize(1024)).toBe('1 KB');
    });

    it('should convert bytes to human readable format with custom options', () => {
      expect(toHumanFileSize(1024, { unitSeparator: '-' })).toBe('1-KB');
    });

    it('should handle string input', () => {
      expect(toHumanFileSize('1024')).toBe('1 KB');
    });
  });
});
