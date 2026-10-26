import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Crown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Heart,
  Sparkles,
  Camera,
  Flame,
} from 'lucide-react';
import { ProductItem, AgentId, CurrencyCode } from '../types/index.ts';
import { BestPickEntry } from '../utils/featuredOrder.ts';
import {
  buildAgentUrl,
  DEFAULT_AGENTS,
  LOCKED_REFERRAL_CODES,
  getProxiedImageUrl,
  formatConvertedPrice,
} from '../utils/agentConverter.ts';
import { getBrandVisual } from '../utils/brandVisuals.ts';

interface BestPicksCarouselProps {
  picks: BestPickEntry[];
  categoryName: string;
  selectedAgent: AgentId;
  currency: CurrencyCode;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onOpenQcModal: (product: ProductItem) => void;
}

export const BestPicksCarousel: React.FC<BestPicksCarouselProps> = ({
  picks,
  categoryName,
  selectedAgent,
  currency,
  favorites,
  onToggleFavorite,
  onOpenQcModal,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const activeAgentConfig =
    DEFAULT_AGENTS.find((a) => a.id === selectedAgent) || DEFAULT_AGENTS[0];
  const refCode = LOCKED_REFERRAL_CODES[selectedAgent];

  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 12);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 12);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [picks]);

  // Reset scroll to start when category changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  }, [categoryName]);

  // Gentle auto-advance carousel when user isn't hovering
  useEffect(() => {
    if (isHovered || picks.length === 0) return;
    const timer = setInterval(() => {
      const el = scrollRef.current;
      if (!el) return;
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 20) {
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 260, behavior: 'smooth' });
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [isHovered, picks.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const distance = direction === 'left' ? -520 : 520;
    el.scrollBy({ left: distance, behavior: 'smooth' });
  };

  if (!picks || picks.length === 0) return null;

  return (
    <section
      aria-label={`Best Picks in ${categoryName}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="mx-auto max-w-7xl w-full min-w-0 px-4 pt-4 pb-1"
    >
      <div className="relative overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-b from-[#0E1525]/95 via-[#090E1A]/95 to-[#060911]/95 p-3.5 sm:p-5 shadow-[0_14px_45px_rgba(0,0,0,0.65)]">
        {/* Ambient golden & electric blue background glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-12 h-48 w-72 rounded-full bg-amber-500/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 right-12 h-48 w-72 rounded-full bg-blue-500/10 blur-3xl"
        />

        {/* Top Header Bar */}
        <div className="relative z-10 flex items-center justify-between gap-3 mb-3.5">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {/* Animated Floating Crown Emblem */}
            <motion.div
              animate={{
                y: [0, -3.5, 0],
                rotate: [-4, 4, -4],
                scale: [1, 1.06, 1],
              }}
              transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.55)] border border-amber-200/60"
            >
              <Crown className="h-5 w-5 fill-slate-950 stroke-[2.2]" />
              <motion.span
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.85, 1.2, 0.85] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-300 text-slate-950 shadow"
              >
                <Sparkles className="h-2.5 w-2.5 fill-slate-950" />
              </motion.span>
            </motion.div>

            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-sm sm:text-base font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                  <span>Best Picks</span>
                  <span className="text-amber-400">·</span>
                  <span className="bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    {categoryName}
                  </span>
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-amber-500/35 bg-amber-500/15 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-amber-300">
                  <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                  <span>Crowned Grails</span>
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate">
                Hand-picked top tier batches & community grails in {categoryName}
              </p>
            </div>
          </div>

          {/* Carousel Controls */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => handleScroll('left')}
              disabled={!canScrollLeft}
              aria-label="Scroll Best Picks left"
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all cursor-pointer ${
                canScrollLeft
                  ? 'border-amber-500/40 bg-[#0B101B] text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'border-white/10 bg-[#070A12]/60 text-slate-600 cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => handleScroll('right')}
              disabled={!canScrollRight}
              aria-label="Scroll Best Picks right"
              className={`flex h-8 w-8 items-center justify-center rounded-full border transition-all cursor-pointer ${
                canScrollRight
                  ? 'border-amber-500/40 bg-[#0B101B] text-amber-300 hover:bg-amber-500/20 hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.25)]'
                  : 'border-white/10 bg-[#070A12]/60 text-slate-600 cursor-not-allowed'
              }`}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scrollable Cards */}
        <div
          ref={scrollRef}
          className="relative z-10 flex items-stretch gap-3 sm:gap-3.5 overflow-x-auto pb-1.5 pt-1 scroll-smooth no-scrollbar"
        >
          {picks.map(({ item, rank, badge, crownTier, hypeStat }) => {
            const isTopThree = rank <= 3;
            const isFav = favorites.includes(item.id);
            const imgUrl = getProxiedImageUrl(item.image);
            const showImg = Boolean(imgUrl && !brokenImages[item.id]);
            const brandVisual = getBrandVisual(item.title, item.category);
            const rawProductUrl = item.buyLinks[0]?.url || item.rawUrl || '';
            const primaryBuyUrl = buildAgentUrl(
              rawProductUrl,
              selectedAgent,
              refCode
            );
            const displayPrice = formatConvertedPrice(
              item.priceNum,
              currency,
              item.price
            );

            return (
              <motion.div
                key={`best-pick-${item.id}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.22 }}
                className={`group relative w-[200px] sm:w-[224px] shrink-0 rounded-2xl p-2.5 flex flex-col justify-between transition-all ${
                  isTopThree
                    ? 'border border-amber-400/45 bg-gradient-to-b from-[#131B2E] via-[#0C1220] to-[#090D18] hover:border-amber-400/80 shadow-[0_6px_25px_rgba(245,158,11,0.16)]'
                    : 'border border-blue-500/30 bg-[#0B101B]/95 hover:border-blue-400/65 shadow-[0_6px_20px_rgba(0,0,0,0.4)]'
                }`}
              >
                {/* Top Section */}
                <div>
                  {/* Image Container with Floating Crown Badge */}
                  <div
                    className={`relative aspect-square w-full overflow-hidden rounded-xl border border-white/10 mb-2.5 ${
                      showImg
                        ? 'bg-[#060911]'
                        : `bg-gradient-to-br ${brandVisual.bgGradient}`
                    }`}
                  >
                    <a
                      href={primaryBuyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute inset-0 z-10 block"
                      aria-label={`Buy ${item.title} on ${activeAgentConfig.name}`}
                    >
                      {showImg ? (
                        <img
                          src={imgUrl}
                          alt={item.title}
                          loading="eager"
                          onError={() =>
                            setBrokenImages((prev) => ({
                              ...prev,
                              [item.id]: true,
                            }))
                          }
                          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full flex flex-col items-center justify-center p-3 text-center">
                          <span className="text-2xl font-black font-mono text-white">
                            {brandVisual.shortCode}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1">
                            {brandVisual.name}
                          </span>
                        </div>
                      )}
                    </a>

                    {/* Animated Crown Badge (Top Left) */}
                    <div className="absolute top-2 left-2 z-20 pointer-events-none">
                      <motion.div
                        animate={
                          isTopThree
                            ? { scale: [1, 1.05, 1] }
                            : undefined
                        }
                        transition={{
                          duration: 2.4,
                          repeat: Infinity,
                          ease: 'easeInOut',
                        }}
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-lg backdrop-blur-md border ${
                          crownTier === 'gold'
                            ? 'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-slate-950 border-amber-200'
                            : crownTier === 'purple'
                            ? 'bg-purple-950/90 text-purple-200 border-purple-400/50'
                            : 'bg-blue-950/90 text-[#38BDF8] border-sky-400/50'
                        }`}
                      >
                        <motion.span
                          animate={{ rotate: [-8, 8, -8], y: [0, -1.5, 0] }}
                          transition={{
                            duration: 2.2,
                            repeat: Infinity,
                            ease: 'easeInOut',
                          }}
                          className="inline-flex"
                        >
                          <Crown
                            className={`h-3 w-3 ${
                              crownTier === 'gold'
                                ? 'fill-slate-950 text-slate-950'
                                : crownTier === 'purple'
                                ? 'fill-purple-300 text-purple-300'
                                : 'fill-[#38BDF8] text-[#38BDF8]'
                            }`}
                          />
                        </motion.span>
                        <span>{badge}</span>
                      </motion.div>
                    </div>

                    {/* Favorite Button (Top Right) */}
                    <div className="absolute top-2 right-2 z-20">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(item.id);
                        }}
                        className="rounded-full bg-black/75 p-1.5 text-slate-300 hover:text-amber-400 hover:bg-black/95 transition-colors backdrop-blur-md cursor-pointer border border-white/10"
                        title="Save to favorites"
                        aria-label="Save to favorites"
                      >
                        <Heart
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'fill-amber-400 text-amber-400' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom Overlay Hype Pill */}
                    <div className="absolute bottom-2 inset-x-2 z-20 flex items-center justify-between pointer-events-none">
                      <span className="rounded-md bg-black/80 backdrop-blur-md px-1.5 py-0.5 text-[9px] font-bold text-amber-300 border border-amber-400/25">
                        {hypeStat}
                      </span>
                      {item.qcLink && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenQcModal(item);
                          }}
                          className="pointer-events-auto rounded-md bg-blue-600/90 hover:bg-blue-500 px-1.5 py-0.5 text-[9px] font-bold text-white flex items-center gap-0.5 cursor-pointer shadow"
                        >
                          <Camera className="w-2.5 h-2.5" />
                          <span>QC</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Seller + Price Row */}
                  <div className="flex items-center justify-between gap-1 text-[11px] mb-1">
                    <span className="text-amber-400/90 font-semibold truncate">
                      {item.seller}
                    </span>
                    <span className="font-mono font-extrabold text-[#38BDF8] text-xs tabular-nums shrink-0">
                      {displayPrice}
                    </span>
                  </div>

                  {/* Product Title */}
                  <a
                    href={primaryBuyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs font-bold text-white line-clamp-2 leading-snug group-hover:text-amber-300 transition-colors min-h-[2.1rem]"
                    title={item.title}
                  >
                    {item.title}
                  </a>
                </div>

                {/* Direct 1-Click Buy Button */}
                <div className="mt-2 pt-2 border-t border-white/10">
                  <a
                    href={primaryBuyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-extrabold transition-all cursor-pointer whitespace-nowrap ${
                      isTopThree
                        ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-400 text-slate-950 shadow-[0_0_16px_rgba(245,158,11,0.4)]'
                        : 'bg-[#2563EB] hover:bg-blue-500 text-white shadow-[0_0_14px_rgba(37,99,235,0.35)]'
                    }`}
                  >
                    {activeAgentConfig.logoUrl && (
                      <img
                        src={activeAgentConfig.logoUrl}
                        alt={activeAgentConfig.name}
                        className="h-3.5 w-3.5 rounded-full object-contain bg-black/15 shrink-0"
                      />
                    )}
                    <span className="truncate">
                      Cop on {activeAgentConfig.name}
                    </span>
                    <ExternalLink className="w-3 h-3 shrink-0 opacity-80" />
                  </a>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
