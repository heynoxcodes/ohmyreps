import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  Copy, 
  Check, 
  Camera, 
  Heart, 
  ChevronDown
} from 'lucide-react';
import { ProductItem, AgentId, CurrencyCode } from '../types/index.ts';
import { 
  buildAgentUrl, 
  DEFAULT_AGENTS, 
  LOCKED_REFERRAL_CODES, 
  getProxiedImageUrl,
  formatConvertedPrice,
  convertNotesCurrency
} from '../utils/agentConverter.ts';
import { getBrandVisual } from '../utils/brandVisuals.ts';
import { AgentHealthBadge } from './Header.tsx';

interface ProductCardProps {
  product: ProductItem;
  selectedAgent: AgentId;
  onSelectAgent: (agent: AgentId) => void;
  currency: CurrencyCode;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenQcModal: (product: ProductItem) => void;
  eagerLoad?: boolean;
  onImageLoaded?: (id: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  selectedAgent,
  onSelectAgent,
  currency,
  isFavorite,
  onToggleFavorite,
  onOpenQcModal,
  eagerLoad = false,
  onImageLoaded,
}) => {
  const [copied, setCopied] = useState(false);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [imgRetryCount, setImgRetryCount] = useState(0);
  const [imgFailedPermanently, setImgFailedPermanently] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const activeAgentConfig = DEFAULT_AGENTS.find(a => a.id === selectedAgent) || DEFAULT_AGENTS[0];
  const refCode = LOCKED_REFERRAL_CODES[selectedAgent];

  // Route Google Sheet images through the backend session-cookie proxy with automatic retry support
  const baseProxiedUrl = getProxiedImageUrl(product.image);
  const resolvedImageUrl = baseProxiedUrl
    ? imgRetryCount > 0
      ? `${baseProxiedUrl}${baseProxiedUrl.includes('?') ? '&' : '?'}retry=${imgRetryCount}`
      : baseProxiedUrl
    : '';
  const canDisplayImage = Boolean(resolvedImageUrl && !imgFailedPermanently);

  const brandVisual = getBrandVisual(product.title, product.category);
  // Prioritize original buyLinks[0].url so Oopbuy channel codes (0=1688, 1=taobao, 2/weidian=weidian) are always preserved accurately
  const rawProductUrl = product.buyLinks[0]?.url || product.rawUrl || '';

  // Direct 1-click product URL with locked user referral parameter embedded!
  const primaryBuyUrl = buildAgentUrl(
    rawProductUrl,
    selectedAgent,
    refCode
  );

  const displayPrice = formatConvertedPrice(product.priceNum, currency, product.price);
  const displayNotes = convertNotesCurrency(product.notes, currency);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(primaryBuyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImageError = () => {
    if (imgRetryCount < 3) {
      setTimeout(() => {
        setImgRetryCount((prev) => prev + 1);
      }, 400 * (imgRetryCount + 1));
    } else {
      setImgFailedPermanently(true);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="group relative flex flex-col justify-between rounded-2xl border border-blue-500/20 bg-[#0B101B]/90 p-2.5 sm:p-3 hover:border-blue-500/55 hover:bg-[#0E1626] transition-colors shadow-[0_8px_30px_rgba(0,0,0,0.45)]"
    >
      {/* Top Product Image (Click image to open product directly with referral!) */}
      <div>
        <div
          className={`relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 flex flex-col justify-between p-3 mb-2.5 ${
            canDisplayImage ? 'bg-[#070A12]' : `bg-gradient-to-br ${brandVisual.bgGradient}`
          }`}
        >
          <a
            href={primaryBuyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-10 block"
            aria-label={`Buy ${product.title} on ${activeAgentConfig.name}`}
          >
            {canDisplayImage ? (
              <>
                {!imgLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0D1526] via-[#131F38] to-[#0B101B] animate-pulse flex items-center justify-center">
                    <span className="text-xs font-mono font-bold text-blue-400/40">
                      {brandVisual.shortCode}
                    </span>
                  </div>
                )}
                <img
                  src={resolvedImageUrl}
                  alt={product.title}
                  onLoad={() => {
                    setImgLoaded(true);
                    onImageLoaded?.(product.id);
                  }}
                  onError={handleImageError}
                  loading={eagerLoad ? 'eager' : 'lazy'}
                  className={`h-full w-full object-cover transition-all duration-500 ease-out group-hover:scale-108 ${
                    imgLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </>
            ) : (
              <div className="h-full w-full flex flex-col justify-between p-3">
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className={`font-bold uppercase ${brandVisual.accentColor}`}>
                    {brandVisual.name}
                  </span>
                  <span>{product.platform || 'STORE'}</span>
                </div>

                <div className="flex flex-col items-center justify-center my-auto">
                  <span className="text-3xl font-extrabold font-mono tracking-tighter text-white/90 group-hover:scale-105 transition-transform">
                    {brandVisual.shortCode}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium tracking-tight mt-0.5 text-center line-clamp-1 max-w-[130px]">
                    {brandVisual.tagline}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                  <span className="truncate max-w-[85px]">{product.seller}</span>
                  {product.qcLink && (
                    <span className="text-blue-400 font-semibold shrink-0">QC Ready</span>
                  )}
                </div>
              </div>
            )}
          </a>

          {/* Top Floating Favorite Button */}
          <div className="absolute top-2 right-2 flex items-center gap-1.5 z-20">
            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className="rounded-full bg-black/75 p-1.5 text-slate-300 hover:text-blue-400 hover:bg-black/95 transition-colors backdrop-blur-md cursor-pointer border border-white/10"
              aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              title="Toggle favorite"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-blue-400 text-blue-400' : ''}`} />
            </motion.button>
          </div>
        </div>

        {/* Clean Unboxed Metadata Row */}
        <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
          <div className="flex items-center gap-1 text-slate-400 truncate">
            <span className="text-blue-400 font-semibold truncate">{product.seller}</span>
            <span aria-hidden="true">·</span>
            <span className="truncate">{product.category}</span>
          </div>
          <span className="font-mono font-extrabold text-[#38BDF8] text-xs sm:text-sm tabular-nums shrink-0">
            {displayPrice}
          </span>
        </div>

        {/* Product Title */}
        <a
          href={primaryBuyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block text-xs sm:text-[13px] font-bold text-white line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors mb-1.5 min-h-[2.25rem]"
          title={product.title}
        >
          {product.title}
        </a>

        {/* Quiet inline note if present */}
        {displayNotes && (
          <p
            className="mb-1.5 text-[10px] text-slate-400 line-clamp-1"
            title={displayNotes}
          >
            {displayNotes}
          </p>
        )}
      </div>

      {/* Action Footer */}
      <div className="mt-1.5 space-y-2 pt-2 border-t border-white/10">
        {/* Direct 1-Click Buy Button with Real Agent Logo + Quick Switch & Save Dropdown */}
        <div className="flex items-center gap-1">
          <a
            href={primaryBuyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 rounded-full bg-[#2563EB] hover:bg-blue-500 px-2.5 py-2 text-[11px] sm:text-xs font-extrabold text-white transition-all cursor-pointer whitespace-nowrap shadow-[0_0_15px_rgba(37,99,235,0.35)]"
            title={`Opens product directly on ${activeAgentConfig.name} with referral & coupons`}
          >
            {activeAgentConfig.logoUrl && (
              <img
                src={activeAgentConfig.logoUrl}
                alt={activeAgentConfig.name}
                className="h-4 w-4 rounded-full object-contain bg-white/15 shrink-0"
              />
            )}
            <span className="truncate">{activeAgentConfig.name}</span>
            <ExternalLink className="w-3 h-3 shrink-0 opacity-85" />
          </a>

          {/* Quick Switcher dropdown to save & open with any other agent */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setIsAgentMenuOpen(!isAgentMenuOpen)}
              className="rounded-full border border-blue-500/30 bg-[#05070B] hover:bg-blue-950/50 p-2 text-slate-300 transition-colors cursor-pointer"
              title="Save & open with another agent"
              aria-label="Open with other agents"
            >
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isAgentMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isAgentMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsAgentMenuOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.96 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 bottom-full mb-1.5 w-64 rounded-2xl border border-blue-500/35 bg-[#0A0F1A] p-1.5 shadow-2xl z-40"
                  >
                    <div className="px-2.5 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 flex items-center justify-between">
                      <span>Save & Open With Agent</span>
                      <span className="text-emerald-400 font-mono">STATUS</span>
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-0.5 py-1">
                      {DEFAULT_AGENTS.map((agent) => {
                        const agentDirectUrl = buildAgentUrl(
                          rawProductUrl,
                          agent.id,
                          LOCKED_REFERRAL_CODES[agent.id]
                        );
                        return (
                          <a
                            key={agent.id}
                            href={agentDirectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              onSelectAgent(agent.id);
                              setIsAgentMenuOpen(false);
                            }}
                            className="w-full flex items-center justify-between rounded-xl px-2.5 py-1.5 text-xs text-slate-300 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                          >
                            <div className="flex items-center gap-2 truncate">
                              {agent.logoUrl ? (
                                <img
                                  src={agent.logoUrl}
                                  alt={agent.name}
                                  className="h-4 w-4 rounded-full object-contain bg-white/10 shrink-0"
                                />
                              ) : (
                                <span className="h-4 w-4 rounded-full bg-slate-800 text-[8px] flex items-center justify-center font-mono">
                                  RAW
                                </span>
                              )}
                              <span className="font-semibold truncate">{agent.name}</span>
                              {agent.id !== 'raw' && (
                                <AgentHealthBadge status={agent.healthStatus} compact />
                              )}
                            </div>
                            <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                          </a>
                        );
                      })}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Secondary utilities row: QC Pics & Copy Link */}
        <div className="flex items-center justify-between gap-1 text-[11px]">
          {product.qcLink ? (
            <button
              type="button"
              onClick={() => onOpenQcModal(product)}
              className="flex items-center gap-1 text-slate-400 hover:text-blue-400 transition-colors cursor-pointer py-0.5 whitespace-nowrap font-medium"
            >
              <Camera className="w-3.5 h-3.5 text-blue-400" />
              <span>QC Pics</span>
            </button>
          ) : (
            <span className="text-[10px] text-slate-600">Warehouse QC</span>
          )}

          <button
            type="button"
            onClick={handleCopyLink}
            className="flex items-center gap-1 px-2 py-0.5 rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer text-[11px]"
            title="Copy converted affiliate link"
            aria-label="Copy link"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-blue-400" />
                <span className="text-blue-400 font-semibold">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
