import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { AgentId } from '../types/index.ts';

const FUNNY_SLOGANS = [
  "1:1 DRIP. 0:1 FINANCIAL REGRET. TELL 'EM IT'S FROM GRAILED.",
  "WHY PAY $1,200 RETAIL WHEN THE SAME FACTORY CHARGES $24?",
  "YOUR BANK ACCOUNT'S FAVORITE STREETWEAR CATALOG.",
  "WEAR WITH CONFIDENCE. NOBODY IS CALLING YOU OUT AT TARGET.",
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
  isGuideActive,
  isSellersActive,
  searchQuery,
  onSearchChange,
}) => {
  const [sloganIndex, setSloganIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % FUNNY_SLOGANS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  if (isSellersActive || isGuideActive) {
    return null;
  }

  return (
    <section id="top" className="relative overflow-hidden pt-6 pb-4 px-4">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-44 opacity-25 blur-3xl"
        style={{
          background:
            'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.5), rgba(5, 7, 11, 0) 75%)',
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl text-center space-y-3">
        <p className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8]">
          {FUNNY_SLOGANS[sloganIndex]}
        </p>

        <h1 className="font-impact text-4xl sm:text-6xl tracking-wide leading-none uppercase select-none">
          <span className="text-white">OHMY</span>
          <span className="text-[#3B82F6] rephub-blue-glow">REPS!</span>
        </h1>

        {/* Single Clean Search Bar */}
        <div className="relative max-w-xl mx-auto pt-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search items, brands, or sellers..."
            className="w-full rounded-full border border-blue-500/30 bg-[#0B101B] py-3 pl-11 pr-10 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none transition-all shadow-lg"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white cursor-pointer"
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>
    </section>
  );
};
