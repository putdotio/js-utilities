import type { IFile } from '@putdotio/api-client';

import { FileURLProvider } from './file-url-provider';
import { getFileRenderType } from './file-render-type';

jest.mock('./file-render-type');

const apiURL = 'https://api.example.com';
const token = 'test-token';
let provider: FileURLProvider;

const baseFile: IFile = {
  id: 1,
  parent_id: 1,
  name: 'test',
  size: 100,
  extension: 'txt',
  file_type: 'TEXT',
  content_type: 'text/plain',
  crc32: '1234567890',
  created_at: '2021-01-01T00:00:00Z',
};

beforeEach(() => {
  provider = new FileURLProvider(apiURL, token);
});

const mockFileRenderType = (type: string) => {
  (getFileRenderType as jest.Mock).mockReturnValue(type);
};

describe('FileURLProvider', () => {
  describe('getDownloadURL', () => {
    it('should return download URL for file ID', () => {
      const fileId = 123;
      const url = provider.getDownloadURL(fileId);
      expect(url).toMatchInlineSnapshot(
        `"https://api.example.com/v2/files/123/download?oauth_token=test-token"`
      );
    });

    it('should return null for folder type', () => {
      const file: IFile = {
        ...baseFile,
        file_type: 'FOLDER',
      };
      const url = provider.getDownloadURL(file);
      expect(url).toBeNull();
    });

    it('should return download URL for file object', () => {
      const file: IFile = {
        ...baseFile,
        file_type: 'VIDEO',
      };
      const url = provider.getDownloadURL(file);
      expect(url).toMatchInlineSnapshot(
        `"https://api.example.com/v2/files/1/download?oauth_token=test-token"`
      );
    });
  });

  describe('getHLSStreamURL', () => {
    it('should return null if file is not a video', () => {
      mockFileRenderType('audio');
      const file: IFile = {
        ...baseFile,
        file_type: 'AUDIO',
      };
      const url = provider.getHLSStreamURL(file, {});
      expect(url).toBeNull();
    });

    it('should return HLS stream URL with parameters', () => {
      mockFileRenderType('video');
      const file: IFile = {
        ...baseFile,
        file_type: 'VIDEO',
      };
      const params = {
        playOriginal: true,
        subtitleLanguages: ['en', 'es'],
        maxSubtitleCount: 2,
      };
      const url = provider.getHLSStreamURL(file, params);
      expect(url).toMatchInlineSnapshot(
        `"https://api.example.com/v2/files/1/hls/media.m3u8?oauth_token=test-token&original=1&subtitle_languages=en%2Ces&max_subtitle_count=2"`
      );
    });
  });

  describe('getMP4DownloadURL', () => {
    it('should return null if file is not a video', () => {
      mockFileRenderType('audio');
      const file: IFile = {
        ...baseFile,
        file_type: 'AUDIO',
      };
      const url = provider.getMP4DownloadURL(file);
      expect(url).toBeNull();
    });

    it('should return null if MP4 is not available', () => {
      mockFileRenderType('video');
      const file: IFile = {
        ...baseFile,
        file_type: 'VIDEO',
        is_mp4_available: false,
        parent_id: 0,
        name: 'test.mp4',
        size: 1024,
        content_type: 'video/mp4',
      };
      const url = provider.getMP4DownloadURL(file);
      expect(url).toBeNull();
    });

    it('should return MP4 download URL if MP4 is available', () => {
      mockFileRenderType('video');
      const file: IFile = {
        ...baseFile,
        file_type: 'VIDEO',
        is_mp4_available: true,
      };
      const url = provider.getMP4DownloadURL(file);
      expect(url).toMatchInlineSnapshot(
        `"https://api.example.com/v2/files/1/mp4/download?oauth_token=test-token"`
      );
    });
  });

  describe('getMP4StreamURL', () => {
    it('should return null if file is not a video', () => {
      mockFileRenderType('audio');
      const file: IFile = {
        ...baseFile,
        file_type: 'AUDIO',
      };
      const url = provider.getMP4StreamURL(file);
      expect(url).toBeNull();
    });

    it('should return null if MP4 is not available', () => {
      mockFileRenderType('video');
      const file: IFile = {
        ...baseFile,
        file_type: 'VIDEO',
        is_mp4_available: false,
      };
      const url = provider.getMP4StreamURL(file);
      expect(url).toBeNull();
    });

    it('should return MP4 stream URL if MP4 is available', () => {
      mockFileRenderType('video');
      const file: IFile = {
        ...baseFile,
        file_type: 'VIDEO',
        is_mp4_available: true,
      };
      const url = provider.getMP4StreamURL(file);
      expect(url).toMatchInlineSnapshot(
        `"https://api.example.com/v2/files/1/mp4/stream?oauth_token=test-token"`
      );
    });
  });

  describe('getStreamURL', () => {
    it('should return audio stream URL for audio file', () => {
      mockFileRenderType('audio');
      const file: IFile = {
        ...baseFile,
        file_type: 'AUDIO',
      };
      const url = provider.getStreamURL(file);
      expect(url).toMatchInlineSnapshot(
        `"https://api.example.com/v2/files/1/stream.mp3?oauth_token=test-token"`
      );
    });

    it('should return video stream URL for video file', () => {
      mockFileRenderType('video');
      const file: IFile = {
        ...baseFile,
        file_type: 'VIDEO',
      };
      const url = provider.getStreamURL(file);
      expect(url).toMatchInlineSnapshot(
        `"https://api.example.com/v2/files/1/stream?oauth_token=test-token"`
      );
    });

    it('should return null for unsupported file type', () => {
      mockFileRenderType('archive');
      const file: IFile = {
        ...baseFile,
        file_type: 'ARCHIVE',
      };
      const url = provider.getStreamURL(file);
      expect(url).toBeNull();
    });
  });
});
