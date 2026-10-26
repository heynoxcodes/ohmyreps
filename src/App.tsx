import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Header,
  OhMyRepsLogo
} from './components/Header.tsx';
import { 
  BannerHero 
} from './components/BannerHero.tsx';
import { 
  CategoryNav 
} from './components/CategoryNav.tsx';
import { 
  FilterBar, 
  SortOption 
} from './components/FilterBar.tsx';
import { 
  ProductCard 
} from './components/ProductCard.tsx';
import { 
  GuideView 
} from './components/GuideView.tsx';
import {
  SellersView
} from './components/SellersView.tsx';
import { 
  QcModal 
} from './components/QcModal.tsx';
import { 
  AgentCompareModal 
} from './components/AgentCompareModal.tsx';
import {
  LoadingScreen
} from './components/LoadingScreen.tsx';
import {
  BestPicksCarousel
} from './components/BestPicksCarousel.tsx';
import {
  getOmrFeaturedOrder,
  getBestPicksForCategory
} from './utils/featuredOrder.ts';
import { 
  ProductItem, 
  AgentId, 
  CurrencyCode,
  SheetTab
} from './types/index.ts';
import { 
  SHEET_TABS, 
  DEFAULT_SHEET_ID 
} from './utils/sheetParser.ts';
import { 
  DEFAULT_AGENTS, 
  LOCKED_REFERRAL_CODES,
  isValidActiveAgent,
  buildAgentUrl,
  getProxiedImageUrl,
  formatConvertedPrice
} from './utils/agentConverter.ts';
import {
  getBrandVisual
} from './utils/brandVisuals.ts';
import { 
  Loader2, 
  ExternalLink, 
  Camera, 
  ShoppingBag, 
  Heart, 
  RefreshCw, 
  AlertCircle,
  ShieldCheck,
  BookOpen,
  Gift
} from 'lucide-react';

const STORAGE_KEYS = {
  AGENT: 'repfinds_selected_agent_v2',
  CURRENCY: 'ohmyreps_currency',
  FAVORITES: 'repfinds_favorites',
};

