const DEFAULT_SHEET_ID = '14f3ISAO2u_Eo9erhLnl0heeDqchbwbAFRdl9LcAkDCc';
const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

let latestGoogleCookies = '';

function extractCookieHeader(res) {
  const rawCookies =
    typeof res.headers.getSetCookie === 'function'
      ? res.headers.getSetCookie()
      : [res.headers.get('set-cookie') || ''];
  return rawCookies
    .filter(Boolean)
    .map(c => c.split(';')[0])
    .join('; ');
}

async function ensureGoogleCookies(forceRefresh = false) {
  if (latestGoogleCookies && !forceRefresh) return;
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
    // ignore cookie warmup error
  }
}

export default async function handler(req, res) {
  const rawUrl = req.query?.url;
  if (
    !rawUrl ||
    typeof rawUrl !== 'string' ||
    (!rawUrl.startsWith('https://docs.google.com/') &&
      !rawUrl.startsWith('https://www.google.com/s2/favicons') &&
      !rawUrl.includes('googleusercontent.com'))
  ) {
    return res.status(400).send('Invalid image URL');
  }

  const isSheetsImg = rawUrl.includes('sheets-images-rt') || rawUrl.includes('googleusercontent.com');
  const highResUrl = isSheetsImg ? rawUrl.replace(/=w\d+-h\d+$/, '=w320-h320') : rawUrl;

  if (isSheetsImg) {
    await ensureGoogleCookies(false);
  }

  const urlsToTry = isSheetsImg && highResUrl !== rawUrl ? [highResUrl, rawUrl] : [rawUrl];

  for (let attempt = 0; attempt < 2; attempt++) {
    const candidateUrl = urlsToTry[Math.min(attempt, urlsToTry.length - 1)];
    try {
      const imgRes = await fetch(candidateUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          ...(latestGoogleCookies ? { Cookie: latestGoogleCookies } : {}),
          Referer: `https://docs.google.com/spreadsheets/u/0/d/${DEFAULT_SHEET_ID}/htmlview`,
        },
      });

      if (imgRes.ok) {
        const contentType = imgRes.headers.get('content-type') || 'image/png';
        const arrayBuffer = await imgRes.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        if (buffer.length > 0) {
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
          return res.status(200).send(buffer);
        }
      }

      if (imgRes.status === 403 && isSheetsImg) {
        await ensureGoogleCookies(true);
      }
    } catch {
      // try next attempt
    }
  }

  return res.status(502).send('Image unavailable');
}
