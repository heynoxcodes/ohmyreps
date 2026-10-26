export type AgentId = 
  | 'cnshopper'
  | 'stargobuy'
  | 'oopbuy'
  | 'superbuy'
  | 'lovegobuy'
  | 'sugargoo'
  | 'boonbuy'
  | 'hipobuy'
  | 'litbuy'
  | 'gtbuy'
  | 'lolobuy'
  | 'rizzitgo'
  | 'raw';

export type CurrencyCode = 'USD' | 'GBP' | 'EUR' | 'CAD' | 'AUD' | 'CNY';

export type AgentHealthStatus = 'Online' | 'High Traffic' | 'Slow';

export interface AgentConfig {
  id: AgentId;
  name: string;
  tagline: string;
  badgeColor: string;
  logoText: string;
  logoUrl: string;
  couponHeadline: string;
  defaultReferralCode: string;
  signupUrl: string;
  bonusText: string;
  healthStatus: AgentHealthStatus;
  isTopPick?: boolean;
  isNewAgent?: boolean;
  enabled: boolean;
}

export interface BlacklistedAgent {
  id: string;
  name: string;
  logoUrl: string;
}

export interface SheetTab {
  id: string;
  name: string;
  gid: string;
  iconName: string;
}

export interface ProductItem {
  id: string;
  title: string;
  category: string;
  price: string;
  priceNum: number;
  seller: string;
  image: string;
  buyLinks: { url: string; text: string }[];
  qcLink?: string;
  notes?: string;
  rawUrl?: string;
  platform?: 'weidian' | 'taobao' | '1688' | 'tmall' | 'unknown';
  productId?: string;
}

export interface HaulItem {
  product: ProductItem;
  quantity: number;
  selectedAgent: AgentId;
  estimatedWeightGrams: number;
  sizeOrNotes?: string;
}

export interface SyncStatus {
  lastSynced: string;
  itemCount: number;
  activeSheetUrl: string;
  status: 'idle' | 'syncing' | 'error' | 'success';
  errorMessage?: string;
}
