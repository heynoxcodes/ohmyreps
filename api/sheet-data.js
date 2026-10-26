const DEFAULT_SHEET_ID = '14f3ISAO2u_Eo9erhLnl0heeDqchbwbAFRdl9LcAkDCc';

const SHEET_TABS = [
  { id: 'clothes', name: 'Clothes', gid: '171908810' },
  { id: 'shoes', name: 'Shoes', gid: '0' },
  { id: 'wallets_bags', name: 'Wallets & Bags', gid: '1781215613' },
  { id: 'belts', name: 'Belts', gid: '123051115' },
  { id: 'jewelry', name: 'Jewelry', gid: '1185471226' },
  { id: 'room_accessories', name: 'Room & Living', gid: '1793262695' },
  { id: 'electronics', name: 'Electronics', gid: '549136216' },
  { id: 'gym', name: 'Gym & Sports', gid: '245613678' },
  { id: 'glasses', name: 'Glasses & Eyewear', gid: '256492244' },
];

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const sheetCache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000;

function sanitizeSheetReferralUrl(url) {
  if (!url) return url;
  return url
    .replace(/inviteCode=29TOTHGNH/gi, 'inviteCode=4MPOITBZV')
    .replace(/inviteCode%3D29TOTHGNH/gi, 'inviteCode%3D4MPOITBZV');
}

function parseProductUrl(rawInput) {
  const input = (rawInput || '').trim();
  if (!input) return { platform: 'unknown', id: '', rawStoreUrl: '' };

  let decoded = input;
  try {
    decoded = decodeURIComponent(input);
  } catch {
    decoded = input;
  }

  const oopbuyMatch = decoded.match(/oopbuy\.com\/product\/(weidian|taobao|1688|0|1|2)\/(\d+)/i);
  if (oopbuyMatch) {
    const type = oopbuyMatch[1].toLowerCase();
    const id = oopbuyMatch[2];
    if (type === 'weidian' || type === '2') {
      return { platform: 'weidian', id, rawStoreUrl: `https://weidian.com/item.html?itemID=${id}` };
    }
    if (type === '1688' || type === '0') {
      return { platform: '1688', id, rawStoreUrl: `https://detail.1688.com/offer/${id}.html` };
    }
    return { platform: 'taobao', id, rawStoreUrl: `https://item.taobao.com/item.htm?id=${id}` };
  }

  const weidianMatch = decoded.match(/(?:itemID|itemId)=(\d+)/i) || decoded.match(/weidian\.com\/item\.html\?id=(\d+)/i);
  if (weidianMatch) {
    const id = weidianMatch[1];
    return { platform: 'weidian', id, rawStoreUrl: `https://weidian.com/item.html?itemID=${id}` };
  }

  const offerMatch = decoded.match(/1688\.com\/offer\/(\d+)\.html/i);
  if (offerMatch) {
    const id = offerMatch[1];
    return { platform: '1688', id, rawStoreUrl: `https://detail.1688.com/offer/${id}.html` };
  }

  const taobaoMatch = decoded.match(/[?&]id=(\d+)/i);
  if (taobaoMatch && (decoded.includes('taobao.com') || decoded.includes('tmall.com'))) {
    const id = taobaoMatch[1];
    return { platform: 'taobao', id, rawStoreUrl: `https://item.taobao.com/item.htm?id=${id}` };
  }

  return { platform: 'unknown', id: '', rawStoreUrl: input };
}

