import { ProductItem, SheetTab } from '../types/index';
import { parseProductUrl } from './agentConverter';

export const SHEET_TABS: SheetTab[] = [
  { id: 'clothes', name: 'Clothes', gid: '171908810', iconName: 'Shirt' },
  { id: 'shoes', name: 'Shoes', gid: '0', iconName: 'Footprints' },
  { id: 'wallets_bags', name: 'Wallets & Bags', gid: '1781215613', iconName: 'Briefcase' },
  { id: 'belts', name: 'Belts', gid: '123051115', iconName: 'CircleDot' },
  { id: 'jewelry', name: 'Jewelry', gid: '1185471226', iconName: 'Gem' },
  { id: 'room_accessories', name: 'Room & Living', gid: '1793262695', iconName: 'Home' },
  { id: 'electronics', name: 'Electronics', gid: '549136216', iconName: 'Headphones' },
  { id: 'gym', name: 'Gym & Sports', gid: '245613678', iconName: 'Dumbbell' },
  { id: 'glasses', name: 'Glasses & Eyewear', gid: '256492244', iconName: 'Glasses' },
];

export const DEFAULT_SHEET_ID = '14f3ISAO2u_Eo9erhLnl0heeDqchbwbAFRdl9LcAkDCc';

/**
 * Replaces any original sheet creator referral codes (e.g. 29TOTHGNH) with user's locked Oopbuy code
 */
export function sanitizeSheetReferralUrl(url: string): string {
  if (!url) return url;
  return url
    .replace(/inviteCode=29TOTHGNH/gi, 'inviteCode=4MPOITBZV')
    .replace(/inviteCode%3D29TOTHGNH/gi, 'inviteCode%3D4MPOITBZV');
}

/**
 * Parses Google Sheets HTML from /htmlview/sheet?... into ProductItems
 */
export function parseSheetHtml(html: string, categoryName: string = 'General'): ProductItem[] {
  const items: ProductItem[] = [];
  const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
  let trMatch: RegExpExecArray | null;
  let index = 0;

  while ((trMatch = trRegex.exec(html)) !== null) {
    const tr = trMatch[1];
    const tds = [...tr.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(m => m[1]);
    if (tds.length === 0) continue;

    let title = '';
    let image = '';
    let buyLinks: { url: string; text: string }[] = [];
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

        // unwrap Google redirect
        const gUrlMatch = href.match(/google\.com\/url\?q=([^&]+)/);
        if (gUrlMatch) {
          href = decodeURIComponent(gUrlMatch[1]);
        }

        // Sanitize any sheet creator referral codes immediately
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
        // Price detection: e.g. "$18", "18$", "82$(SET)", "$76(SET)", "6$"
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

      // Clean title format if contains line breaks or duplicated tokens
      const cleanTitle = title
        .replace(/[\r\n]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

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
