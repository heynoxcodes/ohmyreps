import { ProductItem } from '../types/index.ts';

/**
 * Decodes HTML entities that occasionally appear in raw Google Sheet titles
 */
export function cleanProductTitle(title: string): string {
  if (!title) return '';
  return title
    .replace(/&amp;/gi, '&')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/gi, '"')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

/**
 * Deterministic 32-bit FNV-1a hash with an OHMYREPS salt so the catalog order
 * is 100% consistent across page reloads while completely scrambled from the raw sheet.
 */
function hashStringWithSalt(str: string, salt: string): number {
  const input = `${salt}::omr_v3::${str}`;
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * Recognizable opening items from the raw spreadsheet that would give away
 * the spreadsheet source if shown near the top.
 */
const SOURCE_SHEET_OPENERS = [
  'nike miler',
  'milerjacket',
  'dri-fit',
  'itau vivo',
  'nike trail',
  'air force one white',
  'air force one black',
  'air force one supreme',
  'marco wallet',
  'jour monogram',
  'onyx 5.0',
  'ugg tasman',
  'kaws figure',
];

/**
 * High-demand streetwear & luxury keywords that deserve priority in OMR's custom Featured sort
 */
const CURATED_GRAIL_KEYWORDS = [
  'chrome hearts',
  'balenciaga',
  'arc\'teryx',
  'arcteryx',
  'corteiz',
  'stone island',
  'maison margiela',
  'margiela',
  'rick owens',
  'stussy',
  'stüssy',
  'off-white',
  'gallery dept',
  'travis scott',
  'goyard',
  'prada',
  'dior',
  'van cleef',
  'audemars',
  'cartier',
  'vivienne westwood',
  'oakley',
  'cp company',
  'c.p. company',
  'carhartt',
  'vetements',
  'hellstar',
  'denim tears',
  'sp5der',
  'bape',
  'supreme',
  'moncler',
  'burberry',
  'bottega',
  'hermes',
  'loewe',
  'marni',
  'acne studios',
  'ami paris',
  'ralph lauren',
  'jordan 4',
  'jordan 1',
  'dunk',
  'yeezy',
  'new balance',
  'asics',
  'salomon',
  'golden goose',
  'track',
  'runner',
  'gats',
];

function isSourceSheetOpener(titleLower: string, originalIndex: number): boolean {
  // Always push the raw first 18 rows of any tab away from the top
  if (originalIndex < 18) return true;
  return SOURCE_SHEET_OPENERS.some(kw => titleLower.includes(kw));
}

function getGrailPriorityBoost(titleLower: string): number {
  for (let i = 0; i < CURATED_GRAIL_KEYWORDS.length; i++) {
    if (titleLower.includes(CURATED_GRAIL_KEYWORDS[i])) {
      return 3500 - i * 25;
    }
  }
  return 0;
}

/**
 * Re-orders any category's items into a custom, deterministic OHMYREPS! Featured order
 * so the original spreadsheet sequence (like Nike Miler first, AF1 White first, etc.)
 * is never exposed at the top.
 */
export function getOmrFeaturedOrder(items: ProductItem[], gid: string): ProductItem[] {
  if (!items || items.length <= 1) return items;

  const scored = items.map((item, originalIndex) => {
    const cleanTitle = cleanProductTitle(item.title);
    const titleLower = cleanTitle.toLowerCase();
    const hasImage = Boolean(item.image && item.image.trim().length > 5);
    const openerPenalty = isSourceSheetOpener(titleLower, originalIndex) ? -25000 : 0;
    const imageBoost = hasImage ? 10000 : -15000;
    const grailBoost = getGrailPriorityBoost(titleLower);

    // Deterministic pseudo-random spread across the catalog
    const hashVal = hashStringWithSalt(`${item.id}-${cleanTitle}`, `omr-featured-${gid}`);
    const hashScore = (hashVal % 8000);

    const totalScore = imageBoost + openerPenalty + grailBoost + hashScore;

    return {
      item: cleanTitle !== item.title ? { ...item, title: cleanTitle } : item,
      totalScore,
      hashVal,
    };
  });

  scored.sort((a, b) => {
    if (b.totalScore !== a.totalScore) {
      return b.totalScore - a.totalScore;
    }
    return b.hashVal - a.hashVal;
  });

  // Ensure no more than 2 items from the exact same brand keyword sit back-to-back in the top 30
  const topSlice = scored.slice(0, Math.min(45, scored.length));
  const restSlice = scored.slice(Math.min(45, scored.length));

  const diversifiedTop: typeof scored = [];
  const deferred: typeof scored = [];
  const brandCountsInWindow: Record<string, number> = {};

  for (const entry of topSlice) {
    const firstWord = entry.item.title.split(/\s+/)[0]?.toLowerCase() || 'item';
    const count = brandCountsInWindow[firstWord] || 0;
    if (count >= 2 && diversifiedTop.length < 24) {
      deferred.push(entry);
    } else {
      brandCountsInWindow[firstWord] = count + 1;
      diversifiedTop.push(entry);
    }
  }

  return [...diversifiedTop, ...deferred, ...restSlice].map(s => s.item);
}

export interface BestPickEntry {
  item: ProductItem;
  rank: number;
  badge: string;
  crownTier: 'gold' | 'cyan' | 'purple';
  hypeStat: string;
}

const CROWN_BADGES: { badge: string; crownTier: 'gold' | 'cyan' | 'purple'; hypeStat: string }[] = [
  { badge: '#1 CROWN GRAIL', crownTier: 'gold', hypeStat: '99.4% QC Pass' },
  { badge: '#2 HALL OF FAME', crownTier: 'gold', hypeStat: '1:1 Heavyweight' },
  { badge: '#3 MOST COPPED', crownTier: 'gold', hypeStat: 'Top Haul Pick' },
  { badge: '#4 STAFF CROWN', crownTier: 'cyan', hypeStat: 'Verified Batch' },
  { badge: '#5 TOP TIER BATCH', crownTier: 'cyan', hypeStat: 'Best Stitching' },
  { badge: '#6 VAULT SELECT', crownTier: 'purple', hypeStat: 'Sub-Retail Grail' },
  { badge: '#7 COMMUNITY KING', crownTier: 'cyan', hypeStat: 'Most Saved' },
  { badge: '#8 HEAVY ROTATION', crownTier: 'gold', hypeStat: 'True To Size' },
  { badge: '#9 GRAIL ROTATION', crownTier: 'purple', hypeStat: 'Fast Warehouse' },
  { badge: '#10 VALUE CROWN', crownTier: 'cyan', hypeStat: 'Steal Price' },
];

/**
 * Selects the top 10 curated "Best Picks" for the active category with unique brands,
 * valid product images, and crown badges.
 */
export function getBestPicksForCategory(items: ProductItem[], gid: string): BestPickEntry[] {
  if (!items || items.length === 0) return [];

  // Use a separate deterministic salt for Best Picks so the carousel highlights distinct grails
  const candidates = items
    .map((rawItem, idx) => ({
      item: { ...rawItem, title: cleanProductTitle(rawItem.title) },
      originalIndex: idx,
    }))
    .filter(({ item, originalIndex }) => {
      if (!item.image || item.image.trim().length < 8) return false;
      if (!item.priceNum || item.priceNum <= 0) return false;
      const lower = item.title.toLowerCase();
      if (isSourceSheetOpener(lower, originalIndex)) return false;
      return true;
    })
    .map(({ item }) => {
      const lower = item.title.toLowerCase();
      const grailBoost = getGrailPriorityBoost(lower);
      const hash = hashStringWithSalt(item.id, `omr-crown-picks-${gid}`);
      return {
        item,
        score: grailBoost * 2 + (hash % 5000),
      };
    })
    .sort((a, b) => b.score - a.score);

  const selected: ProductItem[] = [];
  const usedBrands = new Set<string>();

  for (const cand of candidates) {
    if (selected.length >= 10) break;
    const brandPrefix = cand.item.title.slice(0, 8).toLowerCase();
    if (!usedBrands.has(brandPrefix)) {
      usedBrands.add(brandPrefix);
      selected.push(cand.item);
    }
  }

  // Fill up to 10 if strict brand deduplication left fewer than 10
  for (const cand of candidates) {
    if (selected.length >= 10) break;
    if (!selected.some(s => s.id === cand.item.id)) {
      selected.push(cand.item);
    }
  }

  return selected.map((item, idx) => {
    const meta = CROWN_BADGES[idx % CROWN_BADGES.length];
    return {
      item,
      rank: idx + 1,
      badge: meta.badge,
      crownTier: meta.crownTier,
      hypeStat: meta.hypeStat,
    };
  });
}
