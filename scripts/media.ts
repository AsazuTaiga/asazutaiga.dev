import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import sharp from 'sharp';
import { S3Client, HeadObjectCommand, PutObjectCommand, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';

export interface Photo {
  id: string;
  filename: string;
  alt: string;
  src: string;
  thumbnail: string;
  width: number;
  height: number;
  thumbnailWidth: number;
  thumbnailHeight: number;
}

export const root = resolve(import.meta.dir, '..');
export const cacheRoot = join(root, '.media-cache');
export const manifestPath = (slug: string, rootDir = root) => join(rootDir, 'src/data/galleries', `${slug}.json`);
export function validateSlug(slug: string) {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('記事 ID は英小文字・数字・ハイフンで指定してください。');
  return slug;
}

async function readPhotos(slug: string, rootDir = root): Promise<Photo[]> {
  try { return JSON.parse(await readFile(manifestPath(slug, rootDir), 'utf8')); }
  catch (error) { if ((error as NodeJS.ErrnoException).code === 'ENOENT') return []; throw error; }
}

export async function prepare(slug: string, rootDir = root) {
  validateSlug(slug);
  const source = join(rootDir, '.media', slug);
  const filenames = (await readdir(source, { withFileTypes: true }))
    .filter((file) => file.isFile() && /\.(jpe?g|png|webp|avif|tiff?)$/i.test(file.name))
    .map((file) => file.name).sort();
  if (!filenames.length) throw new Error(`画像がありません: ${source}`);
  const previous = await readPhotos(slug, rootDir);
  const byFilename = new Map(previous.map((photo) => [photo.filename, photo]));
  const missing = previous.filter((photo) => !filenames.includes(photo.filename));
  if (missing.length) throw new Error(`既存の元画像が見つかりません。自動削除はしません: ${missing.map((p) => p.filename).join(', ')}`);
  // Keep manually edited ordering and descriptions, append newly added photos.
  const order = [...previous.map((p) => p.filename), ...filenames.filter((name) => !byFilename.has(name))];
  const photos: Photo[] = [];
  let totalBytes = 0;
  for (const filename of order) {
    const input = await readFile(join(source, filename));
    const variants = [];
    for (const size of [480, 1920]) {
      const { data, info } = await sharp(input).rotate()
        .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
        .webp({ quality: size === 480 ? 75 : 82 }).toBuffer({ resolveWithObject: true });
      const hash = createHash('sha256').update(data).digest('hex');
      const key = `galleries/${slug}/${hash}-${size}.webp`;
      const target = join(rootDir, '.media-cache', key);
      await mkdir(dirname(target), { recursive: true });
      await writeFile(target, data);
      totalBytes += data.length;
      variants.push({ key, width: info.width, height: info.height });
    }
    const old = byFilename.get(filename);
    photos.push({ id: old?.id ?? filename.replace(/\.[^.]+$/, ''), filename, alt: old?.alt ?? '',
      src: variants[1].key, thumbnail: variants[0].key,
      width: variants[1].width, height: variants[1].height,
      thumbnailWidth: variants[0].width, thumbnailHeight: variants[0].height });
  }
  await mkdir(dirname(manifestPath(slug, rootDir)), { recursive: true });
  await writeFile(manifestPath(slug, rootDir), `${JSON.stringify(photos, null, 2)}\n`);
  console.log(`準備完了: ${photos.length} 枚 / 表示用合計 ${(totalBytes / 1024 / 1024).toFixed(2)} MiB`);
  return photos;
}

export async function uploadObjects(client: Pick<S3Client, 'send'>, Bucket: string, keys: string[], read: (key: string) => Promise<Buffer>) {
  let uploaded = 0;
  let checked = 0;
  for (const Key of keys) {
    checked++;
    if (checked % 25 === 0) console.log(`R2 確認中: ${checked} / ${keys.length}`);
    try { await client.send(new HeadObjectCommand({ Bucket, Key })); continue; }
    catch (error) {
      if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode !== 404) throw error;
    }
    await client.send(new PutObjectCommand({ Bucket, Key, Body: await read(Key),
      ContentType: 'image/webp', CacheControl: 'public, max-age=31536000, immutable' }));
    uploaded++;
  }
  return uploaded;
}

