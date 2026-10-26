import { AgentId, AgentConfig, BlacklistedAgent, CurrencyCode } from '../types/index.ts';

export interface ParsedProductUrl {
  platform: 'weidian' | 'taobao' | '1688' | 'tmall' | 'unknown';
  id: string;
  rawStoreUrl: string;
}

export const CURRENCIES: { code: CurrencyCode; symbol: string; rateFromUsd: number }[] = [
  { code: 'USD', symbol: '$', rateFromUsd: 1 },
  { code: 'GBP', symbol: '£', rateFromUsd: 0.78 },
  { code: 'EUR', symbol: '€', rateFromUsd: 0.92 },
  { code: 'CAD', symbol: 'C$', rateFromUsd: 1.38 },
  { code: 'AUD', symbol: 'A$', rateFromUsd: 1.52 },
  { code: 'CNY', symbol: '¥', rateFromUsd: 7.22 },
];

export function formatConvertedPrice(
  priceNumUsd: number,
  currencyOrRaw: CurrencyCode | string = 'USD',
  maybeCurrencyOrRaw: CurrencyCode | string = ''
): string {
  const validCodes: string[] = ['USD', 'GBP', 'EUR', 'CAD', 'AUD', 'CNY'];
  const currencyCode: CurrencyCode = validCodes.includes(currencyOrRaw)
    ? (currencyOrRaw as CurrencyCode)
    : validCodes.includes(maybeCurrencyOrRaw)
    ? (maybeCurrencyOrRaw as CurrencyCode)
    : 'USD';
  const rawPriceStr = validCodes.includes(currencyOrRaw) ? String(maybeCurrencyOrRaw || '') : String(currencyOrRaw || '');

  let numericUsd = priceNumUsd;
  if ((!numericUsd || isNaN(numericUsd)) && rawPriceStr) {
    const m = rawPriceStr.match(/(\d+(?:\.\d+)?)/);
    if (m) numericUsd = parseFloat(m[1]);
  }
  if (!numericUsd || isNaN(numericUsd)) return rawPriceStr || '$0';

  const curr = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const converted = Math.round(numericUsd * curr.rateFromUsd * 10) / 10;
  const formattedNum = converted % 1 === 0 ? converted.toFixed(0) : converted.toFixed(2);
  const isSet = rawPriceStr.toUpperCase().includes('SET');
  return `${curr.symbol}${formattedNum}${isSet ? ' (SET)' : ''}`;
}

export function convertNotesCurrency(notes: string | undefined, currency: CurrencyCode): string {
  if (!notes) return '';
  const curr = CURRENCIES.find(c => c.code === currency) || CURRENCIES[0];
  if (curr.code === 'USD') return notes;
  return notes.replace(/\$?\b(\d+(?:\.\d+)?)\s*\$(?!\w)|\$(\d+(?:\.\d+)?)/g, (_match, g1, g2) => {
    const val = parseFloat(g1 || g2);
    if (isNaN(val)) return _match;
    const conv = Math.round(val * curr.rateFromUsd);
    return `${curr.symbol}${conv}`;
  });
}

export function getProxiedImageUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return '';
  if (rawUrl.includes('docs.google.com/sheets-images-rt') || rawUrl.includes('googleusercontent.com')) {
    return `/api/image-proxy?url=${encodeURIComponent(rawUrl)}`;
  }
  return rawUrl;
}

