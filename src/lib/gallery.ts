export interface GalleryPhoto {
  id?: string;
  src: string;
  thumbnail?: string;
  alt: string;
  width?: number;
  height?: number;
  thumbnailWidth?: number;
  thumbnailHeight?: number;
}

export function mediaUrl(path: string, base: string) {
  if (path.startsWith('/') || /^https:\/\//.test(path)) return path;
  if (!base) throw new Error('R2 の画像配信 URL を PUBLIC_MEDIA_BASE_URL に設定してください。');
  return `${base.replace(/\/$/, '')}/${path}`;
}
