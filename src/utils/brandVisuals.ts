export interface BrandTheme {
  name: string;
  shortCode: string;
  bgGradient: string;
  accentColor: string;
  tagline: string;
}

const BRAND_DICTIONARY: Record<string, BrandTheme> = {
  ralph: { name: 'Ralph Lauren', shortCode: 'RL', bgGradient: 'from-blue-950/70 to-zinc-900', accentColor: 'text-sky-400', tagline: 'Polo & Cable Knit' },
  chrome: { name: 'Chrome Hearts', shortCode: 'CH', bgGradient: 'from-zinc-900 to-black', accentColor: 'text-zinc-200', tagline: 'Gothic Silver & Leather' },
  nike: { name: 'Nike', shortCode: 'NK', bgGradient: 'from-amber-950/60 to-zinc-900', accentColor: 'text-amber-400', tagline: 'Tech Fleece & Athletics' },
  acne: { name: 'Acne Studios', shortCode: 'ACNE', bgGradient: 'from-pink-950/50 to-zinc-900', accentColor: 'text-pink-300', tagline: 'Stockholm Minimal' },
  gallery: { name: 'Gallery Dept', shortCode: 'DEPT', bgGradient: 'from-stone-900 to-zinc-950', accentColor: 'text-amber-300', tagline: 'Art That Kills' },
  canada: { name: 'Canada Goose', shortCode: 'CG', bgGradient: 'from-cyan-950/60 to-zinc-900', accentColor: 'text-cyan-400', tagline: 'Arctic Down Parka' },
  palm: { name: 'Palm Angels', shortCode: 'PA', bgGradient: 'from-purple-950/60 to-zinc-900', accentColor: 'text-purple-300', tagline: 'LA Skate & Track' },
  supreme: { name: 'Supreme', shortCode: 'SUP', bgGradient: 'from-red-950/70 to-zinc-900', accentColor: 'text-red-400', tagline: 'Box Logo Edition' },
  cdg: { name: 'Comme des Garçons', shortCode: 'CDG', bgGradient: 'from-rose-950/60 to-zinc-900', accentColor: 'text-rose-400', tagline: 'PLAY Heart Monogram' },
  ami: { name: 'Ami Paris', shortCode: 'AMI', bgGradient: 'from-emerald-950/60 to-zinc-900', accentColor: 'text-emerald-400', tagline: 'Ami de Coeur' },
  syna: { name: 'Syna World', shortCode: 'SYNA', bgGradient: 'from-yellow-950/60 to-zinc-900', accentColor: 'text-yellow-400', tagline: 'Central Cee Cut' },
  eric: { name: 'Eric Emanuel', shortCode: 'EE', bgGradient: 'from-orange-950/60 to-zinc-900', accentColor: 'text-orange-400', tagline: 'Mesh Basketball Shorts' },
  burberry: { name: 'Burberry', shortCode: 'BUR', bgGradient: 'from-amber-950/50 to-zinc-900', accentColor: 'text-amber-300', tagline: 'Nova Check Plaid' },
  hellstar: { name: 'Hellstar', shortCode: 'HELL', bgGradient: 'from-red-950/80 to-zinc-950', accentColor: 'text-red-400', tagline: 'Capsule Collection' },
  balenciaga: { name: 'Balenciaga', shortCode: 'BLCG', bgGradient: 'from-zinc-900 to-zinc-950', accentColor: 'text-zinc-100', tagline: 'Oversized Runway' },
  corteiz: { name: 'Corteiz', shortCode: 'CRTZ', bgGradient: 'from-emerald-950/70 to-zinc-900', accentColor: 'text-emerald-300', tagline: 'Rules The World' },
  trapstar: { name: 'Trapstar', shortCode: 'TRAP', bgGradient: 'from-indigo-950/70 to-zinc-900', accentColor: 'text-indigo-400', tagline: 'Decoded Irongate' },
  stone: { name: 'Stone Island', shortCode: 'SI', bgGradient: 'from-teal-950/60 to-zinc-900', accentColor: 'text-teal-400', tagline: 'Compass Arm Badge' },
  amiri: { name: 'Amiri', shortCode: 'AMR', bgGradient: 'from-zinc-900 to-zinc-950', accentColor: 'text-zinc-200', tagline: 'Bandana & Distressed' },
  essentials: { name: 'Essentials', shortCode: 'FOG', bgGradient: 'from-stone-900 to-zinc-900', accentColor: 'text-stone-300', tagline: 'Fear Of God Core' },
  sp5der: { name: 'Sp5der', shortCode: 'SP5', bgGradient: 'from-pink-950/70 to-zinc-900', accentColor: 'text-pink-400', tagline: 'Web Hoodie' },
  broken: { name: 'Broken Planet', shortCode: 'BPM', bgGradient: 'from-violet-950/60 to-zinc-900', accentColor: 'text-violet-400', tagline: 'Market Cosmic Puff' },
  jordan: { name: 'Air Jordan', shortCode: 'AJ', bgGradient: 'from-red-950/60 to-zinc-900', accentColor: 'text-red-400', tagline: 'Jumpman Retro' },
  stussy: { name: 'Stüssy', shortCode: 'STU', bgGradient: 'from-zinc-900 to-zinc-950', accentColor: 'text-zinc-200', tagline: 'World Tour 8-Ball' },
  moncler: { name: 'Moncler', shortCode: 'MNC', bgGradient: 'from-blue-950/60 to-zinc-900', accentColor: 'text-blue-300', tagline: 'Maya Goose Down' },
  mm6: { name: 'Maison Margiela', shortCode: 'MM6', bgGradient: 'from-stone-900 to-zinc-950', accentCode: 'text-stone-300', tagline: 'Numeric Stitched' },
};

