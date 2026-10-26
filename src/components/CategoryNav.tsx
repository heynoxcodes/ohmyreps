import React from 'react';
import { motion } from 'motion/react';
import { 
  Shirt, 
  Footprints, 
  Briefcase, 
  CircleDot, 
  Gem, 
  Home, 
  Headphones, 
  Dumbbell, 
  Glasses, 
  LayoutGrid,
  ShieldCheck
} from 'lucide-react';
import { SheetTab } from '../types/index.ts';

interface CategoryNavProps {
  tabs: SheetTab[];
  activeGid: string;
  onSelectTab: (gid: string) => void;
  tabCounts: Record<string, number>;
  isLoading: boolean;
  isGuideActive: boolean;
  onToggleGuide: (active: boolean) => void;
  isSellersActive: boolean;
  onToggleSellers: (active: boolean) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
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

export const CategoryNav: React.FC<CategoryNavProps> = ({
  tabs,
  activeGid,
  onSelectTab,
  tabCounts,
  isGuideActive,
  onToggleGuide,
  isSellersActive,
  onToggleSellers,
}) => {
  if (isSellersActive || isGuideActive) {
    return null;
  }

  return (
    <div id="catalog-section" className="mx-auto max-w-7xl px-4 pt-1 pb-1">
      <div className="flex items-center gap-2 overflow-x-auto pb-2.5 scrollbar-none border-b border-white/10">
        {tabs.map((tab) => {
          const isActive = !isGuideActive && !isSellersActive && tab.gid === activeGid;
          const count = tabCounts[tab.gid];
          const icon = ICON_MAP[tab.iconName] || <LayoutGrid className="w-4 h-4" />;

          return (
            <motion.button
              key={tab.gid}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                onToggleGuide(false);
                onToggleSellers(false);
                onSelectTab(tab.gid);
              }}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                isActive
                  ? 'text-white shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                  : 'bg-[#0B101B] text-slate-400 hover:text-white border border-white/10'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="omrActiveCategoryTab"
                  transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                  className="absolute inset-0 rounded-full bg-[#2563EB] -z-10"
                />
              )}
              <span className={isActive ? 'text-white' : 'text-blue-400'}>
                {icon}
              </span>
              <span>{tab.name}</span>
              {typeof count === 'number' && (
                <span
                  className={`text-[10px] font-mono tabular-nums ${
                    isActive ? 'text-blue-100' : 'text-slate-500'
                  }`}
                >
                  ({count})
                </span>
              )}
            </motion.button>
          );
        })}

        <div className="h-5 w-[1px] bg-white/10 shrink-0 mx-0.5" />

        {/* Clean Sellers Tab */}
        <button
          type="button"
          onClick={() => {
            onToggleGuide(false);
            onToggleSellers(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap bg-blue-500/15 text-[#38BDF8] hover:text-white hover:bg-blue-500/25 border border-blue-400/35 transition-colors cursor-pointer shrink-0"
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Sellers</span>
        </button>
      </div>
    </div>
  );
};
