import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  ExternalLink,
  Check,
  KeyRound,
  Share2,
  ArrowLeft,
  ShieldCheck,
  AlertTriangle,
  Shirt,
  Footprints,
  Briefcase,
  Headphones,
  Layers
} from 'lucide-react';
import { AgentId } from '../types/index.ts';

export type SellerCategory = 'all' | 'Clothes' | 'Shoes' | 'Accessories' | 'Electronics';

export interface SellerEntry {
  name: string;
  url: string;
  tier?: string;
  password?: string;
  searchHint?: string;
  isDirectProduct?: boolean;
}

export interface BrandSellerCard {
  id: string;
  brand: string;
  category: Exclude<SellerCategory, 'all'>;
  tagline?: string;
  warning?: string;
  sellers: SellerEntry[];
}

export const CURATED_BRAND_SELLERS: BrandSellerCard[] = [
  // ==================== CLOTHES ====================
  {
    id: 'acne-studios',
    brand: 'Acne Studios',
    category: 'Clothes',
    tagline: 'Top-tier boxy tees, distressed knits & baggy denim',
    sellers: [
      { name: 'MVT', url: 'https://mvt-shop01.x.yupoo.com/', tier: 'Top Pick' },
      { name: 'TopAcney', url: 'http://topacney.x.yupoo.com/', tier: '1:1 Specialist' },
    ],
  },
  {
    id: 'ami-paris',
    brand: 'Ami Paris',
    category: 'Clothes',
    tagline: 'Heart logo sweaters, cardigans & knitwear',
    sellers: [
      { name: 'AmiParis Yupoo', url: 'http://amiparis.x.yupoo.com/', tier: 'Best Batch' },
    ],
  },
  {
    id: 'amiri-jeans',
    brand: 'Amiri Jeans',
    category: 'Clothes',
    tagline: 'Distressed biker & MX1 denim specialists',
    sellers: [
      { name: 'Pingu7', url: 'http://pingu7.x.yupoo.com/', tier: 'Top Denim' },
      { name: 'Hengyuclub', url: 'http://hengyuclub.x.yupoo.com/' },
    ],
  },
  {
    id: 'bape',
    brand: 'Bape (A Bathing Ape)',
    category: 'Clothes',
    tagline: 'Shark hoodies, camo zip-ups & tees',
    sellers: [
      { name: 'LufiloStudio', url: 'https://lufilostudio.x.yupoo.com', tier: 'Best Bape' },
    ],
  },
  {
    id: 'broken-planet',
    brand: 'Broken Planet',
    category: 'Clothes',
    tagline: 'Heavyweight puff-print hoodies, zip-ups & sweatpants',
    sellers: [
      { name: 'Hotdog Official', url: 'http://hotdog-official.x.yupoo.com/', tier: '#1 Goat Batch' },
    ],
  },
  {
    id: 'burberry',
    brand: 'Burberry',
    category: 'Clothes',
    tagline: 'Zip hoodies, polos, trenches & check shirts',
    sellers: [
      { name: 'TheThunder', url: 'http://thethunder.x.yupoo.com/', tier: '1:1 Luxury' },
      { name: '1to1', url: 'http://1to1.x.yupoo.com/', tier: '1:1 Luxury' },
    ],
  },
  {
    id: 'canada-goose',
    brand: 'Canada Goose',
    category: 'Clothes',
    tagline: 'Down parkas, Wyndham, Chilliwack & vests ranked',
    sellers: [
      { name: 'TopGoosey', url: 'https://topgoosey.x.yupoo.com/', tier: '1st Best' },
      { name: 'Chaorenqihaodian', url: 'http://chaorenqihaodian.x.yupoo.com/', tier: '2nd Best' },
      { name: 'Linzhican', url: 'http://linzhican.x.yupoo.com/', tier: '3rd Best' },
    ],
  },
  {
    id: 'celine',
    brand: 'Celine',
    category: 'Clothes',
    tagline: 'Heavy luxury hoodies, tracksuits & tees',
    sellers: [
      { name: '1to1', url: 'http://1to1.x.yupoo.com/', tier: 'Best Batch' },
    ],
  },
  {
    id: 'chrome-hearts-clothes',
    brand: 'Chrome Hearts (Clothes)',
    category: 'Clothes',
    tagline: 'Longsleeves, zip-ups, jeans & cross print hoodies',
    sellers: [
      { name: 'TopHotFashion (Cloyad)', url: 'http://tophotfashion.x.yupoo.com/', tier: 'Full Catalog' },
      { name: 'Cloyad CH Category', url: 'https://tophotfashion.x.yupoo.com/categories/4644883', tier: 'Direct CH Tab' },
    ],
  },
  {
    id: 'comme-des-garcons',
    brand: 'Comme des Garçons (CDG)',
    category: 'Clothes',
    tagline: 'CDG Play heart tees, hoodies, cardigans & striped shirts',
    sellers: [
      { name: 'RepsBrothers', url: 'http://repsbrothers.x.yupoo.com/', tier: '#1 Uncalloutable' },
    ],
  },
  {
    id: 'corteiz',
    brand: 'Corteiz (CRTZ)',
    category: 'Clothes',
    tagline: 'Alcatraz cargos, windbreakers, tracksuits & puffers',
    sellers: [
      { name: 'GOAT Official', url: 'http://goat-official.x.yupoo.com/', tier: '#1 Corteiz King' },
      { name: 'Elephant Brother', url: 'https://elephant-brother.x.yupoo.com/albums' },
    ],
  },
  {
    id: 'cp-company',
    brand: 'C.P. Company',
    category: 'Clothes',
    tagline: 'Goggle hoodies, lens overshirts & puffers',
    sellers: [
      { name: 'CPRepsCN', url: 'http://cprepscn.x.yupoo.com/', tier: 'Specialist' },
    ],
  },
  {
    id: 'denim-tears',
    brand: 'Denim Tears',
    category: 'Clothes',
    tagline: 'Cotton wreath puff-print hoodies, sweats & Levi’s',
    sellers: [
      { name: 'AngelKing47', url: 'http://angelking47.x.yupoo.com/', tier: 'Top Puff Print' },
      { name: 'Elephant Factory', url: 'https://elephant-factory.x.yupoo.com/' },
    ],
  },
  {
    id: 'dior-clothes',
    brand: 'Dior (Clothes)',
    category: 'Clothes',
    tagline: 'Oblique jacquard, atelier tees, hoodies & jackets',
    sellers: [
      { name: 'TheThunder', url: 'http://thethunder.x.yupoo.com/', tier: '1:1 Luxury' },
      { name: '1to1', url: 'http://1to1.x.yupoo.com/', tier: '1:1 Luxury' },
    ],
  },
  {
    id: 'eric-emanuel',
    brand: 'Eric Emanuel (EE)',
    category: 'Clothes',
    tagline: 'Mesh basketball shorts & summer sets',
    sellers: [
      { name: 'UnionKingdom', url: 'https://unionkingdom.x.yupoo.com/', tier: 'Best Mesh' },
      { name: 'AngelKing47', url: 'https://angelking47.x.yupoo.com/', tier: 'Top EE Batch' },
    ],
  },
  {
    id: 'essentials',
    brand: 'Essentials (Fear of God)',
    category: 'Clothes',
    tagline: '3D silicon applause hoodies, crews, tees & sweatpants',
    sellers: [
      { name: 'Singor (Steven-1989)', url: 'https://steven-1989.x.yupoo.com/', tier: 'Best Quality' },
      { name: 'FireRep', url: 'https://firerep.x.yupoo.com/', tier: 'Cheaper' },
      { name: 'Yishan', url: 'https://yishan-ess.x.yupoo.com/', tier: 'Budget King' },
    ],
  },
  {
    id: 'gallery-dept',
    brand: 'Gallery Dept.',
    category: 'Clothes',
    tagline: 'Paint-splatter tees, flared sweats & vintage hoodies',
    sellers: [
      { name: 'TopHotFashion', url: 'https://tophotfashion.x.yupoo.com/', tier: 'Top Pick' },
    ],
  },
  {
    id: 'gymshark',
    brand: 'GymShark',
    category: 'Clothes',
    tagline: 'Onyx compression shirts, stringers & gym shorts',
    sellers: [
      { name: 'TigerShark (Taobao)', url: 'https://e.tb.cn/h.hyAQMTHrP28MrfN?tk=knIc4ovbJlv', tier: 'Gym Specialist' },
    ],
  },
  {
    id: 'givenchy',
    brand: 'Givenchy',
    category: 'Clothes',
    tagline: 'Distressed logo tees, sweatshirts & luxury knitwear',
    sellers: [
      { name: 'TopGivenchy', url: 'http://topgivenchy.x.yupoo.com/', tier: '1:1 Specialist' },
    ],
  },
  {
    id: 'hellstar',
    brand: 'Hellstar',
    category: 'Clothes',
    tagline: 'Vintage wash graphic tees, NFC hoodies & flares',
    sellers: [
      { name: 'PikachuShop', url: 'http://pikachushop.x.yupoo.com/', tier: '#1 Hellstar' },
    ],
  },
  {
    id: 'jerseys',
    brand: 'Football & Sports Jerseys',
    category: 'Clothes',
    tagline: 'Retro & current player/fan version kits + NBA/NFL',
    sellers: [
      { name: 'AAAAJersey', url: 'http://aaaajersey.x.yupoo.com/', password: 'aaaajersey', tier: 'Biggest Catalog' },
      { name: 'Yang Jersey', url: 'https://yang-jersey.x.yupoo.com/', tier: 'No Password' },
      { name: 'OKJersey (Other Sports)', url: 'http://okjersey.x.yupoo.com/', password: 'aaaaaa', tier: 'Multi-Sport' },
    ],
  },
  {
    id: 'lacoste',
    brand: 'Lacoste',
    category: 'Clothes',
    tagline: 'Polos, tracksuits, sweaters & crocodile essentials',
    sellers: [
      { name: 'FrenchFish', url: 'https://kdi220.x.yupoo.com', tier: 'Best Lacoste' },
    ],
  },
  {
    id: 'louis-vuitton-clothes',
    brand: 'Louis Vuitton (LV)',
    category: 'Clothes',
    tagline: 'Monogram jacquard, varsity jackets, tees & knits',
    sellers: [
      { name: 'TheThunder', url: 'http://thethunder.x.yupoo.com/', tier: '1:1 Luxury' },
      { name: '1to1', url: 'http://1to1.x.yupoo.com/', tier: '1:1 Luxury' },
    ],
  },
  {
    id: 'minus-two',
    brand: 'Minus Two',
    category: 'Clothes',
    tagline: 'Baggy cargo pants, metallic prints & streetwear sets',
    sellers: [
      { name: 'GOAT Official 222', url: 'https://goat-official222.x.yupoo.com/', tier: 'Best Batch' },
    ],
  },
  {
    id: 'moncler',
    brand: 'Moncler',
    category: 'Clothes',
    tagline: 'Maya puffers, cardigans, vests & NFC badges',
    sellers: [
      { name: 'RepsKing', url: 'https://repsking.x.yupoo.com/', tier: 'Top Value' },
      { name: 'YRXVIP (TMX)', url: 'http://yrxvip.x.yupoo.com/', tier: 'New Yupoo' },
    ],
  },
  {
    id: 'mertra',
    brand: 'Mertra',
    category: 'Clothes',
    tagline: 'Heavyweight streetwear hoodies, cargos & puffers',
    sellers: [
      { name: 'PengReps', url: 'https://pengreps.x.yupoo.com/', tier: 'Best Mertra' },
    ],
  },
  {
    id: 'moose-knuckles',
    brand: 'Moose Knuckles',
    category: 'Clothes',
    tagline: 'Heavy winter parkas, ballistic bombers & metal logos',
    sellers: [
      { name: 'Jieyi', url: 'https://jieyi168x.x.yupoo.com/', tier: 'Top Winter Batch' },
    ],
  },
  {
    id: 'north-face',
    brand: 'The North Face (TNF)',
    category: 'Clothes',
    tagline: '1996 Retro Nuptse 700 puffers — Direct product links auto-convert to your saved agent!',
    sellers: [
      {
        name: 'WWTOP Nuptse 700',
        url: 'https://shop1733523732.v.weidian.com/item.html?itemID=7313329956',
        tier: 'Top Batch',
        isDirectProduct: true,
      },
      {
        name: 'ZOK Nuptse 700',
        url: 'https://shop1840716478.v.weidian.com/item.html?itemID=7236798489',
        tier: 'ZOK Batch',
        isDirectProduct: true,
      },
    ],
  },
  {
    id: 'off-white',
    brand: 'Off-White',
    category: 'Clothes',
    tagline: 'Arrow hoodies, Caravaggio tees & zip-ups',
    sellers: [
      { name: 'FakeLab', url: 'https://fakelab.x.yupoo.com/', tier: '#1 Off-White' },
    ],
  },
  {
    id: 'palm-angels',
    brand: 'Palm Angels',
    category: 'Clothes',
    tagline: 'Track jackets, track pants & kill the bear tees',
    sellers: [
      { name: 'RepsBrothers', url: 'http://repsbrothers.x.yupoo.com/', tier: '1:1 Tracksuits' },
    ],
  },
  {
    id: 'parajumpers',
    brand: 'Parajumpers (PJS)',
    category: 'Clothes',
    tagline: ' Down bombers, hybrid jackets & cargo patches',
    sellers: [
      { name: 'CPRepsCN', url: 'http://cprepscn.x.yupoo.com/', tier: 'Specialist' },
    ],
  },
  {
    id: 'prada',
    brand: 'Prada',
    category: 'Clothes',
    tagline: 'Re-Nylon jackets, Linea Rossa & triangle badge pieces',
    sellers: [
      { name: 'TheThunder', url: 'http://thethunder.x.yupoo.com/', tier: '1:1 Luxury' },
      { name: '1to1', url: 'http://1to1.x.yupoo.com/', tier: '1:1 Luxury' },
    ],
  },
  {
    id: 'purple-brand',
    brand: 'Purple Brand Jeans',
    category: 'Clothes',
    tagline: 'Slim & stacked distressed denim with hangtags',
    sellers: [
      { name: 'Pingu7', url: 'http://pingu7.x.yupoo.com/', tier: 'Best Purple' },
      { name: 'Hengyuclub', url: 'http://hengyuclub.x.yupoo.com/' },
      { name: 'Shop60711481 (Taobao Jeans)', url: 'https://shop60711481.taobao.com/', tier: 'Taobao Store' },
    ],
  },
  {
    id: 'ralph-lauren',
    brand: 'Ralph Lauren (Polo RL)',
    category: 'Clothes',
    tagline: 'Cable-knit quarter zips, shirts, hoodies & tracksuits',
    sellers: [
      { name: 'RepKingdom', url: 'http://repkingdom.x.yupoo.com/', tier: '#1 RL Seller' },
      { name: 'NewDP', url: 'https://newdp.x.yupoo.com/' },
    ],
  },
  {
    id: 'rhude',
    brand: 'Rhude',
    category: 'Clothes',
    tagline: 'Vintage graphic tees, racing shorts & denim',
    sellers: [
      { name: 'Akdingji', url: 'https://akdingji.x.yupoo.com/' },
      { name: 'Hengyuclub', url: 'http://hengyuclub.x.yupoo.com/' },
      { name: 'Shop60711481 (Jeans)', url: 'https://shop60711481.taobao.com/' },
    ],
  },
  {
    id: 'rick-owens',
    brand: 'Rick Owens',
    category: 'Clothes',
    tagline: 'DRKSHDW cargos, Pusher pants, hoodies & heavy tees',
    warning: 'Note: DRK Studios is not worth it compared to MKSZY or ROG.',
    sellers: [
      { name: 'MKSZY (Taobao)', url: 'https://shop265281616.m.taobao.com', tier: 'Best / Expensive' },
      { name: 'ROG Studios (Weidian)', url: 'https://weidian.com/?userid=1664593924', tier: 'Good / Cheaper' },
    ],
  },
  {
    id: 'sp5der',
    brand: 'Sp5der Worldwide',
    category: 'Clothes',
    tagline: 'Web puff-print hoodies & rhinestone sweats',
    sellers: [
      { name: 'PikachuShop', url: 'https://pikachushop.x.yupoo.com/', tier: 'Top Batch' },
      { name: 'AngelKing47', url: 'http://angelking47.x.yupoo.com/' },
    ],
  },
  {
    id: 'stone-island',
    brand: 'Stone Island',
    category: 'Clothes',
    tagline: 'Compass badge crews, overshirts, cargos & down jackets',
    sellers: [
      { name: 'Zhang Yupoo', url: 'https://vx798134596.x.yupoo.com/categories', tier: 'Verified' },
    ],
  },
  {
    id: 'stussy',
    brand: 'Stüssy',
    category: 'Clothes',
    tagline: '8-Ball fleeces, graphic tees, hoodies & work jackets',
    sellers: [
      { name: 'ChaosMade', url: 'http://chaosmade.x.yupoo.com/', tier: 'Huge Selection' },
    ],
  },
  {
    id: 'syna-world',
    brand: 'Syna World',
    category: 'Clothes',
    tagline: 'Central Cee tracksuits, puffers & skull caps',
    sellers: [
      { name: 'Elephant Factory', url: 'https://elephant-factory.x.yupoo.com/', tier: 'Top Syna' },
      { name: 'GOAT Official 222', url: 'https://goat-official222.x.yupoo.com/' },
    ],
  },
  {
    id: 'trapstar',
    brand: 'Trapstar London',
    category: 'Clothes',
    tagline: 'Irongate decoded puffers, shooters tracksuits & bags',
    sellers: [
      { name: 'GOAT Official', url: 'http://goat-official.x.yupoo.com/', tier: '#1 Trapstar' },
    ],
  },
  {
    id: 'under-armour',
    brand: 'Under Armour',
    category: 'Clothes',
    tagline: 'Compression gear, tracksuits & gym fits',
    sellers: [
      { name: 'Deateath', url: 'http://deateath.x.yupoo.com/' },
      { name: 'ChaosMade', url: 'http://chaosmade.x.yupoo.com/' },
    ],
  },
  {
    id: 'vlone',
    brand: 'Vlone',
    category: 'Clothes',
    tagline: 'Big V graphic tees & collab hoodies',
    sellers: [
      { name: 'LufiloStudio', url: 'https://lufilostudio.x.yupoo.com', tier: 'Best Vlone' },
      { name: 'Deateath', url: 'http://deateath.x.yupoo.com/' },
    ],
  },
  {
    id: 'zara',
    brand: 'Zara (Retail & Rep Stores)',
    category: 'Clothes',
    tagline: 'Quarter-zips, baggy jeans, knitwear & jackets',
    sellers: [
      { name: 'Best Rep Zara Store', url: 'https://shop525790634.m.taobao.com/', tier: '#1 Rep Zara' },
      { name: '2nd Best Rep Zara', url: 'https://shop359559713.m.taobao.com/', tier: '2nd Best' },
      { name: 'Official Zara Taobao', url: 'https://shop113462750.m.taobao.com/', tier: 'Real Zara' },
    ],
  },
  {
    id: 'multi-brand-streetwear',
    brand: 'Multi-Brand (Nike & Streetwear)',
    category: 'Clothes',
    tagline: 'Mid-to-good quality mega catalogs with Nike, Nocta, Supreme & more',
    sellers: [
      { name: 'DragonRep (NoGhost)', url: 'https://noghost.x.yupoo.com/', tier: 'Nike / Nocta' },
      { name: 'ChaosMade', url: 'http://chaosmade.x.yupoo.com/', tier: 'Streetwear Mega' },
    ],
  },
  {
    id: 'multi-brand-designer',
    brand: 'Multi-Brand Designer Sellers',
    category: 'Clothes',
    tagline: 'High-tier sellers carrying Balenciaga, LV, Dior, Gucci & Prada',
    sellers: [
      { name: 'TopHotFashion', url: 'http://tophotfashion.x.yupoo.com/', tier: 'High Tier' },
      { name: 'TheThunder', url: 'http://thethunder.x.yupoo.com/', tier: 'High Tier' },
      { name: 'LuxFactory888', url: 'https://luxfactory888.x.yupoo.com/', tier: 'Password Needed' },
    ],
  },

  // ==================== SHOES ====================
  {
    id: 'j4-j5-af1',
    brand: 'Jordan 4, Jordan 5 & Air Force 1',
    category: 'Shoes',
    tagline: 'Best batch for J5 is GX. Top overall sneaker batches from WWTOP & ZOK',
    sellers: [
      {
        name: 'WWTOP Weidian Store',
        url: 'https://shop1733523732.v.weidian.com/?userid=1733523732&wfr=c&ifr=itemdetail&spider_token=1229&tabType=all',
        tier: 'GX / PK / Top Batches',
      },
    ],
  },
  {
    id: 'crocs-mcqueen',
    brand: 'Crocs & Alexander McQueen Crocs',
    category: 'Shoes',
    tagline: 'Direct product links — Click to open directly in your saved agent!',
    sellers: [
      {
        name: 'Classic Crocs (1688)',
        url: 'https://detail.1688.com/offer/784799313160.html',
        tier: 'Budget Direct Link',
        isDirectProduct: true,
      },
      {
        name: 'Alexander McQueen Crocs',
        url: 'https://item.taobao.com/item.htm?id=520226468358',
        tier: 'Taobao Direct Link',
        isDirectProduct: true,
      },
    ],
  },
  {
    id: 'alexander-mcqueen',
    brand: 'Alexander McQueen Oversized',
    category: 'Shoes',
    tagline: '1:1 leather oversized sneakers in all colorways',
    sellers: [
      { name: 'Koala', url: 'https://2335499519.x.yupoo.com/', tier: '#1 McQueen' },
    ],
  },
  {
    id: 'balenciaga-shoes',
    brand: 'Balenciaga (Tracks, Runners, 3XL)',
    category: 'Shoes',
    tagline: 'Track LED, Runner, 3XL & Defender batches',
    sellers: [
      { name: 'Ligma Yupoo', url: 'https://ligma.x.yupoo.com', tier: 'Balenciaga Specialist' },
    ],
  },
  {
    id: 'dior-b22-b30',
    brand: 'Dior B22 & Dior B30',
    category: 'Shoes',
    tagline: 'The only two sellers you need for B22 and B30 runners',
    sellers: [
      { name: 'Koala (Dior B22)', url: 'https://2335499519.x.yupoo.com/', tier: '#1 B22 Batch' },
      { name: 'Ice Cream (Dior B30)', url: 'https://1932084671.x.yupoo.com/', tier: '#1 B30 Batch' },
    ],
  },
  {
    id: 'lv-skate',
    brand: 'Louis Vuitton (LV) Skate',
    category: 'Shoes',
    tagline: 'A+ Batch & FS Batch LV Skate sneakers',
    sellers: [
      { name: 'Koala (A+ & FS Batch)', url: 'https://2335499519.x.yupoo.com/', tier: 'Best LV Skate' },
    ],
  },
  {
    id: 'lanvin',
    brand: 'Lanvin Curb Sneakers',
    category: 'Shoes',
    tagline: 'Chunky woven lace Lanvin Curb sneakers',
    sellers: [
      { name: 'Alisson', url: 'https://jz9899wh.x.yupoo.com', tier: 'Best Lanvin' },
    ],
  },
  {
    id: 'valentino-shoes',
    brand: 'Valentino Garavani (Open & Rockstud)',
    category: 'Shoes',
    tagline: 'Yupoo catalog + 2 direct Taobao links auto-converted to your agent',
    sellers: [
      { name: 'Alisson Yupoo', url: 'https://jz9899wh.x.yupoo.com', tier: 'Yupoo Catalog' },
      {
        name: 'Valentino Taobao #1',
        url: 'https://item.taobao.com/item.htm?id=805829529060',
        tier: 'Direct Product',
        isDirectProduct: true,
      },
      {
        name: 'Valentino Taobao #2',
        url: 'https://item.taobao.com/item.htm?id=740883207925',
        tier: 'Direct Product',
        isDirectProduct: true,
      },
    ],
  },
  {
    id: 'golden-goose',
    brand: 'Golden Goose (Ball Star & Super-Star)',
    category: 'Shoes',
    tagline: 'Eazizi is #1; Shark or CKT are easiest if you don’t want DIY ordering',
    sellers: [
      { name: 'Eazizi', url: 'https://eazizi.x.yupoo.com/categories/3886641', tier: '#1 Best' },
      { name: 'Shark Breeder', url: 'https://shark-breeder.x.yupoo.com/categories/4509684', tier: 'Easy Agent Order' },
      { name: 'CKT (Weidian)', url: 'https://h5.weidian.com/decoration/shop-category/category.html?c=149476290&userid=413669337&spider_token=430f', tier: 'Direct Weidian' },
      { name: 'Leo (Szwego)', url: 'https://a2018031411484582569.szwego.com/weshop/store/_ZivqfZp6iQPeZD3hH5X4eFaPFR7pyAKU', tier: 'Provides Taobao Links' },
    ],
  },
  {
    id: 'maison-margiela-gats',
    brand: 'Maison Margiela Replica GATs',
    category: 'Shoes',
    tagline: 'Direct Weidian product link — Opens in your saved agent with 1 click!',
    sellers: [
      {
        name: 'WWTOP Margiela GATs',
        url: 'https://shop1733523732.v.weidian.com/item.html?itemID=7312867454',
        tier: '#1 Direct Link',
        isDirectProduct: true,
      },
    ],
  },
  {
    id: 'louboutins',
    brand: 'Christian Louboutin (Red Bottoms)',
    category: 'Shoes',
    tagline: 'Spikes, suede loafers & dress sneakers',
    sellers: [
      { name: 'Chengou Home', url: 'https://chengouhome.x.yupoo.com/', tier: 'Louboutin Specialist' },
    ],
  },
  {
    id: 'football-shoes',
    brand: 'Football Boots / Cleats',
    category: 'Shoes',
    tagline: 'Mercurial, Predator & Phantom cleats',
    warning: '⚠️ Head-up: We don’t recommend playing competitive football in rep cleats (ankle support risk).',
    sellers: [
      { name: 'AAAABull', url: 'http://aaaabull.x.yupoo.com/', password: 'aaaaaa', tier: 'Cleats Catalog' },
    ],
  },

  // ==================== ACCESSORIES & BAGS ====================
  {
    id: 'chrome-hearts-jewelry',
    brand: 'Chrome Hearts (.925 Silver & Accessories)',
    category: 'Accessories',
    tagline: 'Rings, bracelets, chains, belt buckles & glasses',
    sellers: [
      { name: 'DavidStudio (Taobao)', url: 'https://shop36089321.m.taobao.com', tier: '.925 Silver King' },
    ],
  },
  {
    id: 'goyard',
    brand: 'Goyard (Wallets, Cardholders & Bags)',
    category: 'Accessories',
    tagline: 'Scarlett carries top Afen batch; Weidian link for budget wallets (search "钱包")',
    sellers: [
      { name: 'Scarlett Luxury (Wallets & Afen Bags)', url: 'https://scarlettluxury.x.yupoo.com/', tier: 'Best / Afen Batch' },
      {
        name: 'Budget Goyard Wallets (Weidian)',
        url: 'https://shop939507171.v.weidian.com/?userid=939507171&spider_token=0c00',
        tier: 'Cheaper',
        searchHint: '钱包',
      },
    ],
  },
  {
    id: 'homeware-purses',
    brand: 'Homeware, Decor & Purses',
    category: 'Accessories',
    tagline: 'For luxury purses also check Misschen7, godmall, or mrcanvas',
    sellers: [
      { name: 'CND Homeware Yupoo', url: 'https://cnd-homeware.x.yupoo.com/categories', tier: 'Room & Accessories' },
    ],
  },

  // ==================== ELECTRONICS ====================
  {
    id: 'airpods-electronics',
    brand: 'AirPods & Tech Replicas',
    category: 'Electronics',
    tagline: 'HiCity AirPods direct link auto-opens in your saved agent!',
    sellers: [
      {
        name: 'HiCity AirPods (Weidian)',
        url: 'https://weidian.com/item.html?itemID=7247449195',
        tier: '#1 AirPods Direct Link',
        isDirectProduct: true,
      },
      {
        name: 'Tech & Electronics Store (Weidian)',
        url: 'https://shop1671759537.v.weidian.com/?userid=1671759537',
        tier: 'Full Weidian Shop',
      },
    ],
  },
];

