import type { IFile } from '@putdotio/api-client';

export type FileRenderType =
  | 'archive'
  | 'audio'
  | 'epub'
  | 'folder'
  | 'image'
  | 'other'
  | 'pdf'
  | 'text'
  | 'text/markdown'
  | 'video';

export const getFileRenderType = (file: IFile): FileRenderType => {
  const { content_type, extension, file_type } = file;

  if (typeof content_type !== 'string') {
    return 'other';
  }

  if (content_type === 'application/x-directory') {
    return 'folder';
  }

  if (content_type.startsWith('audio') || file_type === 'AUDIO') {
    return 'audio';
  }

  if (content_type.startsWith('video')) {
    return 'video';
  }

  if (content_type.startsWith('image')) {
    return 'image';
  }

  if (content_type === 'application/pdf') {
    return 'pdf';
  }

  if (['application/x-rar', 'application/zip'].includes(content_type)) {
    return 'archive';
  }

  if (content_type === 'application/epub+zip') {
    return 'epub';
  }

  if (
    content_type.startsWith('text') ||
    content_type.startsWith('application/x-subrip') ||
    file_type === 'TEXT'
  ) {
    if (content_type.endsWith('/markdown') || extension === 'md') {
      return 'text/markdown';
    }

    return 'text';
  }

  return 'other';
};