function parseSheetHtml(html, categoryName = 'General') {
  const items = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let trMatch;
  let index = 0;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const tr = trMatch[1];
    const tds = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1]);
    if (tds.length === 0) continue;

    let title = '';
    let image = '';
    const buyLinks = [];
    let qcLink = '';
    let price = '';
    let priceNum = 0;
    let notes = '';
    let seller = '';

    for (const td of tds) {
      const text = td.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
      const imgMatch = td.match(/src="([^"]+)"/);
      if (imgMatch && !image) {
        image = imgMatch[1];
      }

      const aMatches = [...td.matchAll(/href="([^"]+)"[^>]*>([^<]*)/g)];
      for (const a of aMatches) {
        let href = a[1];
        const linkText = a[2].trim();

        const gUrlMatch = href.match(/google\.com\/url\?q=([^&]+)/);
        if (gUrlMatch) {
          try {
            href = decodeURIComponent(gUrlMatch[1]);
          } catch {
            href = gUrlMatch[1];
          }
        }

        href = sanitizeSheetReferralUrl(href);

        const isQc =
          href.includes('uufinds.com') ||
          href.includes('yupoo.com') ||
          linkText.toLowerCase().includes('qc') ||
          linkText.toLowerCase().includes('pics');

        if (isQc) {
          if (!qcLink) qcLink = href;
        } else if (
          href.includes('oopbuy.com') ||
          href.includes('weidian.com') ||
          href.includes('taobao.com') ||
          href.includes('1688.com') ||
          href.includes('tmall.com')
        ) {
          buyLinks.push({ url: href, text: linkText || 'Buy Link' });
        }
      }

      if (text) {
        const priceMatch = text.match(/\$?(\d+(?:\.\d+)?)\s*\$?(?:\(SET\))?/i);
        const looksLikePrice =
          (/^\$?\d+(\.\d+)?\s*\$?(\(SET\))?$/i.test(text) || text.endsWith('$') || text.includes('$(SET)')) &&
          text.length < 15;

        if (looksLikePrice && !price && priceMatch) {
          price = text;
          priceNum = parseFloat(priceMatch[1]);
        } else if (text.toLowerCase().includes('set ') && text.includes('$') && !notes) {
          notes = text;
        } else if (
          !title &&
          text.length > 2 &&
          !text.includes('SIGNUP') &&
          !text.includes('Spreadsheet') &&
          !text.includes('30% OFF') &&
          text !== 'Product' &&
          text !== 'QC Pics' &&
          text !== 'pics' &&
          !looksLikePrice
        ) {
          title = text;
        } else if (
          !seller &&
          text !== 'QC Pics' &&
          text !== 'pics' &&
          text !== title &&
          !text.includes('$') &&
          text.length > 1 &&
          text.length <= 25
        ) {
          seller = text;
        }
      }
    }

    if (title && (buyLinks.length > 0 || image || price)) {
      const primaryUrl = buyLinks[0]?.url || '';
      const parsedUrl = parseProductUrl(primaryUrl);
      const cleanTitle = title.replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim();

      items.push({
        id: `item-${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${index++}`,
        title: cleanTitle,
        category: categoryName,
        price: price || '$25',
        priceNum: priceNum || 25,
        seller: seller || 'Direct Batch',
        image: image || '',
        buyLinks,
        qcLink: qcLink || undefined,
        notes: notes || undefined,
        rawUrl: parsedUrl.rawStoreUrl || primaryUrl,
        platform: parsedUrl.platform,
        productId: parsedUrl.id,
      });
    }
  }

  return items;
}

export default async function handler(req, res) {
  const sheetId = req.query?.sheetId || DEFAULT_SHEET_ID;
  const gid = req.query?.gid || '171908810';
  const force = req.query?.force === 'true';

  const tab = SHEET_TABS.find(t => t.gid === gid);
  const categoryName = tab ? tab.name : 'Category';
  const cacheKey = `${sheetId}_${gid}`;
  const now = Date.now();
  const cached = sheetCache.get(cacheKey);

  if (!force && cached && now - cached.timestamp < CACHE_TTL_MS) {
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
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
    const url = `https://docs.google.com/spreadsheets/u/0/d/${sheetId}/htmlview/sheet?pli=1&headers=true&gid=${gid}`;
    const upstreamRes = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
      },
    });

    if (!upstreamRes.ok) {
      throw new Error(`Google Sheets responded with status ${upstreamRes.status}`);
    }

    const html = await upstreamRes.text();
    const items = parseSheetHtml(html, categoryName);

    sheetCache.set(cacheKey, {
      items,
      timestamp: now,
      category: categoryName,
    });

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      success: true,
      cached: false,
      gid,
      category: categoryName,
      itemCount: items.length,
      lastSynced: new Date(now).toISOString(),
      items,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    if (cached) {
      return res.status(200).json({
        success: true,
        cached: true,
        stale: true,
        gid,
        category: cached.category,
        itemCount: cached.items.length,
        lastSynced: new Date(cached.timestamp).toISOString(),
        items: cached.items,
      });
    }
    return res.status(502).json({
      success: false,
      error: `Could not fetch inventory from Google Sheets: ${errorMessage}`,
    });
  }
}