function faviconLogo(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

export const DEFAULT_AGENTS: AgentConfig[] = [
  {
    id: 'cnshopper',
    name: 'CNShopper',
    tagline: 'Fastest warehouse turnaround, 24h QC imaging & lowest international rates',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    logoText: 'CNS',
    logoUrl: faviconLogo('cnshopper.com'),
    couponHeadline: 'COUPON -20% + $400',
    defaultReferralCode: '2554628',
    signupUrl: 'https://cnshopper.com/?invite_id=2554628',
    bonusText: '20% Off Coupon + $400 Coupon Bundle',
    healthStatus: 'Online',
    isTopPick: true,
    enabled: true,
  },
  {
    id: 'stargobuy',
    name: 'StarGobuy',
    tagline: 'Zero brand restrictions, rapid automated purchasing & priority QC',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    logoText: 'SGB',
    logoUrl: faviconLogo('stargobuy.com'),
    couponHeadline: 'NEW AGENT BONUS',
    defaultReferralCode: '10768',
    signupUrl: 'https://stargobuy.com?invite_id=10768',
    bonusText: 'Exclusive New Agent Signup Bonus',
    healthStatus: 'Online',
    isTopPick: true,
    isNewAgent: true,
    enabled: true,
  },
  {
    id: 'oopbuy',
    name: 'Oopbuy',
    tagline: 'Direct marketplace integration, instant order processing & tax-free lines',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    logoText: 'OOP',
    logoUrl: faviconLogo('oopbuy.com'),
    couponHeadline: 'COUPON -30%',
    defaultReferralCode: '4MPOITBZV',
    signupUrl: 'https://m.oopbuy.com/pages/register/index?inviteCode=4MPOITBZV',
    bonusText: '30% Off Shipping + Coupon Pack',
    healthStatus: 'Online',
    isTopPick: true,
    enabled: true,
  },
  {
    id: 'boonbuy',
    name: 'Boonbuy',
    tagline: 'Unrestricted brand purchasing & consolidated parcel lines',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'BB',
    logoUrl: faviconLogo('boonbuy.com'),
    couponHeadline: 'COUPON -40%',
    defaultReferralCode: 'PQNPT7D42',
    signupUrl: 'https://m.boonbuy.com/pages/register/index?inviteCode=PQNPT7D42',
    bonusText: '40% Off Welcome Shipping Pack',
    healthStatus: 'High Traffic',
    enabled: true,
  },
  {
    id: 'hipobuy',
    name: 'Hipobuy',
    tagline: 'Warehouse check-in & discounted express lines',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'HPB',
    logoUrl: faviconLogo('hipobuy.com'),
    couponHeadline: 'COUPON -30%',
    defaultReferralCode: 'WIIX4MNYG',
    signupUrl: 'https://m.hipobuy.com/pages/register/index?inviteCode=WIIX4MNYG',
    bonusText: 'New Member Coupon Bundle',
    healthStatus: 'High Traffic',
    enabled: true,
  },
  {
    id: 'litbuy',
    name: 'Litbuy',
    tagline: 'Streetwear ordering & standard HD QC photos',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'LIT',
    logoUrl: faviconLogo('litbuy.com'),
    couponHeadline: 'COUPON -30%',
    defaultReferralCode: 'KY6TU3BGB',
    signupUrl: 'https://m.litbuy.com/pages/register/index?inviteCode=KY6TU3BGB',
    bonusText: 'Exclusive Signup Discount Pack',
    healthStatus: 'High Traffic',
    enabled: true,
  },
  {
    id: 'lovegobuy',
    name: 'LoveGoBuy',
    tagline: 'PayPal support & EU/US tax-free lines',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'LGB',
    logoUrl: faviconLogo('lovegobuy.com'),
    couponHeadline: 'COUPON PACK',
    defaultReferralCode: 'KSPMEY',
    signupUrl: 'https://www.lovegobuy.com/?invite_code=KSPMEY',
    bonusText: 'New User Shipping Coupons',
    healthStatus: 'High Traffic',
    enabled: true,
  },
  {
    id: 'gtbuy',
    name: 'GTBuy',
    tagline: 'International dispatch & low volumetric fees',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'GTB',
    logoUrl: faviconLogo('gtbuy.com'),
    couponHeadline: 'COUPON -30%',
    defaultReferralCode: '5S4W9BL4K',
    signupUrl: 'https://m.gtbuy.com/pages/register/index?inviteCode=5S4W9BL4K',
    bonusText: 'Express Shipping Coupon Pack',
    healthStatus: 'High Traffic',
    enabled: true,
  },
  {
    id: 'superbuy',
    name: 'Superbuy',
    tagline: 'Legacy veteran agent with mobile app support',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'SB',
    logoUrl: faviconLogo('superbuy.com'),
    couponHeadline: '$85 COUPONS',
    defaultReferralCode: 'ENOQZo',
    signupUrl: 'https://m.superbuy.com/en/register/index?partnercode=ENOQZo',
    bonusText: '$85 Bonus Vouchers',
    healthStatus: 'Slow',
    enabled: true,
  },
  {
    id: 'sugargoo',
    name: 'Sugargoo',
    tagline: 'Established customer service & standard lines (some brand limits)',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'SG',
    logoUrl: faviconLogo('sugargoo.com'),
    couponHeadline: '¥280 COUPONS',
    defaultReferralCode: '3161295250700719145',
    signupUrl: 'https://m.sugargoo.com/register?memberId=3161295250700719145',
    bonusText: '¥280 Shipping Coupon Bundle',
    healthStatus: 'Slow',
    enabled: true,
  },
  {
    id: 'lolobuy',
    name: 'LoloBuy',
    tagline: 'Standard warehouse storage & basic freight lines',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'LOLO',
    logoUrl: faviconLogo('lolobuy.com'),
    couponHeadline: 'COUPON PACK',
    defaultReferralCode: '3w5ja',
    signupUrl: 'https://m.lolobuy.com/index?inviteCode=3w5ja',
    bonusText: 'Welcome Shipping Coupons',
    healthStatus: 'Slow',
    enabled: true,
  },
  {
    id: 'rizzitgo',
    name: 'Rizzitgo',
    tagline: 'Standard parcel consolidation & protective packaging',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
    logoText: 'RZG',
    logoUrl: faviconLogo('rizzitgo.com'),
    couponHeadline: 'BONUS PACK',
    defaultReferralCode: '199196',
    signupUrl: 'https://m.rizzitgo.com/?rno=199196',
    bonusText: 'Referral Signup Bonus Pack',
    healthStatus: 'Slow',
    enabled: true,
  },
  {
    id: 'raw',
    name: 'Direct Store Link',
    tagline: 'Raw Weidian / Taobao / 1688 original link',
    badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    logoText: 'RAW',
    logoUrl: faviconLogo('weidian.com'),
    couponHeadline: 'DIRECT LINK',
    defaultReferralCode: '',
    signupUrl: '',
    bonusText: 'Original Marketplace Link',
    healthStatus: 'Online',
    enabled: true,
  },
];

export const LOCKED_REFERRAL_CODES: Record<AgentId, string> = {
  cnshopper: '2554628',
  stargobuy: '10768',
  oopbuy: '4MPOITBZV',
  superbuy: 'ENOQZo',
  lovegobuy: 'KSPMEY',
  sugargoo: '3161295250700719145',
  boonbuy: 'PQNPT7D42',
  hipobuy: 'WIIX4MNYG',
  litbuy: 'KY6TU3BGB',
  gtbuy: '5S4W9BL4K',
  lolobuy: '3w5ja',
  rizzitgo: '199196',
  raw: '',
};

export const RAIDED_BLACKLIST_AGENTS: BlacklistedAgent[] = [
  { id: 'mulebuy', name: 'Mulebuy', logoUrl: faviconLogo('mulebuy.com') },
  { id: 'allchinabuy', name: 'ACBuy', logoUrl: faviconLogo('acbuy.com') },
  { id: 'cnfans', name: 'CNfans', logoUrl: faviconLogo('cnfans.com') },
  { id: 'hoobuy', name: 'Hoobuy', logoUrl: faviconLogo('hoobuy.com') },
  { id: 'joyabuy', name: 'Joysgoo (Joyabuy)', logoUrl: faviconLogo('joyagoo.com') },
];

export function isValidActiveAgent(id: string | null | undefined): id is AgentId {
  if (!id) return false;
  return DEFAULT_AGENTS.some(a => a.id === id);
}

export function parseProductUrl(url: string): ParsedProductUrl {
  if (!url) {
    return { platform: 'unknown', id: '', rawStoreUrl: '' };
  }

  let cleanUrl = url.trim();
  const gMatch = cleanUrl.match(/google\.com\/url\?q=([^&]+)/);
  if (gMatch) {
    try {
      cleanUrl = decodeURIComponent(gMatch[1]);
    } catch {
      cleanUrl = gMatch[1];
    }
  }

  // Decode up to 2 times if URL-encoded
  for (let i = 0; i < 2 && /%[0-9A-Fa-f]{2}/.test(cleanUrl); i++) {
    try {
      const dec = decodeURIComponent(cleanUrl);
      if (dec === cleanUrl) break;
      cleanUrl = dec;
    } catch {
      break;
    }
  }

  // 1. Direct Weidian link
  const weidianDirect = cleanUrl.match(/weidian\.com\/[^\s]*?[?&](?:itemID|itemId|offerID)=([0-9]+)/i) || cleanUrl.match(/weidian\.com\/i\/([0-9]+)/i);
  if (weidianDirect) {
    const id = weidianDirect[1];
    return { platform: 'weidian', id, rawStoreUrl: `https://weidian.com/item.html?itemID=${id}` };
  }

  // 2. Oopbuy / Boonbuy / Hipobuy / Litbuy / GTBuy / StarGobuy style path:
  // Note: In Oopbuy engine enum.js: 0 = 1688, 1 = TAOBAO, 2 = WEIDIAN
  const agentPathWeidian = cleanUrl.match(/\/(?:pages\/)?(?:product|foundry)\/(?:weidian|2)\/([0-9]+)/i);
  if (agentPathWeidian) {
    const id = agentPathWeidian[1];
    return { platform: 'weidian', id, rawStoreUrl: `https://weidian.com/item.html?itemID=${id}` };
  }

  const agentPathTaobao = cleanUrl.match(/\/(?:pages\/)?(?:product|foundry)\/(?:taobao|tmall|1)\/([0-9]+)/i);
  if (agentPathTaobao) {
    const id = agentPathTaobao[1];
    return { platform: 'taobao', id, rawStoreUrl: `https://item.taobao.com/item.htm?id=${id}` };
  }

  const agentPath1688 = cleanUrl.match(/\/(?:pages\/)?(?:product|foundry)\/(?:1688|0)\/([0-9]+)/i);
  if (agentPath1688) {
    const id = agentPath1688[1];
    return { platform: '1688', id, rawStoreUrl: `https://detail.1688.com/offer/${id}.html` };
  }

  // 3. Direct Taobao / Tmall link
  const taobaoMatch = cleanUrl.match(/(?:item\.taobao\.com|detail\.tmall\.com|taobao\.com)\/[^\s]*?[?&]id=([0-9]+)/i);
  if (taobaoMatch) {
    const id = taobaoMatch[1];
    return { platform: 'taobao', id, rawStoreUrl: `https://item.taobao.com/item.htm?id=${id}` };
  }

  // 4. Direct 1688 link
  const match1688 = cleanUrl.match(/1688\.com\/offer\/([0-9]+)\.html/i) || cleanUrl.match(/1688\.com\/[^\s]*?[?&](?:offerId|offerID|objectId)=([0-9]+)/i);
  if (match1688) {
    const id = match1688[1];
    return { platform: '1688', id, rawStoreUrl: `https://detail.1688.com/offer/${id}.html` };
  }

  // 5. Query-param style agent links (e.g. keyword=...&platform=..., id=...&channel=..., id=...&shop_type=...)
  const idParam = cleanUrl.match(/[?&](?:keyword|id|itemID|itemId|goodsId|spuNo)=([0-9]{5,})/i);
  const platParam = cleanUrl.match(/[?&](?:platform|channel|shop_type|shopType)=([a-zA-Z0-9_]+)/i);
  if (idParam && platParam) {
    const id = idParam[1];
    const p = platParam[1].toLowerCase();
    if (p.includes('weidian') || p === '2') {
      return { platform: 'weidian', id, rawStoreUrl: `https://weidian.com/item.html?itemID=${id}` };
    }
    if (p.includes('1688') || p === '0') {
      return { platform: '1688', id, rawStoreUrl: `https://detail.1688.com/offer/${id}.html` };
    }
    return { platform: 'taobao', id, rawStoreUrl: `https://item.taobao.com/item.htm?id=${id}` };
  }

  // 6. Fallback numeric ID extraction
  const fallbackNum = cleanUrl.match(/([0-9]{8,15})/);
  if (fallbackNum) {
    const id = fallbackNum[1];
    if (cleanUrl.toLowerCase().includes('weidian')) {
      return { platform: 'weidian', id, rawStoreUrl: `https://weidian.com/item.html?itemID=${id}` };
    }
    if (cleanUrl.toLowerCase().includes('1688')) {
      return { platform: '1688', id, rawStoreUrl: `https://detail.1688.com/offer/${id}.html` };
    }
    return { platform: 'taobao', id, rawStoreUrl: `https://item.taobao.com/item.htm?id=${id}` };
  }

  return { platform: 'unknown', id: '', rawStoreUrl: cleanUrl };
}

export function buildAgentUrl(
  inputUrl: string,
  targetAgent: AgentId,
  customCode?: string
): string {
  const parsed = parseProductUrl(inputUrl);
  const raw = parsed.rawStoreUrl || inputUrl;
  const encodedRaw = encodeURIComponent(raw);
  const code = customCode || LOCKED_REFERRAL_CODES[targetAgent] || '';

  if (targetAgent === 'raw') {
    return raw;
  }

  const shopTypeLower =
    parsed.platform === 'weidian'
      ? 'weidian'
      : parsed.platform === '1688'
      ? '1688'
      : 'taobao';

  const channelUpper =
    parsed.platform === 'weidian'
      ? 'WEIDIAN'
      : parsed.platform === '1688'
      ? '1688'
      : 'TAOBAO';

  switch (targetAgent) {
    case 'cnshopper': {
      if (parsed.id) {
        return `https://cnshopper.com/goods/detail?keyword=${parsed.id}&platform=${shopTypeLower}&invite_id=${code}`;
      }
      return `https://cnshopper.com/?invite_id=${code}`;
    }

    case 'stargobuy': {
      if (parsed.id) {
        return `https://stargobuy.com/product/${shopTypeLower}/${parsed.id}?invite_id=${code}`;
      }
      return `https://stargobuy.com/?invite_id=${code}`;
    }

    case 'oopbuy': {
      if (parsed.id) {
        if (parsed.platform === 'weidian') {
          return `https://oopbuy.com/product/weidian/${parsed.id}?inviteCode=${code}`;
        }
        if (parsed.platform === 'taobao') {
          return `https://oopbuy.com/product/1/${parsed.id}?inviteCode=${code}`;
        }
        if (parsed.platform === '1688') {
          return `https://oopbuy.com/product/0/${parsed.id}?inviteCode=${code}`;
        }
      }
      return `https://m.oopbuy.com/pages/register/index?inviteCode=${code}`;
    }

    case 'boonbuy': {
      if (parsed.id) {
        return `https://boonbuy.com/products/details?id=${parsed.id}&channel=${channelUpper}&inviteCode=${code}`;
      }
      return `https://m.boonbuy.com/pages/register/index?inviteCode=${code}`;
    }

    case 'hipobuy': {
      if (parsed.id) {
        if (parsed.platform === 'weidian') {
          return `https://hipobuy.com/product/weidian/${parsed.id}?inviteCode=${code}`;
        }
        if (parsed.platform === 'taobao') {
          return `https://hipobuy.com/product/1/${parsed.id}?inviteCode=${code}`;
        }
        if (parsed.platform === '1688') {
          return `https://hipobuy.com/product/0/${parsed.id}?inviteCode=${code}`;
        }
      }
      return `https://m.hipobuy.com/pages/register/index?inviteCode=${code}`;
    }

    case 'litbuy': {
      if (parsed.id) {
        return `https://litbuy.com/products/details?id=${parsed.id}&channel=${channelUpper}&inviteCode=${code}`;
      }
      return `https://m.litbuy.com/pages/register/index?inviteCode=${code}`;
    }

    case 'gtbuy': {
      if (parsed.id) {
        return `https://gtbuy.com/goods/details?id=${parsed.id}&channel=${channelUpper}&inviteCode=${code}`;
      }
      return `https://m.gtbuy.com/pages/register/index?inviteCode=${code}`;
    }

    case 'superbuy': {
      return `https://www.superbuy.com/en/page/buy/?nTag=Home-search&from=search-input&url=${encodedRaw}&partnercode=${code}`;
    }

    case 'lovegobuy': {
      const lgbType = parsed.platform === 'weidian' ? 'weidian' : parsed.platform === '1688' ? 'ali_1688' : 'taobao';
      if (parsed.id) {
        return `https://www.lovegobuy.com/product?id=${parsed.id}&shop_type=${lgbType}&invite_code=${code}`;
      }
      return `https://www.lovegobuy.com/?invite_code=${code}`;
    }

    case 'sugargoo': {
      return `https://www.sugargoo.com/#/home/productDetail?productLink=${encodedRaw}&memberId=${code}`;
    }

    case 'lolobuy': {
      if (parsed.id) {
        return `https://www.lolobuy.com/productDetail/${parsed.id}?url=${encodedRaw}&inviteCode=${code}`;
      }
      return `https://m.lolobuy.com/index?inviteCode=${code}`;
    }

    case 'rizzitgo': {
      if (parsed.id) {
        return `https://www.rizzitgo.com/detail-page?url=${encodedRaw}&id=${parsed.id}&platform=${shopTypeLower}&rno=${code}`;
      }
      return `https://m.rizzitgo.com/?rno=${code}`;
    }

    default:
      return raw;
  }
}
