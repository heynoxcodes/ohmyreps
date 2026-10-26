import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Heart, 
  ChevronDown, 
  Menu,
  X,
  ShieldCheck,
  BookOpen,
  ShoppingBag,
  Gift,
  ArrowUpRight,
  Shirt,
  Footprints,
  Briefcase,
  CircleDot,
  Gem,
  Home,
  Headphones,
  Dumbbell,
  Glasses,
  LayoutGrid
} from 'lucide-react';
import { AgentId, AgentHealthStatus, CurrencyCode, SheetTab } from '../types/index.ts';
import { DEFAULT_AGENTS, CURRENCIES } from '../utils/agentConverter.ts';

interface HeaderProps {
  selectedAgent: AgentId;
  onSelectAgent: (agent: AgentId) => void;
  currency: CurrencyCode;
  onSelectCurrency: (currency: CurrencyCode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  itemCount: number;
  onOpenCompareModal: () => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  favoritesCount: number;
  tabs: SheetTab[];
  activeGid: string;
  onSelectTab: (gid: string) => void;
  tabCounts: Record<string, number>;
  isGuideActive: boolean;
  onToggleGuide: (active: boolean) => void;
  isSellersActive: boolean;
  onToggleSellers: (active: boolean) => void;
}

const TAB_ICON_MAP: Record<string, React.ReactNode> = {
  Shirt: <Shirt className="w-4 h-4" />,
  Footprints: <Footprints className="w-4 h-4" />,
  Briefcase: <Briefcase className="w-4 h-4" />,
  CircleDot: <CircleDot className="w-4 h-4" />,
  Gem: <Gem className="w-4 h-4" />,
  Home: <Home className="w-4 h-4" />,
  Headphones: <Headphones className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Glasses: <Glasses className="w-4 h-4" />,
};

export const AgentHealthBadge: React.FC<{
  status: AgentHealthStatus;
  compact?: boolean;
}> = ({ status, compact = false }) => {
  const styles: Record<
    AgentHealthStatus,
    { dot: string; text: string; bg: string; border: string }
  > = {
    Online: {
      dot: 'bg-emerald-400',
      text: 'text-emerald-300',
      bg: 'bg-emerald-500/12',
      border: 'border-emerald-500/30',
    },
    'High Traffic': {
      dot: 'bg-amber-400',
      text: 'text-amber-300',
      bg: 'bg-amber-500/12',
      border: 'border-amber-500/30',
    },
    Slow: {
      dot: 'bg-rose-400',
      text: 'text-rose-300',
      bg: 'bg-rose-500/12',
      border: 'border-rose-500/30',
    },
  };

  const current = styles[status] || styles.Online;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border ${current.bg} ${current.border} ${
        compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-1.5 py-0.5 text-[10px]'
      } font-mono font-semibold tracking-tight leading-none shrink-0`}
      title={`Agent Status: ${status}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${current.dot}`} />
      <span className={current.text}>{status}</span>
    </span>
  );
};

export const OhMyRepsLogo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const badgeClasses =
    size === 'lg'
      ? 'h-10 px-2.5 text-lg rounded-xl'
      : size === 'sm'
      ? 'h-7 px-2 text-xs rounded-lg'
      : 'h-8 px-2.5 text-sm rounded-lg';

  const wordmarkClasses =
    size === 'lg'
      ? 'text-3xl'
      : size === 'sm'
      ? 'text-lg'
      : 'text-xl sm:text-2xl';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="inline-flex items-center gap-2 select-none group cursor-pointer"
    >
      <div
        className={`relative inline-flex items-center justify-center bg-gradient-to-br from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] font-impact tracking-wider text-white shadow-[0_0_18px_rgba(37,99,235,0.45)] border border-blue-300/30 ${badgeClasses}`}
      >
        <span>OMR</span>
        <span className="ml-0.5 text-[#38BDF8]">!</span>
      </div>

      <div className="flex items-baseline leading-none">
        <span className={`font-impact tracking-wide uppercase text-white ${wordmarkClasses}`}>
          OHMY
        </span>
        <span className={`font-impact tracking-wide uppercase text-[#3B82F6] ${wordmarkClasses}`}>
          REPS!
        </span>
      </div>
    </motion.div>
  );
};

export const VexelLogo = OhMyRepsLogo;

