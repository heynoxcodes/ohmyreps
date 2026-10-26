import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Truck, 
  ExternalLink, 
  Download
} from 'lucide-react';
import { HaulItem, AgentId, ProductItem, CurrencyCode } from '../types/index.ts';
import { COUNTRIES, calculateShippingQuote } from '../utils/shippingCalculator.ts';
import { 
  buildAgentUrl, 
  DEFAULT_AGENTS, 
  LOCKED_REFERRAL_CODES, 
  getProxiedImageUrl,
  formatConvertedPrice
} from '../utils/agentConverter.ts';
import { getBrandVisual } from '../utils/brandVisuals.ts';

interface HaulDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  haul: HaulItem[];
  currency: CurrencyCode;
  onUpdateQuantity: (productId: string, delta: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearHaul: () => void;
  selectedAgent: AgentId;
  onTriggerBuy: (product: ProductItem) => void;
}

export const HaulDrawer: React.FC<HaulDrawerProps> = ({
  isOpen,
  onClose,
  haul,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearHaul,
  selectedAgent,
  onTriggerBuy,
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState('US');

  if (!isOpen) return null;

  const totalItemsCount = haul.reduce((sum, item) => sum + item.quantity, 0);
  const totalProductsCost = haul.reduce((sum, item) => sum + item.product.priceNum * item.quantity, 0);
  const totalWeightGrams = haul.reduce((sum, item) => sum + item.estimatedWeightGrams * item.quantity, 0);

  const quote = calculateShippingQuote(totalWeightGrams, selectedCountryCode);
  const totalEstimatedCost = totalProductsCost + quote.shippingCostUsd + quote.insuranceCostUsd;

  const activeAgentConfig = DEFAULT_AGENTS.find(a => a.id === selectedAgent) || DEFAULT_AGENTS[0];
  const refCode = LOCKED_REFERRAL_CODES[selectedAgent];

  const handleExportCsv = () => {
    const headers = ['Title', 'Seller', 'Category', 'Price', 'Quantity', 'EstWeight_g', 'AgentLink', 'SignupUrl'];
    const rows = haul.map(item => [
      `"${item.product.title.replace(/"/g, '""')}"`,
      `"${item.product.seller}"`,
      `"${item.product.category}"`,
      item.product.price,
      item.quantity,
      item.estimatedWeightGrams,
      `"${buildAgentUrl(item.product.rawUrl || '', selectedAgent, refCode)}"`,
      `"${activeAgentConfig.signupUrl}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ohmyreps-haul-${selectedAgent}-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#070B14] border-l border-blue-500/25 flex flex-col shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#0B101B]">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">
                  OhMyReps Haul & Shipping Estimator
                </h2>
                <p className="text-xs text-slate-400 font-mono tabular-nums">
                  {totalItemsCount} {totalItemsCount === 1 ? 'item' : 'items'} · ~{quote.weightKg} kg estimated
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Close Haul Drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {haul.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center space-y-3">
                <div className="p-4 rounded-full bg-[#0B101B] text-slate-600 border border-white/5">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <div className="text-sm font-bold text-slate-300">Your haul is empty</div>
                <p className="text-xs text-slate-500 max-w-xs">
                  Click "+ Haul" on any spreadsheet item to calculate shipping rates, total weight, and build your parcel.
                </p>
              </div>
            ) : (
              <>
                {/* Partner Coupon Callout inside Haul with Real Agent Logo */}
                {activeAgentConfig.signupUrl && (
                  <div className="rounded-2xl border border-blue-500/40 bg-blue-600/15 p-3.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {activeAgentConfig.logoUrl && (
                        <img
                          src={activeAgentConfig.logoUrl}
                          alt={activeAgentConfig.name}
                          className="h-8 w-8 rounded-full object-contain bg-white/10 p-1 shrink-0"
                        />
                      )}
                      <div className="text-xs min-w-0">
                        <div className="font-extrabold text-white truncate">
                          {activeAgentConfig.name} · {activeAgentConfig.couponHeadline}
                        </div>
                        <div className="text-[11px] text-blue-200 truncate">
                          {activeAgentConfig.bonusText}
                        </div>
                      </div>
                    </div>
                    <a
                      href={activeAgentConfig.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#2563EB] hover:bg-blue-500 px-3 py-1.5 text-[11px] font-extrabold text-white shrink-0 transition-colors"
                    >
                      Claim
                    </a>
                  </div>
                )}

                {/* List of items */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-bold text-white">Parcel Items ({haul.length})</span>
                    <button
                      onClick={onClearHaul}
                      className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                    >
                      Clear all
                    </button>
                  </div>

                  <div className="space-y-2">
                    {haul.map((item) => {
                      const brand = getBrandVisual(item.product.title, item.product.category);
                      const imgUrl = getProxiedImageUrl(item.product.image);

                      return (
                        <div
                          key={item.product.id}
                          className="flex items-center gap-3 p-2.5 rounded-2xl border border-white/10 bg-[#0B101B] hover:border-blue-500/30 transition-colors"
                        >
                          {imgUrl ? (
                            <img
                              src={imgUrl}
                              alt={item.product.title}
                              className="w-14 h-14 shrink-0 rounded-xl object-cover border border-white/10 bg-[#05070B]"
                            />
                          ) : (
                            <div className={`w-14 h-14 shrink-0 rounded-xl border border-white/10 flex flex-col items-center justify-center bg-gradient-to-br ${brand.bgGradient}`}>
                              <span className="text-xs font-extrabold font-mono text-white">
                                {brand.shortCode}
                              </span>
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-bold text-white truncate" title={item.product.title}>
                              {item.product.title}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5 font-mono tabular-nums">
                              <span className="text-blue-400 font-sans font-semibold">{item.product.seller}</span>
                              <span>·</span>
                              <span className="text-[#38BDF8] font-bold">
                                {formatConvertedPrice(item.product.priceNum, currency)}
                              </span>
                              <span>·</span>
                              <span>~{item.estimatedWeightGrams * item.quantity}g</span>
                            </div>

                            {/* Quantity & Buy link */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-[#05070B] px-1.5 py-0.5 text-xs">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, -1)}
                                  className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="px-1.5 font-mono text-xs font-semibold tabular-nums">{item.quantity}</span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, 1)}
                                  className="p-0.5 text-slate-400 hover:text-white cursor-pointer"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => onTriggerBuy(item.product)}
                                  className="text-[11px] text-blue-400 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
                                >
                                  <span>Buy</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>

                                <button
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="text-slate-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                                  aria-label="Remove item"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Shipping Estimator Section */}
                <div className="space-y-3 rounded-2xl border border-white/10 bg-[#0B101B] p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
                      <Truck className="w-4 h-4 text-blue-400" />
                      Shipping Quote Estimator
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      Tax-Free Lines
                    </span>
                  </div>

                  {/* Country Selector */}
                  <div className="space-y-1">
                    <label htmlFor="haul-country-select" className="text-[11px] text-slate-400">Destination Country</label>
                    <select
                      id="haul-country-select"
                      value={selectedCountryCode}
                      onChange={(e) => setSelectedCountryCode(e.target.value)}
                      className="w-full rounded-full border border-blue-500/30 bg-[#05070B] px-3 py-1.5 text-xs text-slate-200 focus:border-blue-400 focus:outline-none cursor-pointer"
                    >
                      {COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.flag} {country.name} (${country.baseRatePerKg}/kg)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Calculation summary */}
                  <div className="space-y-1.5 pt-2 border-t border-white/10 text-xs font-mono tabular-nums">
                    <div className="flex justify-between text-slate-400">
                      <span className="font-sans">Items Subtotal:</span>
                      <span className="text-slate-200">{formatConvertedPrice(totalProductsCost, currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className="font-sans">Estimated Parcel Weight:</span>
                      <span className="text-slate-200">{quote.weightKg} kg</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className="font-sans">Estimated Shipping ({quote.country.name}):</span>
                      <span className="text-slate-200">{formatConvertedPrice(quote.shippingCostUsd, currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className="font-sans">Customs Insurance:</span>
                      <span className="text-slate-200">{formatConvertedPrice(quote.insuranceCostUsd, currency)}</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span className="font-sans">Estimated Transit Time:</span>
                      <span className="text-blue-400 font-sans font-medium">{quote.deliveryRange}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-white/10">
                      <span className="font-sans">Total Estimated Cost:</span>
                      <span className="text-[#38BDF8]">{formatConvertedPrice(totalEstimatedCost, currency)}</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          {haul.length > 0 && (
            <div className="border-t border-white/10 p-5 bg-[#0B101B] space-y-2">
              {activeAgentConfig.signupUrl && (
                <a
                  href={activeAgentConfig.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-blue-500 py-2.5 text-xs font-extrabold text-white transition-colors cursor-pointer"
                >
                  {activeAgentConfig.logoUrl && (
                    <img
                      src={activeAgentConfig.logoUrl}
                      alt={activeAgentConfig.name}
                      className="h-4 w-4 rounded-full object-contain bg-white/15"
                    />
                  )}
                  <span>Sign Up & Order on {activeAgentConfig.name}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}

              <button
                onClick={handleExportCsv}
                className="w-full flex items-center justify-center gap-2 rounded-full border border-white/15 hover:bg-white/5 py-2 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Haul Manifest (CSV)</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