interface SellersViewProps {
  selectedAgent: AgentId;
  onSelectAgent: (agent: AgentId) => void;
  initialBrandFilter?: string;
  onBackToCatalog: () => void;
}

export const SellersView: React.FC<SellersViewProps> = ({
  initialBrandFilter = '',
  onBackToCatalog,
}) => {
  const [activeCategory, setActiveCategory] = useState<SellerCategory>('all');
  const [searchQuery, setSearchQuery] = useState<string>(initialBrandFilter);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const categoryCounts = useMemo(() => {
    const counts: Record<SellerCategory, number> = {
      all: CURATED_BRAND_SELLERS.length,
      Clothes: 0,
      Shoes: 0,
      Accessories: 0,
      Electronics: 0,
    };
    for (const item of CURATED_BRAND_SELLERS) {
      counts[item.category]++;
    }
    return counts;
  }, []);

  const filteredBrands = useMemo(() => {
    return CURATED_BRAND_SELLERS.filter((card) => {
      if (activeCategory !== 'all' && card.category !== activeCategory) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesBrand = card.brand.toLowerCase().includes(q);
        const matchesTagline = card.tagline?.toLowerCase().includes(q);
        const matchesSeller = card.sellers.some(s => s.name.toLowerCase().includes(q));
        return matchesBrand || matchesTagline || matchesSeller;
      }
      return true;
    });
  }, [activeCategory, searchQuery]);

  const handleCopyText = (text: string, tokenKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedToken(tokenKey);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  const handleShareBrand = (brandCard: BrandSellerCard) => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?view=sellers&brand=${encodeURIComponent(brandCard.brand)}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedToken(`share-${brandCard.id}`);
    setTimeout(() => setCopiedToken(null), 1800);
  };

  return (
    <div className="mx-auto w-full min-w-0 max-w-7xl px-4 py-6 space-y-6">
      {/* Compact Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#0B1325] via-[#090E1A] to-[#05070B] p-5 sm:p-6 shadow-[0_16px_45px_rgba(0,0,0,0.55)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-impact text-3xl sm:text-4xl tracking-wide text-white uppercase">
              BEST <span className="text-[#38BDF8] rephub-blue-glow">SELLERS</span> BY BRAND
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              The best Yupoo, Weidian, and Taobao sellers organized by brand.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-2 self-start sm:self-center rounded-full border border-blue-500/30 bg-[#0B101B] hover:bg-blue-600/20 px-4 py-2 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#38BDF8]" />
            <span>Back to Catalog</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs + Brand Search Bar */}
      <div className="sticky top-[61px] z-20 -mx-4 px-4 py-3 bg-[#05070B]/95 backdrop-blur-xl border-b border-blue-500/15 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {(
            [
              { id: 'all', label: 'All Brands', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'Clothes', label: 'Clothes', icon: <Shirt className="w-3.5 h-3.5" /> },
              { id: 'Shoes', label: 'Shoes', icon: <Footprints className="w-3.5 h-3.5" /> },
              { id: 'Accessories', label: 'Accessories & Bags', icon: <Briefcase className="w-3.5 h-3.5" /> },
              { id: 'Electronics', label: 'Electronics', icon: <Headphones className="w-3.5 h-3.5" /> },
            ] as { id: SellerCategory; label: string; icon: React.ReactNode }[]
          ).map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2563EB] text-white shadow-[0_0_18px_rgba(37,99,235,0.4)]'
                    : 'bg-[#0B101B] text-slate-400 hover:text-white border border-blue-500/20'
                }`}
              >
                {cat.icon}
                <span>{cat.label}</span>
                <span className={`font-mono text-[10px] ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                  ({categoryCounts[cat.id]})
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search brand or seller (e.g. Corteiz, Koala, LV)..."
            className="w-full rounded-full border border-blue-500/25 bg-[#0B101B] py-2 pl-10 pr-8 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Brands & Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBrands.map((card) => {
          const isShared = copiedToken === `share-${card.id}`;
          return (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col justify-between rounded-2xl border border-blue-500/20 bg-[#0B101B]/90 p-4 hover:border-blue-500/45 transition-all shadow-[0_8px_30px_rgba(0,0,0,0.4)]"
            >
              <div>
                {/* Brand Header */}
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="inline-block text-[10px] font-mono uppercase tracking-wider text-blue-400 mb-0.5">
                      {card.category}
                    </span>
                    <h3 className="text-base font-extrabold text-white leading-snug">
                      {card.brand}
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleShareBrand(card)}
                    className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-[#05070B] hover:border-blue-400/40 px-2.5 py-1 text-[10px] font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer shrink-0"
                    title="Copy direct share link to this brand"
                  >
                    {isShared ? (
                      <>
                        <Check className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3 h-3" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                {card.tagline && (
                  <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    {card.tagline}
                  </p>
                )}

                {card.warning && (
                  <div className="mb-3 flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-200">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                    <span>{card.warning}</span>
                  </div>
                )}

                {/* Sellers List for this Brand */}
                <div className="space-y-2">
                  {card.sellers.map((seller, idx) => {
                    const pwKey = `pw-${card.id}-${idx}`;
                    const hintKey = `hint-${card.id}-${idx}`;
                    const isYupoo = seller.url.toLowerCase().includes('yupoo');

                    return (
                      <div
                        key={`${card.id}-${idx}`}
                        className="rounded-xl border border-white/10 bg-[#05070B]/90 p-2.5 hover:border-blue-500/40 transition-colors"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <a
                            href={seller.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 min-w-0 flex items-center justify-between gap-2 group"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-xs font-extrabold text-white group-hover:text-[#38BDF8] transition-colors truncate">
                                  {seller.name}
                                </span>
                                {seller.tier && (
                                  <span className="rounded-md bg-blue-500/15 border border-blue-400/30 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#38BDF8]">
                                    {seller.tier}
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-slate-500 truncate mt-0.5">
                                {seller.url.replace(/^https?:\/\//, '')}
                              </div>
                            </div>

                            <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB] group-hover:bg-blue-500 px-3 py-1.5 text-[11px] font-extrabold text-white shrink-0 transition-colors">
                              <span>{isYupoo ? 'Open Yupoo' : 'Open Link'}</span>
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          </a>
                        </div>

                        {/* Optional Password or Search Keyword Helper */}
                        {(seller.password || seller.searchHint) && (
                          <div className="mt-2 pt-2 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                            {seller.password && (
                              <div className="flex items-center gap-1.5 text-amber-300">
                                <KeyRound className="w-3 h-3" />
                                <span>Password: <strong className="font-mono">{seller.password}</strong></span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(seller.password!, pwKey)}
                                  className="ml-1 rounded bg-amber-500/20 hover:bg-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold text-amber-200 cursor-pointer"
                                >
                                  {copiedToken === pwKey ? 'Copied!' : 'Copy PW'}
                                </button>
                              </div>
                            )}

                            {seller.searchHint && (
                              <div className="flex items-center gap-1.5 text-sky-300">
                                <span>Search in store: <strong className="font-mono">{seller.searchHint}</strong></span>
                                <button
                                  type="button"
                                  onClick={() => handleCopyText(seller.searchHint!, hintKey)}
                                  className="ml-1 rounded bg-sky-500/20 hover:bg-sky-500/30 px-1.5 py-0.5 text-[10px] font-bold text-sky-200 cursor-pointer"
                                >
                                  {copiedToken === hintKey ? 'Copied!' : 'Copy Term'}
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
