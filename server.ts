import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseSheetHtml, SHEET_TABS, DEFAULT_SHEET_ID } from './src/utils/sheetParser.ts';
import { DEFAULT_AGENTS } from './src/utils/agentConverter.ts';
import { ProductItem } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// In-memory cache for sheet data: key = `${sheetId}_${gid}` -> { items: ProductItem[], timestamp: number }
interface CacheEntry {
  items: ProductItem[];
  timestamp: number;
  category: string;
}
const sheetCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

// Store Google session cookies captured from htmlview/sheet to authenticate sheets-images-rt requests
let latestGoogleCookies = '';
let cookieRefreshPromise: Promise<void> | null = null;

// In-memory cache for proxied images (max 2500 entries so all sheet items stay cached)
const imageBufferCache = new Map<string, { buffer: Buffer; contentType: string }>();
const MAX_IMAGE_CACHE = 2500;

// In-flight deduplication map so identical image requests share the same promise
const inFlightImages = new Map<string, Promise<{ buffer: Buffer; contentType: string } | null>>();

// Concurrency limiter for upstream Google image requests (prevents 429 rate-limiting on burst scroll)
const MAX_CONCURRENT_UPSTREAM = 8;
let activeUpstreamCount = 0;
const waitQueue: Array<() => void> = [];

async function withConcurrencyLimit<T>(fn: () => Promise<T>): Promise<T> {
  if (activeUpstreamCount >= MAX_CONCURRENT_UPSTREAM) {
    await new Promise<void>(resolve => waitQueue.push(resolve));
  }
  activeUpstreamCount++;
  try {
    return await fn();
  } finally {
    activeUpstreamCount--;
    const next = waitQueue.shift();
    if (next) next();
  }
}

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function extractCookieHeader(res: globalThis.Response): string {
  const rawCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : [res.headers.get('set-cookie') || ''];
  return rawCookies
    .filter(Boolean)
    .map(c => c.split(';')[0])
    .join('; ');
}

async function fetchTabFromGoogle(sheetId: string, gid: string, categoryName: string): Promise<ProductItem[]> {
  const url = `https://docs.google.com/spreadsheets/u/0/d/${sheetId}/htmlview/sheet?pli=1&headers=true&gid=${gid}`;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 14000);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timeoutId);

    const newCookies = extractCookieHeader(res);
    if (newCookies) {
      latestGoogleCookies = newCookies;
    }

    if (!res.ok) {
      throw new Error(`Google Sheets responded with status ${res.status}`);
    }

    const html = await res.text();
    const items = parseSheetHtml(html, categoryName);
    return items;
  } catch (err: unknown) {
    clearTimeout(timeoutId);
    console.error(`Error fetching sheet ${sheetId} gid ${gid}:`, err);
    throw err;
  }
}

// Ensure we have valid Google session cookies if image proxy is called before sheet fetch
async function ensureGoogleCookies(forceRefresh = false): Promise<void> {
  if (latestGoogleCookies && !forceRefresh) return;
  if (cookieRefreshPromise) {
    return cookieRefreshPromise;
  }
  cookieRefreshPromise = (async () => {
    try {
      const url = `https://docs.google.com/spreadsheets/u/0/d/${DEFAULT_SHEET_ID}/htmlview/sheet?pli=1&headers=true&gid=171908810`;
      const res = await fetch(url, {
        headers: { 'User-Agent': USER_AGENT },
      });
      const cookies = extractCookieHeader(res);
      if (cookies) {
        latestGoogleCookies = cookies;
      }
    } catch {
      // ignore handshake error
    } finally {
      cookieRefreshPromise = null;
    }
  })();
  return cookieRefreshPromise;
}

async function fetchUpstreamImageWithRetry(rawUrl: string): Promise<{ buffer: Buffer; contentType: string } | null> {
  const isSheetsImg = rawUrl.includes('sheets-images-rt');
  const highResUrl = isSheetsImg ? rawUrl.replace(/=w\d+-h\d+$/, '=w320-h320') : rawUrl;

  if (isSheetsImg) {
    await ensureGoogleCookies(false);
  }

  const urlsToTry = isSheetsImg && highResUrl !== rawUrl ? [highResUrl, rawUrl] : [rawUrl];

  for (let attempt = 0; attempt < 3; attempt++) {
    const candidateUrl = urlsToTry[Math.min(attempt, urlsToTry.length - 1)];
    try {
      const imgRes = await withConcurrencyLimit(() =>
        fetch(candidateUrl, {
          headers: {
            'User-Agent': USER_AGENT,
            ...(latestGoogleCookies ? { Cookie: latestGoogleCookies } : {}),
            Referer: `https://docs.google.com/spreadsheets/u/0/d/${DEFAULT_SHEET_ID}/htmlview`,
          },
        })
      );

      if (imgRes.ok) {
        const contentType = imgRes.headers.get('content-type') || 'image/png';
        const arrayBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (buffer.length > 0) {
          return { buffer, contentType };
        }
      }

      if (imgRes.status === 403 && isSheetsImg) {
        await ensureGoogleCookies(true);
      } else if (imgRes.status === 429) {
        await new Promise(r => setTimeout(r, 250 * (attempt + 1)));
      }
    } catch {
      await new Promise(r => setTimeout(r, 150 * (attempt + 1)));
    }
  }

  return null;
}