export function getBrandVisual(title: string, category: string): BrandTheme {
  const lower = title.toLowerCase();

  for (const [key, theme] of Object.entries(BRAND_DICTIONARY)) {
    if (lower.includes(key)) {
      return theme;
    }
  }

  // Fallback generic theme by category
  const catLower = category.toLowerCase();
  if (catLower.includes('shoe')) {
    return { name: 'Sneakers & Kicks', shortCode: 'SNK', bgGradient: 'from-zinc-900 to-zinc-950', accentColor: 'text-amber-400', tagline: 'Rep Verified Batch' };
  }
  if (catLower.includes('wallet') || catLower.includes('bag')) {
    return { name: 'Leather Goods', shortCode: 'BAG', bgGradient: 'from-zinc-900 to-zinc-950', accentColor: 'text-amber-400', tagline: 'Designer Leather' };
  }
  if (catLower.includes('belt')) {
    return { name: 'Buckle & Belt', shortCode: 'BLT', bgGradient: 'from-zinc-900 to-zinc-950', accentColor: 'text-amber-400', tagline: 'Signature Hardware' };
  }
  if (catLower.includes('jewelry')) {
    return { name: 'Fine Jewelry', shortCode: 'JWL', bgGradient: 'from-zinc-900 to-zinc-950', accentColor: 'text-amber-400', tagline: 'Silver & Precious' };
  }
  if (catLower.includes('electronic')) {
    return { name: 'Electronics', shortCode: 'TECH', bgGradient: 'from-zinc-900 to-zinc-950', accentColor: 'text-sky-400', tagline: 'Smart Accessories' };
  }

  // Default streetwear theme
  const words = title.trim().split(/\s+/);
  const initials = words.slice(0, 2).map(w => w[0]?.toUpperCase() || '').join('');

  return {
    name: words.slice(0, 2).join(' '),
    shortCode: initials || 'REP',
    bgGradient: 'from-zinc-900 to-zinc-950',
    accentColor: 'text-amber-400',
    tagline: 'Curated Batch',
  };
}
