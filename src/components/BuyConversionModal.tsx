import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Copy, 
  Check, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import { ProductItem, AgentId, CurrencyCode } from '../types/index.ts';
import { 
  DEFAULT_AGENTS, 
  RAIDED_BLACKLIST_AGENTS,
  buildAgentUrl, 
  LOCKED_REFERRAL_CODES, 
  getProxiedImageUrl,
  formatConvertedPrice
} from '../utils/agentConverter.ts';

interface BuyConversionModalProps {
  product: ProductItem | null;
  selectedAgent: AgentId;
  currency: CurrencyCode;
  onSelectAgent: (agent: AgentId) => void;
  onClose: () => void;
  skipPopupPreference: boolean;
  onToggleSkipPopup: (skip: boolean) => void;
}

export const BuyConversionModal: React.FC<BuyConversionModalProps> = ({
  product,
  selectedAgent,
  currency,
  onSelectAgent,
  onClose,
  skipPopupPreference,
  onToggleSkipPopup,
}) => {
  const [copiedRaw, setCopiedRaw] = useState(false);

  const activeAgent = DEFAULT_AGENTS.find(a => a.id === selectedAgent) || DEFAULT_AGENTS[0];
  const rawStoreUrl = product ? (product.rawUrl || product.buyLinks[0]?.url || '') : '';
  const convertedBuyUrl = product
    ? buildAgentUrl(rawStoreUrl, selectedAgent, LOCKED_REFERRAL_CODES[selectedAgent])
    : '#';

  useEffect(() => {
    if (product && rawStoreUrl) {
      navigator.clipboard?.writeText(rawStoreUrl).catch(() => {});
    }
  }, [product, rawStoreUrl]);

  if (!product) return null;

  const proxiedImg = getProxiedImageUrl(product.image);
  const displayPrice = product.priceNum > 0
    ? formatConvertedPrice(product.priceNum, currency)
    : product.price;

  const handleCopyRaw = () => {
    navigator.clipboard.writeText(rawStoreUrl);
    setCopiedRaw(true);
    setTimeout(() => setCopiedRaw(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg flex flex-col rounded-3xl border border-blue-500/35 bg-[#070B14] shadow-[0_0_50px_rgba(37,99,235,0.25)] overflow-hidden">
        {/* Header with Real Agent Logo */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0B101B]">
          <div className="flex items-center gap-3">
            {activeAgent.logoUrl && (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-blue-500/40 p-1.5">
                <img
                  src={activeAgent.logoUrl}
                  alt={activeAgent.name}
                  className="h-full w-full rounded-full object-contain"
                />
              </div>
            )}
            <div>
              <h2 className="text-sm font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
                <span>Order via {activeAgent.name}</span>
                <span className="text-[10px] font-mono text-blue-400">
                  {activeAgent.couponHeadline}
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Official referral code & signup bonus automatically applied
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Close buy modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Selected Item Summary with Real Spreadsheet Image */}
          <div className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-[#0B101B] p-3">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {proxiedImg && (
                <img
                  src={proxiedImg}
                  alt={product.title}
                  className="h-14 w-14 rounded-xl object-cover border border-white/10 bg-[#05070B] shrink-0"
                />
              )}
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-white truncate" title={product.title}>
                  {product.title}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                  <span className="text-blue-400 font-semibold">{product.seller}</span>
                  <span>·</span>
                  <span className="font-mono text-[#38BDF8] font-bold tabular-nums">{displayPrice}</span>
                  <span>·</span>
                  <span className="uppercase font-mono text-[10px] text-slate-500">{product.platform || 'store'}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleCopyRaw}
              className="flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-[#05070B] hover:bg-blue-950/50 px-3 py-1.5 text-[11px] font-semibold text-slate-200 transition-colors cursor-pointer shrink-0"
              title="Copy raw store link"
            >
              {copiedRaw ? (
                <>
                  <Check className="w-3.5 h-3.5 text-blue-400" />
                  <span className="text-blue-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Raw Link</span>
                </>
              )}
            </button>
          </div>

          {/* Step 1: Bolonart-Style Glowing Agent Signup Coupon Pill */}
          {activeAgent.signupUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                <span>Step 1 · Claim {activeAgent.name} Signup Coupons</span>
                <span className="font-mono text-blue-400">Code: {activeAgent.defaultReferralCode}</span>
              </div>

              <a
                href={activeAgent.signupUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-3 rounded-full border border-blue-500/50 bg-gradient-to-r from-[#0B1325] via-[#102042] to-[#0B1325] px-4 py-3 rephub-pill-glow hover:border-blue-400 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {activeAgent.logoUrl && (
                    <img
                      src={activeAgent.logoUrl}
                      alt={activeAgent.name}
                      className="h-9 w-9 rounded-full object-contain bg-white/10 p-1 shrink-0"
                    />
                  )}
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold uppercase tracking-wider text-white">
                      SIGN UP ON {activeAgent.name}
                    </div>
                    <div className="font-impact text-lg text-[#38BDF8] tracking-wide uppercase leading-tight">
                      {activeAgent.couponHeadline} ({activeAgent.bonusText})
                    </div>
                  </div>
                </div>
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/25 text-blue-300">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </a>
            </div>
          )}

          {/* Step 2: Direct Converted Product Link */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
              <span>Step 2 · Open Product on {activeAgent.name}</span>
              <span className="font-mono text-blue-400">Referral Embedded</span>
            </div>

            <a
              href={convertedBuyUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="flex items-center justify-center gap-2.5 w-full rounded-full bg-[#2563EB] hover:bg-blue-500 py-3.5 px-5 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white transition-all shadow-[0_0_25px_rgba(37,99,235,0.45)]"
            >
              {activeAgent.logoUrl && (
                <img
                  src={activeAgent.logoUrl}
                  alt={activeAgent.name}
                  className="h-4 w-4 rounded-full object-contain bg-white/20"
                />
              )}
              <span>Continue to {activeAgent.name} Product Page</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {/* Switch Active Agent (with Real Logos + Subtle Crossed-Out Agents) */}
          <div className="pt-3 border-t border-white/10 space-y-2.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Switch Partner Agent:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {DEFAULT_AGENTS.filter(a => a.id !== 'raw').map(agent => {
                const isSelected = agent.id === selectedAgent;
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => onSelectAgent(agent.id)}
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                        : 'bg-[#0B101B] border border-white/10 text-slate-300 hover:text-white hover:border-blue-500/40'
                    }`}
                  >
                    {agent.logoUrl && (
                      <img
                        src={agent.logoUrl}
                        alt={agent.name}
                        className="h-3.5 w-3.5 rounded-full object-contain bg-white/10"
                      />
                    )}
                    <span>{agent.name}</span>
                  </button>
                );
              })}

              {/* Crossed-out agents inline */}
              {RAIDED_BLACKLIST_AGENTS.map(bad => (
                <span
                  key={bad.id}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[11px] text-slate-500 line-through opacity-40 select-none"
                >
                  <img
                    src={bad.logoUrl}
                    alt={bad.name}
                    className="h-3.5 w-3.5 rounded-full grayscale object-contain"
                  />
                  <span>{bad.name}</span>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-white/10 px-6 py-3.5 bg-[#0B101B] text-xs">
          <label className="flex items-center gap-2 text-[11px] text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={skipPopupPreference}
              onChange={(e) => onToggleSkipPopup(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
            />
            <span>Open product links directly next time</span>
          </label>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