export default function App() {
  const initialUrlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  // --- Persistent Saved Agent & Currency Preferences ---
  const [selectedAgent, setSelectedAgent] = useState<AgentId>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AGENT);
    if (isValidActiveAgent(saved)) {
      return saved;
    }
    return 'cnshopper';
  });

  const [currency, setCurrency] = useState<CurrencyCode>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENCY) as CurrencyCode;
    return saved || 'USD';
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    return saved ? JSON.parse(saved) : [];
  });

  // --- Catalog Data & Tabs State ---
  const [tabs] = useState<SheetTab[]>(SHEET_TABS);
  const [activeGid, setActiveGid] = useState<string>('171908810'); // Default: Clothes
  const [isGuideActive, setIsGuideActive] = useState<boolean>(() => initialUrlParams.get('view') === 'guide');
  const [isSellersActive, setIsSellersActive] = useState<boolean>(() => initialUrlParams.get('view') === 'sellers');
  const [initialBrandQuery] = useState<string>(() => initialUrlParams.get('brand') || '');
  const [tabItems, setTabItems] = useState<Record<string, ProductItem[]>>({});
  const [tabCounts, setTabCounts] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // --- Filter & Search State ---
  const [searchQuery, setSearchQuery] = useState<string>(() => initialUrlParams.get('find') || '');
  const [selectedSeller, setSelectedSeller] = useState<string>('');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('default');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(60);

  // --- Initial Loading Screen (waits for catalog + initial images unless skipped) ---
  const [isLoadingScreenSkipped, setIsLoadingScreenSkipped] = useState<boolean>(false);
  const [loadedImageIds, setLoadedImageIds] = useState<Record<string, boolean>>({});

  // --- Modals State (Open Welcome & Agent Coupon Popup automatically on arrival!) ---
  const [isCompareModalOpen, setIsCompareModalOpen] = useState<boolean>(() => {
    const saved = localStorage.getItem('ohmyreps_show_coupon_on_arrival');
    return saved === null ? true : saved === 'true';
  });
  const [activeQcProduct, setActiveQcProduct] = useState<ProductItem | null>(null);

  const handleProductImageLoaded = useCallback((id: string) => {
    setLoadedImageIds(prev => (prev[id] ? prev : { ...prev, [id]: true }));
  }, []);

  // Clean up any legacy mutable referral or custom sheet keys from localStorage on mount
  useEffect(() => {
    localStorage.removeItem('repfinds_referral_codes');
    localStorage.removeItem('repfinds_selected_agent');
    localStorage.removeItem('repfinds_sheet_id');
  }, []);

  // Save preferred agent automatically to localStorage whenever changed
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AGENT, selectedAgent);
  }, [selectedAgent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENCY, currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  }, [favorites]);

  // Fetch catalog items for active tab (with automatic static snapshot fallback)
  const fetchItemsForTab = useCallback(async (gid: string, force = false) => {
    if (!force && tabItems[gid] && tabItems[gid].length > 0) {
      return;
    }

    if (!force) {
      setIsLoading(true);
    }
    setErrorMsg('');

    const loadStaticSnapshot = async (): Promise<boolean> => {
      try {
        const snapRes = await fetch('/sheet-snapshot.json');
        if (!snapRes.ok) return false;
        const snap = await snapRes.json();
        if (snap && snap.tabs) {
          const allTabs = snap.tabs as Record<string, ProductItem[]>;
          setTabItems(prev => ({ ...allTabs, ...prev, ...(allTabs[gid] ? { [gid]: allTabs[gid] } : {}) }));
          const counts: Record<string, number> = {};
          for (const [k, arr] of Object.entries(allTabs)) {
            if (Array.isArray(arr)) counts[k] = arr.length;
          }
          setTabCounts(prev => ({ ...counts, ...prev }));
          return true;
        }
      } catch {
        // ignore fallback error
      }
      return false;
    };

    try {
      const res = await fetch(`/api/sheet-data?gid=${gid}&sheetId=${DEFAULT_SHEET_ID}${force ? '&force=true' : ''}`);
      const contentType = res.headers.get('content-type') || '';

      if (res.ok && contentType.includes('application/json')) {
        const data = await res.json();
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setTabItems(prev => ({ ...prev, [gid]: data.items }));
          setTabCounts(prev => ({ ...prev, [gid]: data.items.length }));
          return;
        }
      }

      // Fallback to bundled /sheet-snapshot.json if live API is unreachable or returns HTML
      const fallbackOk = await loadStaticSnapshot();
      if (!fallbackOk) {
        setErrorMsg('Failed to load catalog items');
      }
    } catch (err: unknown) {
      const fallbackOk = await loadStaticSnapshot();
      if (!fallbackOk) {
        const msg = err instanceof Error ? err.message : 'Network error loading catalog';
        setErrorMsg(msg);
      }
    } finally {
      setIsLoading(false);
    }
  }, [tabItems]);

  useEffect(() => {
    fetchItemsForTab(activeGid);
    setVisibleCount(60);
  }, [activeGid, fetchItemsForTab]);

  // Automatically load more items as the user scrolls near the bottom
  useEffect(() => {
    const onScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 900) {
        setVisibleCount((prev) => prev + 40);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSyncNow = () => {
    fetchItemsForTab(activeGid, true);
  };

  // Switch category
  const handleSelectTab = (gid: string) => {
    setActiveGid(gid);
    setSelectedSeller('');
  };

  // Current items for this category in custom OHMYREPS! Featured order
  const rawCategoryItems = useMemo(() => {
    return tabItems[activeGid] || [];
  }, [tabItems, activeGid]);

  const currentItems = useMemo(() => {
    return getOmrFeaturedOrder(rawCategoryItems, activeGid);
  }, [rawCategoryItems, activeGid]);

  const bestPicks = useMemo(() => {
    return getBestPicksForCategory(rawCategoryItems, activeGid);
  }, [rawCategoryItems, activeGid]);

  // Unique sellers list
  const sellers = useMemo(() => {
    const set = new Set<string>();
    currentItems.forEach(item => {
      if (item.seller && item.seller !== 'Direct Batch') {
        set.add(item.seller);
      }
    });
    return Array.from(set).sort();
  }, [currentItems]);

  // Filtered and sorted items
  const filteredItems = useMemo(() => {
    let result = [...currentItems];

    // Favorites filter
    if (showFavoritesOnly) {
      const favSet = new Set(favorites);
      result = result.filter(item => favSet.has(item.id));
    }

    // Search query filter (matches title, seller, category, notes)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(item => 
        item.title.toLowerCase().includes(q) ||
        item.seller.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.notes && item.notes.toLowerCase().includes(q))
      );
    }

    // Seller filter
    if (selectedSeller) {
      result = result.filter(item => item.seller === selectedSeller);
    }

    // Price range filter
    const minVal = parseFloat(priceMin);
    const maxVal = parseFloat(priceMax);
    if (!isNaN(minVal)) {
      result = result.filter(item => item.priceNum >= minVal);
    }
    if (!isNaN(maxVal)) {
      result = result.filter(item => item.priceNum <= maxVal);
    }

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.priceNum - b.priceNum);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.priceNum - a.priceNum);
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [currentItems, showFavoritesOnly, favorites, searchQuery, selectedSeller, priceMin, priceMax, sortBy]);

  // Favorites toggle
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // Reset filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSeller('');
    setPriceMin('');
    setPriceMax('');
    setSortBy('default');
    setShowFavoritesOnly(false);
  };

  const hasActiveFilters = Boolean(
    searchQuery || selectedSeller || priceMin || priceMax || sortBy !== 'default' || showFavoritesOnly
  );

  const activeCategory = tabs.find(t => t.gid === activeGid)?.name || 'Category';
  const currentAgentConfig = DEFAULT_AGENTS.find(a => a.id === selectedAgent) || DEFAULT_AGENTS[0];

  // Track the first 15 product images in the current view; loading screen stays until they load or user clicks Skip
  const trackedImageItems = useMemo(() => {
    return currentItems.filter(item => Boolean(item.image)).slice(0, 15);
  }, [currentItems]);

  const targetImagesCount = trackedImageItems.length;
  const loadedImagesCount = useMemo(() => {
    return trackedImageItems.reduce((acc, item) => acc + (loadedImageIds[item.id] ? 1 : 0), 0);
  }, [trackedImageItems, loadedImageIds]);

  const areInitialImagesReady = !isLoading && targetImagesCount > 0 && loadedImagesCount >= targetImagesCount;
  const showLoadingScreen = !isGuideActive && !isSellersActive && !isLoadingScreenSkipped && !areInitialImagesReady;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-clip bg-[#05070B] text-zinc-100 flex flex-col font-sans">
      <LoadingScreen
        isOpen={showLoadingScreen}
        isFetchingSheet={isLoading}
        loadedImagesCount={loadedImagesCount}
        targetImagesCount={targetImagesCount}
        categoryName={activeCategory}
        onSkip={() => setIsLoadingScreenSkipped(true)}
      />
      {/* 1. Header with Burger Menu, OMR Logo, Currency & Saved Agent Selector */}
      <Header
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        currency={currency}
        onSelectCurrency={setCurrency}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q && (isGuideActive || isSellersActive)) {
            setIsGuideActive(false);
            setIsSellersActive(false);
          }
        }}
        itemCount={currentItems.length}
        onOpenCompareModal={() => setIsCompareModalOpen(true)}
        showFavoritesOnly={showFavoritesOnly}
        onToggleFavorites={() => {
          setIsGuideActive(false);
          setIsSellersActive(false);
          setShowFavoritesOnly(!showFavoritesOnly);
        }}
        favoritesCount={favorites.length}
        tabs={tabs}
        activeGid={activeGid}
        onSelectTab={handleSelectTab}
        tabCounts={tabCounts}
        isGuideActive={isGuideActive}
        onToggleGuide={setIsGuideActive}
        isSellersActive={isSellersActive}
        onToggleSellers={setIsSellersActive}
      />

      {/* 2. Punchy OHMYREPS! Hero with Funny Slogans & 1-Click Saved Agent Bar */}
      <BannerHero
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
        onOpenGuideTab={() => {
          setIsSellersActive(false);
          setIsGuideActive(!isGuideActive);
        }}
        onOpenSellersTab={() => {
          setIsGuideActive(false);
          setIsSellersActive(!isSellersActive);
        }}
        onOpenCouponModal={() => setIsCompareModalOpen(true)}
        isGuideActive={isGuideActive}
        isSellersActive={isSellersActive}
        totalIndexedItems={currentItems.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* 3. Category Tabs Bar (with Dedicated Trusted Yupoo Sellers & How to Order Tabs) */}
      <CategoryNav
        tabs={tabs}
        activeGid={activeGid}
        onSelectTab={handleSelectTab}
        tabCounts={tabCounts}
        isLoading={isLoading}
        isGuideActive={isGuideActive}
        onToggleGuide={setIsGuideActive}
        isSellersActive={isSellersActive}
        onToggleSellers={setIsSellersActive}
      />

      {/* 4. Conditional View: Trusted Yupoo Sellers vs. Guide Tab vs. Live Spreadsheet Catalog */}
      {isSellersActive ? (
        <SellersView
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          initialBrandFilter={initialBrandQuery}
          onBackToCatalog={() => setIsSellersActive(false)}
        />
      ) : isGuideActive ? (
        <GuideView
          selectedAgent={selectedAgent}
          onSelectAgent={setSelectedAgent}
          onBackToCatalog={() => setIsGuideActive(false)}
        />
      ) : (
        <>
          {!isLoading && !showFavoritesOnly && !searchQuery.trim() && (
            <BestPicksCarousel
              picks={bestPicks}
              categoryName={activeCategory}
              selectedAgent={selectedAgent}
              currency={currency}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              onOpenQcModal={setActiveQcProduct}
            />
          )}

          <FilterBar
            totalCount={currentItems.length}
            filteredCount={filteredItems.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            sellers={sellers}
            selectedSeller={selectedSeller}
            onSelectSeller={setSelectedSeller}
            priceMin={priceMin}
            onPriceMinChange={setPriceMin}
            priceMax={priceMax}
            onPriceMaxChange={setPriceMax}
            sortBy={sortBy}
            onSortByChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onResetFilters={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />

          <main className="mx-auto max-w-7xl flex-1 w-full min-w-0 px-4 py-4">
            {/* Error message with retry */}
            {errorMsg && (
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
                <button
                  onClick={handleSyncNow}
                  className="flex items-center gap-1 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold hover:bg-rose-500/30 text-white cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Fetch</span>
                </button>
              </div>
            )}

            {/* Loading Skeleton */}
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                <div className="text-sm font-bold text-slate-200">
                  Loading {activeCategory} directory...
                </div>
                <p className="text-xs text-slate-500">
                  Routing links through active agent: <span className="font-mono text-blue-400">{currentAgentConfig.name}</span>
                </p>
              </div>
            ) : filteredItems.length === 0 ? (
              /* Clean Empty State */
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-3xl border border-blue-500/20 bg-[#0B101B]/60 p-8">
                <div className="p-4 rounded-full bg-[#05070B] text-slate-600 mb-3 border border-white/5">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-sm font-bold text-white">
                  No matching items found
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1 mb-4">
                  {showFavoritesOnly
                    ? "You haven't bookmarked any items yet. Click the heart icon on any card to save it to your favorites."
                    : "No catalog items matched your current search or filter criteria."}
                </p>
                {hasActiveFilters && (
                  <button
                    onClick={handleResetFilters}
                    className="rounded-full bg-[#2563EB] hover:bg-blue-500 px-5 py-2 text-xs font-extrabold text-white transition-colors cursor-pointer"
                  >
                    Reset All Filters
                  </button>
                )}
              </div>
            ) : viewMode === 'grid' ? (
              /* Grid View with Progressive Infinite Scroll */
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                  {filteredItems.slice(0, visibleCount).map((product, idx) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      selectedAgent={selectedAgent}
                      onSelectAgent={setSelectedAgent}
                      currency={currency}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onOpenQcModal={setActiveQcProduct}
                      eagerLoad={idx < 15}
                      onImageLoaded={handleProductImageLoaded}
                    />
                  ))}
                </div>

                {visibleCount < filteredItems.length && (
                  <div className="flex flex-col items-center justify-center py-6 gap-2">
                    <button
                      type="button"
                      onClick={() => setVisibleCount((prev) => prev + 80)}
                      className="rounded-full bg-[#2563EB] hover:bg-blue-500 px-6 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer"
                    >
                      Load More ({filteredItems.length - visibleCount} remaining)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Compact Table View with Real Spreadsheet Images & Direct 1-Click Referral Links */
              <div className="overflow-x-auto rounded-2xl border border-blue-500/20 bg-[#0B101B]/85">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead>
                    <tr className="border-b border-white/10 bg-[#070B14] text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-3.5">Item</th>
                      <th className="py-3 px-3.5">Seller</th>
                      <th className="py-3 px-3.5">Price</th>
                      <th className="py-3 px-3.5">Notes</th>
                      <th className="py-3 px-3.5">QC</th>
                      <th className="py-3 px-3.5 text-right">Direct Buy</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredItems.map((product) => {
                      const isFav = favorites.includes(product.id);
                      const brand = getBrandVisual(product.title, product.category);
                      const imgUrl = getProxiedImageUrl(product.image);
                      const directBuyUrl = buildAgentUrl(
                        product.buyLinks[0]?.url || product.rawUrl || '',
                        selectedAgent,
                        LOCKED_REFERRAL_CODES[selectedAgent]
                      );

                      return (
                        <tr key={product.id} className="hover:bg-white/[0.03] transition-colors">
                          <td className="py-2.5 px-3.5">
                            <div className="flex items-center gap-3">
                              {imgUrl ? (
                                <img
                                  src={imgUrl}
                                  alt={product.title}
                                  loading="lazy"
                                  className="w-11 h-11 shrink-0 rounded-lg object-cover border border-white/10 bg-[#05070B]"
                                />
                              ) : (
                                <div className={`w-11 h-11 shrink-0 rounded-lg border border-white/10 flex items-center justify-center bg-gradient-to-br ${brand.bgGradient}`}>
                                  <span className="text-[10px] font-extrabold font-mono text-white">
                                    {brand.shortCode}
                                  </span>
                                </div>
                              )}
                              <div className="min-w-0">
                                <a
                                  href={directBuyUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="font-bold text-white hover:text-blue-400 truncate max-w-xs block"
                                  title={product.title}
                                >
                                  {product.title}
                                </a>
                                <div className="text-[10px] text-slate-500">
                                  {product.category} · {product.platform || 'store'}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="py-2.5 px-3.5">
                            <span className="font-semibold text-blue-400">{product.seller}</span>
                          </td>

                          <td className="py-2.5 px-3.5 font-mono font-bold text-[#38BDF8] tabular-nums">
                            {formatConvertedPrice(product.priceNum, currency, product.price)}
                          </td>

                          <td className="py-2.5 px-3.5 text-slate-400 text-[11px] max-w-xs truncate">
                            {product.notes || '-'}
                          </td>

                          <td className="py-2.5 px-3.5">
                            {product.qcLink ? (
                              <button
                                onClick={() => setActiveQcProduct(product)}
                                className="text-blue-400 hover:underline flex items-center gap-1 cursor-pointer whitespace-nowrap"
                              >
                                <Camera className="w-3 h-3" />
                                <span>QC Pics</span>
                              </button>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>

                          <td className="py-2.5 px-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleToggleFavorite(product.id)}
                                className="p-1 text-slate-400 hover:text-blue-400 cursor-pointer"
                                title="Favorite"
                              >
                                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-blue-400 text-blue-400' : ''}`} />
                              </button>

                              <a
                                href={directBuyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-full bg-[#2563EB] hover:bg-blue-500 px-3 py-1 text-[11px] font-extrabold text-white transition-colors cursor-pointer whitespace-nowrap"
                              >
                                {currentAgentConfig.logoUrl && (
                                  <img
                                    src={currentAgentConfig.logoUrl}
                                    alt={currentAgentConfig.name}
                                    className="h-3.5 w-3.5 rounded-full object-contain bg-white/15"
                                  />
                                )}
                                <span>Buy · {currentAgentConfig.name}</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </main>
        </>
      )}

      {/* 5. Footer */}
      <footer className="mt-auto border-t border-blue-500/15 bg-[#05070B] px-4 pt-8 pb-24 md:pb-8 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <OhMyRepsLogo size="sm" />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px]">
            <button
              onClick={() => {
                setIsGuideActive(false);
                setIsSellersActive(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-[#38BDF8] hover:text-white font-bold cursor-pointer"
            >
              Sellers
            </button>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <button
              onClick={() => {
                setIsSellersActive(false);
                setIsGuideActive(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-blue-400 hover:text-blue-300 font-bold cursor-pointer"
            >
              How to Order
            </button>
            <span className="text-slate-700" aria-hidden="true">·</span>
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="text-slate-300 hover:text-white font-semibold cursor-pointer"
            >
              Agents & Coupons
            </button>
          </div>
        </div>
      </footer>

      {/* 6. Mobile Thumb-Friendly Bottom Navigation Bar */}
      <nav
        aria-label="Mobile quick navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-blue-500/25 bg-[#060911]/95 backdrop-blur-xl px-2 py-1.5"
      >
        <div className="grid grid-cols-5 gap-1">
          <button
            type="button"
            onClick={() => {
              setIsGuideActive(false);
              setIsSellersActive(false);
              setShowFavoritesOnly(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-bold transition-colors cursor-pointer ${
              !isSellersActive && !isGuideActive && !showFavoritesOnly
                ? 'text-[#38BDF8] bg-blue-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Catalog</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsGuideActive(false);
              setIsSellersActive(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-bold transition-colors cursor-pointer ${
              isSellersActive
                ? 'text-[#38BDF8] bg-blue-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Sellers</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCompareModalOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-bold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <Gift className="w-4 h-4 text-blue-400" />
            <span>Coupons</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSellersActive(false);
              setIsGuideActive(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-bold transition-colors cursor-pointer ${
              isGuideActive
                ? 'text-[#38BDF8] bg-blue-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Guide</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsGuideActive(false);
              setIsSellersActive(false);
              setShowFavoritesOnly(!showFavoritesOnly);
            }}
            className={`flex flex-col items-center justify-center gap-0.5 rounded-xl py-1.5 text-[10px] font-bold transition-colors cursor-pointer ${
              showFavoritesOnly
                ? 'text-[#38BDF8] bg-blue-500/15'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-blue-400 text-blue-400' : ''}`} />
            <span>Saved ({favorites.length})</span>
          </button>
        </div>
      </nav>

      {/* Modals */}
      <QcModal
        product={activeQcProduct}
        onClose={() => setActiveQcProduct(null)}
      />

      <AgentCompareModal
        isOpen={isCompareModalOpen && !showLoadingScreen}
        onClose={() => setIsCompareModalOpen(false)}
        selectedAgent={selectedAgent}
        onSelectAgent={setSelectedAgent}
      />
    </div>
  );
}
