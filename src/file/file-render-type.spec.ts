import { getFileRenderType } from './file-render-type';
import type { IFile } from '@putdotio/api-client';

const baseFile: IFile = {
  id: 1,
  parent_id: 1,
  name: 'test',
  size: 100,
  extension: 'txt',
  file_type: 'FILE',
  content_type: 'unknown',
  crc32: '1234567890',
  created_at: '2021-01-01T00:00:00Z',
};

describe('getFileRenderType', () => {
  it('should return "folder" for directories', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'application/x-directory',
      file_type: 'FOLDER',
    };
    expect(getFileRenderType(file)).toBe('folder');
  });

  it('should return "audio" for audio files', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'audio/mpeg',
      file_type: 'AUDIO',
    };
    expect(getFileRenderType(file)).toBe('audio');
  });

  it('should return "video" for video files', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'video/mp4',
      file_type: 'VIDEO',
    };
    expect(getFileRenderType(file)).toBe('video');
  });

  it('should return "text/markdown" for markdown files', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'text/markdown',
      extension: 'md',
      file_type: 'TEXT',
    };
    expect(getFileRenderType(file)).toBe('text/markdown');
  });

  it('should return "text" for text files', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'text/plain',
      file_type: 'TEXT',
    };
    expect(getFileRenderType(file)).toBe('text');
  });

  it('should return "image" for image files', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'image/jpeg',
      file_type: 'IMAGE',
    };
    expect(getFileRenderType(file)).toBe('image');
  });

  it('should return "pdf" for PDF files', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'application/pdf',
      file_type: 'PDF',
    };
    expect(getFileRenderType(file)).toBe('pdf');
  });

  it('should return "archive" for archive files', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'application/zip',
      file_type: 'ARCHIVE',
    };
    expect(getFileRenderType(file)).toBe('archive');
  });

  it('should return "epub" for EPUB files', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'application/epub+zip',
    };
    expect(getFileRenderType(file)).toBe('epub');
  });

  it('should return "other" for unknown file types', () => {
    const file: IFile = {
      ...baseFile,
      content_type: 'application/octet-stream',
    };
    expect(getFileRenderType(file)).toBe('other');
  });

  it('should return "other" if content_type is not a string', () => {
    const file: IFile = {
      ...baseFile,
      content_type: null as any,
    };
    expect(getFileRenderType(file)).toBe('other');
  });
});
