import React from 'react';
import { 
  Grid3X3, 
  List, 
  X
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
  sellers,
  selectedSeller,
  onSelectSeller,
  sortBy,
  onSortByChange,
  viewMode,
  onViewModeChange,
  onResetFilters,
  hasActiveFilters,
}) => {
  return (
    <div className="mx-auto max-w-7xl px-4 py-2">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        {/* Left: Item counter & reset */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300 font-mono tabular-nums">
            {filteredCount} {filteredCount === 1 ? 'item' : 'items'}
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
              className="flex items-center gap-1 rounded-full bg-blue-500/15 hover:bg-blue-500/25 px-2.5 py-1 text-[11px] font-bold text-[#38BDF8] transition-colors cursor-pointer"
            >
              <span>Reset</span>
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Right: Minimal Seller + Sort + Grid/List Toggle */}
        <div className="flex items-center gap-2">
          <select
            id="seller-select"
            value={selectedSeller}
            onChange={(e) => onSelectSeller(e.target.value)}
            aria-label="Filter by seller"
            className="rounded-full border border-white/10 bg-[#0B101B] px-3 py-1.5 text-xs text-slate-200 focus:border-blue-400 focus:outline-none cursor-pointer max-w-[140px] sm:max-w-[180px] truncate"
          >
            <option value="">All Sellers ({sellers.length})</option>
            {sellers.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as SortOption)}
            aria-label="Sort products by"
            className="rounded-full border border-white/10 bg-[#0B101B] px-3 py-1.5 text-xs text-slate-200 focus:border-blue-400 focus:outline-none cursor-pointer"
          >
            <option value="default">Sort: Featured</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="name-asc">Name: A → Z</option>
          </select>

          <div className="flex items-center rounded-full border border-white/10 bg-[#0B101B] p-0.5">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${
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
              className={`p-1.5 rounded-full cursor-pointer transition-colors ${
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