export const Header: React.FC<HeaderProps> = ({
  selectedAgent,
  onSelectAgent,
  currency,
  onSelectCurrency,
  itemCount,
  onOpenCompareModal,
  showFavoritesOnly,
  onToggleFavorites,
  favoritesCount,
  tabs,
  activeGid,
  onSelectTab,
  tabCounts,
  isGuideActive,
  onToggleGuide,
  isSellersActive,
  onToggleSellers,
}) => {
  const [isBurgerOpen, setIsBurgerOpen] = useState(false);
  const [isAgentMenuOpen, setIsAgentMenuOpen] = useState(false);
  const [isCurrencyMenuOpen, setIsCurrencyMenuOpen] = useState(false);

  const currentAgent = DEFAULT_AGENTS.find(a => a.id === selectedAgent) || DEFAULT_AGENTS[0];
  const activeSafeAgents = DEFAULT_AGENTS.filter(a => a.id !== 'raw');

  const navigateToCatalog = () => {
    onToggleGuide(false);
    onToggleSellers(false);
    setIsBurgerOpen(false);
  };

  const navigateToSellers = () => {
    onToggleGuide(false);
    onToggleSellers(true);
    setIsBurgerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToGuide = () => {
    onToggleSellers(false);
    onToggleGuide(true);
    setIsBurgerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-blue-500/15 bg-[#05070B]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3">
          {/* Left: Burger Menu + Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsBurgerOpen(true)}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#0B101B] hover:border-blue-400/50 p-2 text-white transition-all cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4 text-[#38BDF8]" />
            </button>

            <button
              type="button"
              onClick={navigateToCatalog}
              className="focus:outline-none text-left"
            >
              <OhMyRepsLogo />
            </button>
          </div>

          {/* Right: Currency + Saved Agent Switcher & Favorites */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="relative flex items-center rounded-full border border-white/15 bg-[#0B101B] p-0.5">
              {/* Currency Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsCurrencyMenuOpen(!isCurrencyMenuOpen);
                    setIsAgentMenuOpen(false);
                  }}
                  className="flex items-center gap-1 rounded-l-full px-2.5 py-1.5 text-xs font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                  aria-label="Select currency"
                >
                  <span>{currency}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isCurrencyMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isCurrencyMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsCurrencyMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.16 }}
                        className="absolute right-0 sm:left-0 mt-2 w-36 rounded-2xl border border-blue-500/30 bg-[#0B101B] p-1.5 shadow-2xl z-40"
                      >
                        {CURRENCIES.map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => {
                              onSelectCurrency(c.code);
                              setIsCurrencyMenuOpen(false);
                            }}
                            className={`w-full flex items-center justify-between rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                              currency === c.code
                                ? 'bg-[#2563EB] text-white'
                                : 'text-slate-300 hover:bg-white/5 hover:text-white'
                            }`}
                          >
                            <span>{c.code}</span>
                            <span className="font-mono text-slate-400">{c.symbol}</span>
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              <div className="h-4 w-[1px] bg-white/10" />

              {/* Saved Agent Dropdown Trigger */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsAgentMenuOpen(!isAgentMenuOpen);
                    setIsCurrencyMenuOpen(false);
                  }}
                  className="flex items-center gap-1.5 rounded-r-full px-2.5 py-1.5 text-xs font-bold text-white hover:bg-white/5 transition-colors cursor-pointer"
                  aria-label="Select and save agent"
                >
                  {currentAgent.logoUrl && (
                    <img
                      src={currentAgent.logoUrl}
                      alt={currentAgent.name}
                      className="h-4 w-4 rounded-full object-contain bg-white/10 shrink-0"
                    />
                  )}
                  <span className="truncate max-w-[80px]">{currentAgent.name}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isAgentMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isAgentMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setIsAgentMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.96 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 mt-2 w-64 rounded-2xl border border-blue-500/35 bg-[#0A0F1A] p-2 shadow-2xl z-40"
                      >
                        <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-white/10 mb-1">
                          Select Default Agent
                        </div>

                        <div className="max-h-72 overflow-y-auto space-y-0.5 pr-0.5">
                          {activeSafeAgents.map((agent) => {
                            const isSelected = agent.id === selectedAgent;
                            return (
                              <button
                                key={agent.id}
                                type="button"
                                onClick={() => {
                                  onSelectAgent(agent.id);
                                  setIsAgentMenuOpen(false);
                                }}
                                className={`w-full flex items-center justify-between rounded-xl px-2.5 py-2 text-left text-xs transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-blue-600/20 border border-blue-500/40 text-white font-semibold'
                                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <img
                                    src={agent.logoUrl}
                                    alt={agent.name}
                                    className="h-5 w-5 rounded-full object-contain bg-white/10 p-0.5 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-bold truncate">{agent.name}</div>
                                    <div className="text-[10px] text-slate-400 truncate">
                                      {agent.couponHeadline}
                                    </div>
                                  </div>
                                </div>
                                {isSelected && (
                                  <span className="text-blue-400 text-xs font-bold shrink-0">✓</span>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Favorites Button */}
            <button
              onClick={onToggleFavorites}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                showFavoritesOnly
                  ? 'border-blue-500 bg-blue-600/20 text-blue-300'
                  : 'border-white/15 bg-[#0B101B] text-slate-300 hover:text-white'
              }`}
              aria-label="View Favorites"
            >
              <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-blue-400 text-blue-400' : ''}`} />
              <span className="font-mono tabular-nums">{favoritesCount}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Slide-Out Burger Menu Drawer */}
      <AnimatePresence>
        {isBurgerOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsBurgerOpen(false)}
              className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 34 }}
              className="fixed inset-y-0 left-0 z-50 w-72 max-w-[85vw] bg-[#070B14] border-r border-blue-500/25 flex flex-col justify-between overflow-y-auto shadow-2xl"
            >
              <div className="p-4 space-y-5">
                {/* Drawer Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <OhMyRepsLogo size="sm" />
                  <button
                    type="button"
                    onClick={() => setIsBurgerOpen(false)}
                    className="rounded-full border border-white/10 bg-white/5 hover:bg-white/10 p-1.5 text-slate-300 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close menu"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Main Pages */}
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={navigateToCatalog}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      !isSellersActive && !isGuideActive && !showFavoritesOnly
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <ShoppingBag className="w-4 h-4" />
                      <span>Catalog</span>
                    </span>
                    <span className="font-mono text-[10px] opacity-80">{itemCount}</span>
                  </button>

                  <button
                    type="button"
                    onClick={navigateToSellers}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      isSellersActive
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-[#38BDF8]" />
                      <span>Sellers</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={navigateToGuide}
                    className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                      isGuideActive
                        ? 'bg-[#2563EB] text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-blue-400" />
                      <span>How to Order</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsBurgerOpen(false);
                      onOpenCompareModal();
                    }}
                    className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/5 hover:text-white transition-all cursor-pointer"
                  >
                    <span className="flex items-center gap-2.5">
                      <Gift className="w-4 h-4 text-[#38BDF8]" />
                      <span>Agents & Coupons</span>
                    </span>
                  </button>
                </div>

                {/* Categories List */}
                <div className="space-y-1.5 pt-3 border-t border-white/10">
                  <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500">
                    Categories
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {tabs.map((tab) => {
                      const isTabActive = !isSellersActive && !isGuideActive && tab.gid === activeGid;
                      const icon = TAB_ICON_MAP[tab.iconName] || <LayoutGrid className="w-3.5 h-3.5" />;
                      const count = tabCounts[tab.gid];
                      return (
                        <button
                          key={tab.gid}
                          type="button"
                          onClick={() => {
                            onToggleGuide(false);
                            onToggleSellers(false);
                            onSelectTab(tab.gid);
                            setIsBurgerOpen(false);
                          }}
                          className={`flex items-center justify-between rounded-xl px-2.5 py-2 text-left text-[11px] font-bold transition-colors cursor-pointer ${
                            isTabActive
                              ? 'bg-blue-600/25 border border-blue-500/50 text-white'
                              : 'bg-[#0B101B] border border-white/5 text-slate-300 hover:text-white'
                          }`}
                        >
                          <span className="flex items-center gap-1.5 truncate">
                            <span className="text-blue-400 shrink-0">{icon}</span>
                            <span className="truncate">{tab.name}</span>
                          </span>
                          {typeof count === 'number' && (
                            <span className="font-mono text-[9px] text-slate-500 ml-1">
                              {count}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Drawer Footer */}
              {currentAgent.signupUrl && (
                <div className="p-4 border-t border-white/10 bg-[#05070B]">
                  <a
                    href={currentAgent.signupUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-500 py-2.5 text-xs font-extrabold text-white transition-colors"
                  >
                    <span>Claim {currentAgent.name} Coupons</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
