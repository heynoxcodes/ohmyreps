export interface DestinationCountry {
  code: string;
  name: string;
  flag: string;
  baseRatePerKg: number;
  deliveryDaysMin: number;
  deliveryDaysMax: number;
  recommendedLines: string[];
}

export const COUNTRIES: DestinationCountry[] = [
  { code: 'US', name: 'United States', flag: '🇺🇸', baseRatePerKg: 14.5, deliveryDaysMin: 8, deliveryDaysMax: 15, recommendedLines: ['US Tax-Free (Actual Weight)', 'KR-EMS', 'DHL Express'] },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', baseRatePerKg: 12.0, deliveryDaysMin: 7, deliveryDaysMax: 12, recommendedLines: ['Royal Mail Tax-Free', 'UK-Line-B', 'GD-EMS'] },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', baseRatePerKg: 13.0, deliveryDaysMin: 9, deliveryDaysMax: 14, recommendedLines: ['DHL Europacket Tax-Free', 'Hermes Line', 'EU-Tariffless'] },
  { code: 'FR', name: 'France', flag: '🇫🇷', baseRatePerKg: 13.2, deliveryDaysMin: 8, deliveryDaysMax: 13, recommendedLines: ['DHL Tariffless-F', 'Colissimo Tax-Free', 'GD-EMS'] },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', baseRatePerKg: 15.0, deliveryDaysMin: 9, deliveryDaysMax: 18, recommendedLines: ['Canada Sea Packet', 'CA-PD-Line', 'EMS'] },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', baseRatePerKg: 11.5, deliveryDaysMin: 7, deliveryDaysMax: 12, recommendedLines: ['AU-Express', 'Australia Post Tax-Free', 'EMS'] },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', baseRatePerKg: 13.5, deliveryDaysMin: 9, deliveryDaysMax: 15, recommendedLines: ['DHL Tariffless-Y', 'Poste Italiane', 'UPS'] },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', baseRatePerKg: 13.2, deliveryDaysMin: 8, deliveryDaysMax: 14, recommendedLines: ['DHL Tariffless', 'Correos Tax-Free'] },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', baseRatePerKg: 12.8, deliveryDaysMin: 8, deliveryDaysMax: 13, recommendedLines: ['DHL Europacket', 'PostNL'] },
];

/**
 * Estimates weight in grams based on item category and title
 */
export function estimateItemWeight(category: string, title: string): number {
  const t = title.toLowerCase();
  const c = category.toLowerCase();

  if (t.includes('jacket') || t.includes('down') || t.includes('puffer') || t.includes('coat')) return 1100;
  if (t.includes('hoodie') || t.includes('crewneck') || t.includes('sweatshirt')) return 750;
  if (t.includes('set') || t.includes('tracksuit')) return 950;
  if (t.includes('pants') || t.includes('jeans') || t.includes('cargo') || t.includes('sweatpants')) return 600;
  if (c.includes('shoe') || t.includes('sneaker') || t.includes('dunk') || t.includes('jordan')) return 1250;
  if (t.includes('short')) return 300;
  if (t.includes('t-shirt') || t.includes('tee') || t.includes('polo')) return 260;
  if (c.includes('wallet') || c.includes('bag') || t.includes('backpack')) return 700;
  if (c.includes('belt')) return 220;
  if (c.includes('glass')) return 150;
  if (c.includes('jewelry')) return 80;
  if (c.includes('electronic')) return 350;

  return 400; // default average
}

export function calculateShippingQuote(totalWeightGrams: number, countryCode: string) {
  const country = COUNTRIES.find(c => c.code === countryCode) || COUNTRIES[0];
  const weightKg = Math.max(0.5, totalWeightGrams / 1000);
  
  // First 500g has base dispatch fee ($8), then rate per additional 500g
  const baseCost = 8.5;
  const additionalCost = (weightKg - 0.5) * country.baseRatePerKg;
  const rawShipping = Math.max(12, baseCost + Math.max(0, additionalCost));

  // Insurance (~3%)
  const estimatedInsurance = Math.round(rawShipping * 0.03 * 10) / 10;
  const totalShipping = Math.round(rawShipping);

  return {
    weightKg: Math.round(weightKg * 100) / 100,
    shippingCostUsd: totalShipping,
    insuranceCostUsd: estimatedInsurance,
    deliveryRange: `${country.deliveryDaysMin}-${country.deliveryDaysMax} business days`,
    recommendedLines: country.recommendedLines,
    country,
  };
}
