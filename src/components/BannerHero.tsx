import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  BookOpen,
  Gift,
  Check,
  Search,
  Layers
} from 'lucide-react';
import { AgentId } from '../types/index.ts';
import { DEFAULT_AGENTS } from '../utils/agentConverter.ts';

const FUNNY_SLOGANS = [
  "1:1 DRIP. 0:1 FINANCIAL REGRET. TELL 'EM IT'S FROM GRAILED.",
  "WHY PAY $1,200 RETAIL WHEN THE SAME FACTORY CHARGES $24?",
  "YOUR BANK ACCOUNT'S FAVORITE STREETWEAR SPREADSHEET.",
  "WEAR WITH CONFIDENCE. NOBODY IS CALLING YOU OUT AT TARGET.",
  "CERTIFIED DRIP CURATION. ZERO MIDDLEMAN TAX.",
];

const QUICK_BRAND_TAGS = [
  'Chrome Hearts',
  'Balenciaga',
  'Corteiz',
  'Canada Goose',
  'Louis Vuitton',
  'Rick Owens',
  'Maison Margiela',
  'Acne Studios',
  'Dior',
  'Stussy',
];

interface BannerHeroProps {
  selectedAgent: AgentId;
  onSelectAgent: (agent: AgentId) => void;
  onOpenGuideTab: () => void;
  onOpenSellersTab: () => void;
  onOpenCouponModal: () => void;
  isGuideActive: boolean;
  isSellersActive: boolean;
  totalIndexedItems: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const BannerHero: React.FC<BannerHeroProps> = ({
  selectedAgent,
  onSelectAgent,
  onOpenGuideTab,
  onOpenSellersTab,
  onOpenCouponModal,
  isGuideActive,
  isSellersActive,
  totalIndexedItems,
  searchQuery,
  onSearchChange,
}) => {
  const [sloganIndex, setSloganIndex] = useState(0);
  const currentAgent = DEFAULT_AGENTS.find(a => a.id === selectedAgent) || DEFAULT_AGENTS[0];
  const featuredAgents = DEFAULT_AGENTS.filter(a => a.id !== 'raw').slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % FUNNY_SLOGANS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  // When on subpages (Trusted Yupoo Sellers or Guide), render a sleek minimal bar so the subpage content shines
  if (isSellersActive || isGuideActive) {
    return null;
  }

  return (
    <section id="top" className="relative overflow-hidden pt-4 sm:pt-7 pb-4 px-4">
      {/* Ambient Radial Lighting */}
      <div
        className="pointer-events-none absolute inset-x-0 -top-10 h-80 opacity-30 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 30% 10%, rgba(37, 99, 235, 0.55), rgba(56, 189, 248, 0.18) 45%, rgba(5, 7, 11, 0) 75%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-7xl">
        {/* Main Hero Split Container */}
        <div className="rounded-3xl border border-blue-500/25 bg-gradient-to-br from-[#0B1222]/95 via-[#080D18]/95 to-[#05070B]/95 p-5 sm:p-7 lg:p-9 shadow-[0_24px_70px_rgba(0,0,0,0.65)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Left Column (7 cols): Brand Identity, Funny Slogan, Search & Primary Actions */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                {/* Rotating Funny Slogan Kicker */}
                <div className="min-h-[1.5rem] flex items-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={sloganIndex}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[#38BDF8]"
                    >
                      <Sparkles className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                      <span>{FUNNY_SLOGANS[sloganIndex]}</span>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Iconic OHMYREPS! Headline */}
                <div className="space-y-2">
                  <h1 className="font-impact text-4xl sm:text-6xl lg:text-7xl tracking-wide leading-[0.95] uppercase select-none">
                    <span className="text-white">OHMY</span>
                    <span className="text-[#3B82F6] rephub-blue-glow">REPS!</span>
                    <span className="block sm:inline sm:ml-3 text-xl sm:text-3xl lg:text-4xl text-slate-300 font-impact tracking-normal">
                      THE ARCHIVE & DRIP VAULT
                    </span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                    Browse <span className="text-white font-bold">1,100+ QC-verified spreadsheet finds</span> and{' '}
                    <span className="text-white font-bold">54 trusted brand Yupoo sellers</span>. Pick your favorite shipping agent once—every{' '}
                    <span className="text-[#38BDF8] font-semibold">Buy</span> button automatically opens the item inside your saved agent with your signup coupon bundle attached.
                  </p>
                </div>
              </div>

              {/* Hero Search Bar (Works seamlessly on both Mobile & PC) */}
              <div className="space-y-3 pt-1">
                <div className="relative flex items-center">
                  <Search className="absolute left-4 w-4 h-4 text-blue-400 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search 1,100+ items by brand, piece, or seller (e.g. Jordan 4, Balenciaga, TopGoosey)..."
                    className="w-full rounded-2xl border border-blue-500/35 bg-[#05070B]/95 py-3 pl-11 pr-24 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:bg-[#080C16] focus:outline-none transition-all shadow-inner"
                  />
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="absolute right-3 rounded-xl bg-white/10 hover:bg-white/15 px-2.5 py-1 text-xs font-bold text-slate-200 cursor-pointer"
                    >
                      Clear
                    </button>
                  ) : (
                    <span className="hidden sm:inline-block absolute right-3.5 font-mono text-[10px] text-slate-500 uppercase">
                      Instant Filter
                    </span>
                  )}
                </div>

                {/* Popular Brand Quick-Filter Chips */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <span className="text-[11px] font-mono text-slate-500 shrink-0 mr-1">
                    Popular:
                  </span>
                  {QUICK_BRAND_TAGS.map((tag) => {
                    const isActive = searchQuery.toLowerCase() === tag.toLowerCase();
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => onSearchChange(isActive ? '' : tag)}
                        className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                          isActive
                            ? 'bg-[#2563EB] text-white'
                            : 'bg-white/[0.04] hover:bg-white/[0.09] text-slate-300 hover:text-white border border-white/5'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Primary Navigation CTA Buttons */}
              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <a
                  href="#catalog-section"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2563EB] hover:bg-blue-500 px-5 py-3 text-xs sm:text-sm font-extrabold text-white transition-all shadow-[0_0_24px_rgba(37,99,235,0.45)] cursor-pointer"
                >
                  <Layers className="w-4 h-4" />
                  <span>Browse Spreadsheet ({totalIndexedItems || '1,100+'})</span>
                </a>

                <button
                  type="button"
                  onClick={onOpenSellersTab}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-blue-400/45 bg-blue-500/15 hover:bg-blue-500/25 px-4 sm:px-5 py-3 text-xs sm:text-sm font-extrabold text-[#38BDF8] hover:text-white transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Trusted Brand Yupoos (54)</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenGuideTab}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/[0.04] hover:bg-white/[0.08] px-4 py-3 text-xs sm:text-sm font-bold text-slate-200 hover:text-white transition-all cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  <span>How to Order Guide</span>
                </button>
              </div>
            </div>

            {/* Right Column (5 cols): Interactive "Your Saved Agent & Coupon Command Center" */}
            <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-blue-500/30 bg-[#05070B]/90 p-4 sm:p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-[#38BDF8] block">
                      1-Click Agent Auto-Router
                    </span>
                    <h2 className="text-sm sm:text-base font-extrabold text-white">
                      Your Saved Shipping Agent
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={onOpenCouponModal}
                    className="inline-flex items-center gap-1 rounded-xl border border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1.5 text-[11px] font-bold text-[#38BDF8] transition-colors cursor-pointer"
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>All 12 Agents</span>
                  </button>
                </div>

                {/* Currently Selected Agent Highlight Box */}
                <div className="flex items-center justify-between gap-3 rounded-xl border border-blue-500/35 bg-gradient-to-r from-blue-600/20 via-blue-900/15 to-transparent p-3">
                  <div className="flex items-center gap-3 min-w-0">
                    {currentAgent.logoUrl && (
                      <img
                        src={currentAgent.logoUrl}
                        alt={currentAgent.name}
                        className="h-10 w-10 rounded-xl object-contain bg-white/10 p-1 shrink-0 border border-white/10"
                      />
                    )}
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm sm:text-base font-extrabold text-white truncate">
                          {currentAgent.name}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-400 font-bold">
                          · Saved ✓
                        </span>
                      </div>
                      <div className="text-xs font-mono text-[#38BDF8] truncate">
                        {currentAgent.couponHeadline}
                      </div>
                    </div>
                  </div>

                  {currentAgent.signupUrl && (
                    <a
                      href={currentAgent.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-xl bg-[#2563EB] hover:bg-blue-500 px-3 py-2 text-xs font-extrabold text-white transition-all shrink-0 shadow-[0_0_16px_rgba(37,99,235,0.4)]"
                    >
                      <span>Sign Up</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                {/* Quick 1-Tap Agent Switcher Grid */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>Tap to switch your saved agent:</span>
                    <span className="font-mono text-[10px] text-slate-500">Auto-saves</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {featuredAgents.map((agent) => {
                      const isSelected = agent.id === selectedAgent;
                      return (
                        <button
                          key={agent.id}
                          type="button"
                          onClick={() => onSelectAgent(agent.id)}
                          className={`flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-left text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#2563EB] text-white shadow-[0_0_14px_rgba(37,99,235,0.4)]'
                              : 'bg-[#0B101B] hover:bg-white/5 text-slate-300 border border-white/10'
                          }`}
                        >
                          <img
                            src={agent.logoUrl}
                            alt={agent.name}
                            className="h-4 w-4 rounded-full object-contain bg-white/10 shrink-0"
                          />
                          <span className="truncate flex-1">{agent.name}</span>
                          {isSelected && <Check className="w-3 h-3 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Bottom Explanation Note */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[11px] text-slate-400">
                <span>All product links auto-convert to <strong className="text-white">{currentAgent.name}</strong></span>
                <button
                  type="button"
                  onClick={onOpenCouponModal}
                  className="text-[#38BDF8] hover:underline font-bold shrink-0 cursor-pointer"
                >
                  View all 12 →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
