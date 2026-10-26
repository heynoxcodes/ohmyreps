import React from 'react';
import { 
  ArrowUpDown, 
  Grid3X3, 
  List, 
  X,
  Search
} from 'lucide-react';

export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'name-asc';

interface FilterBarProps {
  totalCount: number;
  filteredCount: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  sellers: string[];
  selectedSeller: string;
  onSelectSeller: (seller: string) => void;
  priceMin: string;
  onPriceMinChange: (val: string) => void;
  priceMax: string;
  onPriceMaxChange: (val: string) => void;
  sortBy: SortOption;
  onSortByChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'compact';
  onViewModeChange: (mode: 'grid' | 'compact') => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  totalCount,
  filteredCount,
  searchQuery,
  onSearchChange,
  sellers,
  selectedSeller,
  onSelectSeller,
  priceMin,
  onPriceMinChange,
  priceMax,
  onPriceMaxChange,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-2.5">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 rounded-2xl border border-blue-500/20 bg-[#0B101B]/90 p-3 text-xs">
        {/* Left: Item counter, inline search & active filter reset */}
        <div className="flex flex-wrap items-center justify-between lg:justify-start gap-2.5">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-white font-mono tabular-nums text-xs sm:text-sm">
              {filteredCount} {filteredCount === 1 ? 'find' : 'finds'}
            </span>
            {totalCount !== filteredCount && (
              <span className="text-slate-500 font-mono tabular-nums">
                / {totalCount}
              </span>
            )}

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="flex items-center gap-1 rounded-xl bg-blue-500/15 hover:bg-blue-500/25 border border-blue-500/30 px-2.5 py-1 text-[11px] font-bold text-[#38BDF8] transition-colors cursor-pointer"
              >
                <span>Reset</span>
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Mobile View Mode Toggle */}
          <div className="flex lg:hidden items-center rounded-xl border border-blue-500/25 bg-[#05070B] p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('compact')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'compact' ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Compact View"
              aria-label="Compact view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Responsive Filter Controls Row */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          {/* Quick Inline Filter Input */}
          <div className="col-span-2 sm:col-span-1 relative flex-1 sm:w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Filter this category..."
              className="w-full rounded-xl border border-blue-500/25 bg-[#05070B] py-1.5 pl-8 pr-7 text-xs text-white placeholder:text-slate-500 focus:border-blue-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Seller / Batch Selector */}
          <select
            id="seller-select"
            value={selectedSeller}
            onChange={(e) => onSelectSeller(e.target.value)}
            aria-label="Filter by seller"
            className="rounded-xl border border-blue-500/25 bg-[#05070B] px-3 py-1.5 text-xs text-slate-200 focus:border-blue-400 focus:outline-none cursor-pointer truncate"
          >
            <option value="">All Sellers ({sellers.length})</option>
            {sellers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500 hidden sm:inline shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => onSortByChange(e.target.value as SortOption)}
              aria-label="Sort products by"
              className="w-full rounded-xl border border-blue-500/25 bg-[#05070B] px-3 py-1.5 text-xs text-slate-200 focus:border-blue-400 focus:outline-none cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="name-asc">Name: A → Z</option>
            </select>
          </div>

          {/* Price Range inputs */}
          <div className="col-span-2 sm:col-span-1 flex items-center gap-1">
            <input
              type="number"
              placeholder="Min $"
              value={priceMin}
              onChange={(e) => onPriceMinChange(e.target.value)}
              className="w-full sm:w-16 rounded-xl border border-blue-500/25 bg-[#05070B] px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-blue-400 focus:outline-none tabular-nums"
            />
            <span className="text-slate-600">-</span>
            <input
              type="number"
              placeholder="Max $"
              value={priceMax}
              onChange={(e) => onPriceMaxChange(e.target.value)}
              className="w-full sm:w-16 rounded-xl border border-blue-500/25 bg-[#05070B] px-2.5 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:border-blue-400 focus:outline-none tabular-nums"
            />
          </div>

          {/* Desktop View Mode Toggle */}
          <div className="hidden lg:flex items-center rounded-xl border border-blue-500/25 bg-[#05070B] p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'grid' ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <Grid3X3 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('compact')}
              className={`p-1.5 rounded-lg cursor-pointer transition-colors ${
                viewMode === 'compact' ? 'bg-[#2563EB] text-white' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Compact View"
              aria-label="Compact view"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
