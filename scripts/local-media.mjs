import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';

// Only the dev server serves the ignored local image cache. No image copy in builds.
export function localMedia() {
  return {
    name: 'local-media',
    configureServer(server) {
      const root = resolve('.media-cache');
      server.middlewares.use('/media/', async (req, res, next) => {
        try {
          const key = decodeURIComponent((req.url ?? '').split('?')[0]).replace(/^\/+/, '');
          const file = resolve(root, key);
          if (!file.startsWith(root + sep) || !file.endsWith('.webp')) { res.statusCode = 404; res.end(); return; }
          const info = await stat(file);
          if (!info.isFile()) { next(); return; }
          res.setHeader('Content-Type', 'image/webp');
          res.setHeader('Content-Length', info.size);
          res.setHeader('Cache-Control', 'no-cache');
          if (req.method === 'HEAD') { res.end(); return; }
          createReadStream(file).on('error', () => res.destroy()).pipe(res);
        } catch (error) {
          if (error.code === 'ENOENT' || error instanceof URIError) { next(); return; }
          next(error);
        }
      });
    },
  };
}