// 0. Image Proxy Endpoint for Google Sheets product images & Agent Logos
app.get('/api/image-proxy', async (req: Request, res: Response) => {
  const rawUrl = req.query.url as string;
  if (
    !rawUrl ||
    (!rawUrl.startsWith('https://docs.google.com/') &&
      !rawUrl.startsWith('https://www.google.com/s2/favicons') &&
      !rawUrl.startsWith('https://lh3.googleusercontent.com/'))
  ) {
    return res.status(400).send('Invalid image URL');
  }

  const cachedImg = imageBufferCache.get(rawUrl);
  if (cachedImg) {
    res.setHeader('Content-Type', cachedImg.contentType);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cachedImg.buffer);
  }

  let fetchPromise = inFlightImages.get(rawUrl);
  if (!fetchPromise) {
    fetchPromise = fetchUpstreamImageWithRetry(rawUrl).finally(() => {
      inFlightImages.delete(rawUrl);
    });
    inFlightImages.set(rawUrl, fetchPromise);
  }

  const result = await fetchPromise;
  if (!result) {
    return res.status(502).send('Image unavailable');
  }

  if (imageBufferCache.size >= MAX_IMAGE_CACHE) {
    const firstKey = imageBufferCache.keys().next().value;
    if (firstKey) imageBufferCache.delete(firstKey);
  }
  imageBufferCache.set(rawUrl, result);

  res.setHeader('Content-Type', result.contentType);
  res.setHeader('Cache-Control', 'public, max-age=86400');
  return res.send(result.buffer);
});

// 1. Get available tabs / categories
app.get('/api/tabs', (_req: Request, res: Response) => {
  res.json({
    defaultSheetId: DEFAULT_SHEET_ID,
    tabs: SHEET_TABS,
  });
});

// 2. Get default agents metadata
app.get('/api/agents', (_req: Request, res: Response) => {
  res.json({ agents: DEFAULT_AGENTS });
});

// 3. Get sheet items for a tab (with real-time cache & auto-sync)
app.get('/api/sheet-data', async (req: Request, res: Response) => {
  const sheetId = (req.query.sheetId as string) || DEFAULT_SHEET_ID;
  const gid = (req.query.gid as string) || '171908810'; // default Clothes
  const force = req.query.force === 'true';

  const tab = SHEET_TABS.find(t => t.gid === gid);
  const categoryName = tab ? tab.name : 'Category';

  const cacheKey = `${sheetId}_${gid}`;
  const now = Date.now();
  const cached = sheetCache.get(cacheKey);

  if (!force && cached && (now - cached.timestamp < CACHE_TTL_MS)) {
    return res.json({
      success: true,
      cached: true,
      gid,
      category: cached.category,
      itemCount: cached.items.length,
      lastSynced: new Date(cached.timestamp).toISOString(),
      items: cached.items,
    });
  }

  try {
    const items = await fetchTabFromGoogle(sheetId, gid, categoryName);
    sheetCache.set(cacheKey, {
      items,
      timestamp: now,
      category: categoryName,
    });

    res.json({
      success: true,
      cached: false,
      gid,
      category: categoryName,
      itemCount: items.length,
      lastSynced: new Date(now).toISOString(),
      items,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (cached) {
      return res.json({
        success: true,
        cached: true,
        stale: true,
        warning: `Live refresh failed (${errorMessage}), served cached inventory.`,
        gid,
        category: cached.category,
        itemCount: cached.items.length,
        lastSynced: new Date(cached.timestamp).toISOString(),
        items: cached.items,
      });
    }

    res.status(502).json({
      success: false,
      error: `Could not fetch inventory from Google Sheets: ${errorMessage}`,
    });
  }
});

// 4. Force sync endpoint
app.post('/api/sync', async (req: Request, res: Response) => {
  const sheetId = (req.body.sheetId as string) || DEFAULT_SHEET_ID;
  const gid = (req.body.gid as string) || '171908810';

  const tab = SHEET_TABS.find(t => t.gid === gid);
  const categoryName = tab ? tab.name : 'Category';
  const cacheKey = `${sheetId}_${gid}`;

  try {
    const items = await fetchTabFromGoogle(sheetId, gid, categoryName);
    const now = Date.now();
    sheetCache.set(cacheKey, {
      items,
      timestamp: now,
      category: categoryName,
    });

    res.json({
      success: true,
      message: `Successfully synchronized ${items.length} items from Google Sheet.`,
      gid,
      category: categoryName,
      itemCount: items.length,
      lastSynced: new Date(now).toISOString(),
      items,
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({
      success: false,
      error: `Sync error: ${errorMessage}`,
    });
  }
});

async function startServer() {
  const numericPort = Number(PORT) || 3000;

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });

    // Prevent Vite 8's /@vite/client from attempting a failing WebSocket connection when HMR is disabled
    app.get('/@vite/client', async (_req: Request, res: Response, next) => {
      try {
        const result = await vite.transformRequest('/@vite/client');
        if (result?.code) {
          const patchedCode = result.code
            .replace(/transport\.connect\(createHMRHandler\(handleMessage\)\);/g, '/* HMR WebSocket disabled */')
            .replace(/setupForwardConsoleHandler\(transport,\s*forwardConsole\);/g, '/* Console forwarding disabled */');
          res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
          res.setHeader('Cache-Control', 'no-store');
          res.status(200).send(patchedCode);
          return;
        }
      } catch {
        // Fallback to standard Vite middleware if transformRequest fails
      }
      next();
    });

    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(numericPort, '0.0.0.0', () => {
    console.log(`[OhMyReps Server] Running on http://0.0.0.0:${numericPort}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;
