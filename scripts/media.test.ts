import { expect, test } from 'bun:test';
import { mkdtemp, mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import sharp from 'sharp';
import { HeadObjectCommand, PutObjectCommand, type S3Client } from '@aws-sdk/client-s3';
import { manifestPath, prepare, uploadObjects, validateSlug } from './media';
import { mediaUrl } from '../src/lib/gallery';

test('prepare preserves edited order and descriptions and creates stripped, bounded images', async () => {
  const root = await mkdtemp(join(tmpdir(), 'blog-media-'));
  try {
    const folder = join(root, '.media', 'test');
    await mkdir(folder, { recursive: true });
    const image = await sharp({ create: { width: 2100, height: 1000, channels: 3, background: '#aabbcc' } })
      .withMetadata({ orientation: 6 }).jpeg().toBuffer();
    await writeFile(join(folder, 'b.jpg'), image);
    const first = await prepare('test', root);
    expect(first[0].width).toBeLessThanOrEqual(1920);
    expect(first[0].height).toBeLessThanOrEqual(1920);
    expect(first[0].height).toBeGreaterThan(first[0].width);
    expect(first[0].thumbnailHeight).toBeLessThanOrEqual(480);
    const metadata = await sharp(await readFile(join(root, '.media-cache', first[0].src))).metadata();
    expect(metadata.exif).toBeUndefined();
    expect(metadata.format).toBe('webp');
    first[0].alt = '編集した説明';
    await writeFile(manifestPath('test', root), JSON.stringify(first));
    await writeFile(join(folder, 'a.jpg'), image);
    const second = await prepare('test', root);
    expect(second.map((p) => p.filename)).toEqual(['b.jpg', 'a.jpg']);
    expect(second[0].alt).toBe('編集した説明');
    expect(second[0].src).toBe(first[0].src);
    await rm(join(folder, 'b.jpg'));
    await expect(prepare('test', root)).rejects.toThrow('自動削除はしません');
    expect(JSON.parse(await readFile(manifestPath('test', root), 'utf8'))).toEqual(second);
  } finally {
    // mkdtemp creates this directory directly under the system temp directory.
    if (!root.startsWith(join(tmpdir(), 'blog-media-'))) throw new Error('Unexpected test directory');
    await rm(root, { recursive: true, force: true });
  }
});

test('upload skips existing objects, uploads missing objects, and stops on permission errors', async () => {
  const puts: any[] = [];
  const client = { send: async (command: any) => {
    if (command instanceof HeadObjectCommand) {
      if (command.input.Key === 'existing') return {};
      throw { $metadata: { httpStatusCode: command.input.Key === 'denied' ? 403 : 404 } };
    }
    expect(command).toBeInstanceOf(PutObjectCommand);
    puts.push(command.input);
    return {};
  } } as unknown as Pick<S3Client, 'send'>;
  expect(await uploadObjects(client, 'bucket', ['existing', 'missing'], async () => Buffer.from('image'))).toBe(1);
  expect(puts[0].Key).toBe('missing');
  expect(puts[0].CacheControl).toContain('immutable');
  await expect(uploadObjects(client, 'bucket', ['denied', 'never'], async () => Buffer.from('image'))).rejects.toBeDefined();
  expect(puts).toHaveLength(1);
});

test('rejects unsafe slugs and requires production media configuration', () => {
  expect(() => validateSlug('../escape')).toThrow();
  expect(() => validateSlug('')).toThrow();
  expect(mediaUrl('galleries/test/a.webp', '/media')).toBe('/media/galleries/test/a.webp');
  expect(mediaUrl('galleries/test/a.webp', 'https://images.example.com/')).toBe('https://images.example.com/galleries/test/a.webp');
  expect(() => mediaUrl('galleries/test/a.webp', '')).toThrow('PUBLIC_MEDIA_BASE_URL');
});
