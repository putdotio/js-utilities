import type { IFile } from '@putdotio/api-client';

import { getFileRenderType } from './file-render-type';

export class FileURLProvider {
  apiURL: string;
  token: string;

  constructor(apiURL: string, token: string) {
    this.apiURL = apiURL.endsWith('/v2') ? apiURL : `${apiURL}/v2`;
    this.token = token;
  }

  getDownloadURL(fileOrFileId: IFile | IFile['id']) {
    if (typeof fileOrFileId === 'number') {
      return `${this.apiURL}/files/${fileOrFileId}/download?oauth_token=${this.token}`;
    }

    if (fileOrFileId.file_type === 'FOLDER') {
      return null;
    }

    return `${this.apiURL}/files/${fileOrFileId.id}/download?oauth_token=${this.token}`;
  }

  getHLSStreamURL(
    file: IFile,
    params: {
      maxSubtitleCount?: number;
      playOriginal?: boolean;
      subtitleLanguages?: string[];
    }
  ) {
    if (getFileRenderType(file) !== 'video') {
      return null;
    }

    const url = new URL(`${this.apiURL}/files/${file.id}/hls/media.m3u8`);
    url.searchParams.set('oauth_token', this.token);

    if (params.playOriginal) {
      url.searchParams.set('original', '1');
    }

    if (params.subtitleLanguages) {
      url.searchParams.set(
        'subtitle_languages',
        params.subtitleLanguages.join(',')
      );
    }

    if (params.maxSubtitleCount) {
      url.searchParams.set(
        'max_subtitle_count',
        params.maxSubtitleCount.toString()
      );
    }

    return url.toString();
  }

  getMP4DownloadURL(file: IFile) {
    if (getFileRenderType(file) !== 'video') {
      return null;
    }

    if (!file.is_mp4_available) {
      return null;
    }

    return `${this.apiURL}/files/${file.id}/mp4/download?oauth_token=${this.token}`;
  }

  getMP4StreamURL(file: IFile) {
    if (getFileRenderType(file) !== 'video') {
      return null;
    }

    if (!file.is_mp4_available) {
      return null;
    }

    return `${this.apiURL}/files/${file.id}/mp4/stream?oauth_token=${this.token}`;
  }

  getStreamURL(file: IFile) {
    switch (getFileRenderType(file)) {
      case 'audio':
        return `${this.apiURL}/files/${file.id}/stream.mp3?oauth_token=${this.token}`;

      case 'video':
        return `${this.apiURL}/files/${file.id}/stream?oauth_token=${this.token}`;

      default:
        return null;
    }
  }
}