function r2Client() {
  const required = ['R2_ACCOUNT_ID', 'R2_BUCKET', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY'];
  const missing = required.filter((name) => !process.env[name]);
  if (missing.length) throw new Error(`.env.local に設定してください: ${missing.join(', ')}`);
  if (!/^[a-f0-9]{32}$/i.test(process.env.R2_ACCOUNT_ID!)) throw new Error('R2_ACCOUNT_ID の形式が不正です。');
  return new S3Client({ region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: process.env.R2_ACCESS_KEY_ID!, secretAccessKey: process.env.R2_SECRET_ACCESS_KEY! },
    maxAttempts: 3 });
}

// Import manually uploaded originals without changing or deleting any remote files.
export async function pull(slug: string) {
  validateSlug(slug);
  const client = r2Client();
  const destination = join(root, '.media', slug);
  await mkdir(destination, { recursive: true });
  let token: string | undefined;
  let count = 0;
  try {
    do {
      const result = await client.send(new ListObjectsV2Command({ Bucket: process.env.R2_BUCKET!,
        Prefix: `${slug}/`, ContinuationToken: token }));
      for (const object of result.Contents ?? []) {
        const key = object.Key!;
        const filename = key.slice(slug.length + 1);
        if (!filename || /[\\/]/.test(filename) || !/\.(jpe?g|png|webp|avif|tiff?)$/i.test(filename)) continue;
        const target = join(destination, filename);
        try { await access(target); continue; }
        catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error; }
        const response = await client.send(new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key }));
        if (!response.Body) throw new Error(`画像が空です: ${key}`);
        await writeFile(target, await response.Body.transformToByteArray(), { flag: 'wx' });
        count++;
      }
      token = result.IsTruncated ? result.NextContinuationToken : undefined;
    } while (token);
  } finally { client.destroy(); }
  console.log(`取り込み完了: ${count} 枚。既存の元画像は上書きしません。続けて media:prepare を実行してください。`);
}

export async function upload(slug: string, dryRun = false) {
  validateSlug(slug);
  const photos = await readPhotos(slug);
  if (!photos.length) throw new Error('先に media:prepare を実行してください。');
  const keys = [...new Set(photos.flatMap((p) => [p.thumbnail, p.src]))];
  for (const key of keys) {
    if (!new RegExp(`^galleries/${slug}/[a-f0-9]{64}-(480|1920)\\.webp$`).test(key)) {
      throw new Error(`不正な画像キー: ${key}`);
    }
    await access(join(cacheRoot, key));
  }
  if (dryRun) { console.log(`dry-run: ${keys.length} ファイルを確認。通信・アップロードは行いません。`); return; }
  const client = r2Client();
  let uploaded = 0;
  try {
    uploaded = await uploadObjects(client, process.env.R2_BUCKET!, keys, (key) => readFile(join(cacheRoot, key)));
  } finally { client.destroy(); }
  console.log(`アップロード完了: 新規 ${uploaded} / 既存 ${keys.length - uploaded}。削除は行いません。`);
}

if (import.meta.main) {
  const [command, slug, ...flags] = process.argv.slice(2);
  try {
    validateSlug(slug ?? '');
    if (command === 'prepare') await prepare(slug);
    else if (command === 'upload') await upload(slug, flags.includes('--dry-run'));
    else if (command === 'pull') await pull(slug);
    else throw new Error('使い方: bun scripts/media.ts prepare|upload|pull 記事ID [--dry-run]');
  } catch (error) { console.error(error instanceof Error ? error.message : '画像処理に失敗しました。'); process.exitCode = 1; }
}
