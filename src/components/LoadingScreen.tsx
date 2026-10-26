import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FastForward, Image as ImageIcon, Database, CheckCircle2 } from 'lucide-react';
import { OhMyRepsLogo } from './Header.tsx';

interface LoadingScreenProps {
  isOpen: boolean;
  isFetchingSheet: boolean;
  loadedImagesCount: number;
  targetImagesCount: number;
  categoryName: string;
  onSkip: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  isOpen,
  isFetchingSheet,
  loadedImagesCount,
  targetImagesCount,
  categoryName,
  onSkip,
}) => {
  const sheetDone = !isFetchingSheet && targetImagesCount > 0;
  const clampedLoaded = Math.min(loadedImagesCount, targetImagesCount);

  // Calculate percentage: first 20% is spreadsheet data, remaining 80% is actual image loading
  const progressPercent = !sheetDone
    ? 12
    : targetImagesCount > 0
    ? Math.min(100, Math.round(20 + (clampedLoaded / targetImagesCount) * 80))
    : 20;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.25, ease: 'easeOut' } }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#05070B] px-6 text-center select-none"
        >
          {/* Ambient radial glow */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-blue-600/15 blur-[110px]" />
          </div>

          <div className="relative z-10 w-full max-w-sm flex flex-col items-center">
            {/* Brand Logo */}
            <div className="mb-5 scale-110">
              <OhMyRepsLogo size="lg" />
            </div>

            <h2 className="text-lg sm:text-xl font-black tracking-tight text-white mb-1">
              Loading {categoryName}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              {!sheetDone
                ? 'Syncing spreadsheet catalog & agent links...'
                : `Waiting for product photos to load (${clampedLoaded} / ${targetImagesCount})...`}
            </p>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-[#0D1422] border border-blue-500/20 overflow-hidden mb-3 p-0.5">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#2563EB]"
                initial={{ width: '8%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              />
            </div>

            {/* Live checklist */}
            <div className="w-full rounded-2xl border border-white/10 bg-[#0B101B]/90 p-3.5 mb-6 text-left space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <Database className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>Spreadsheet catalog</span>
                </div>
                {sheetDone ? (
                  <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready
                  </span>
                ) : (
                  <span className="font-mono text-[11px] text-blue-400 animate-pulse">
                    Loading...
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300">
                  <ImageIcon className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                  <span>Product images</span>
                </div>
                <span className="font-mono text-[11px] text-slate-300 font-bold tabular-nums">
                  {sheetDone ? `${clampedLoaded} / ${targetImagesCount}` : 'Waiting...'}
                </span>
              </div>
            </div>

            {/* Skip Button */}
            <button
              type="button"
              onClick={onSkip}
              className="w-full flex items-center justify-center gap-2 rounded-xl border border-blue-500/35 bg-blue-500/10 hover:bg-blue-500/20 active:scale-[0.99] px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-all cursor-pointer shadow-[0_0_25px_rgba(37,99,235,0.2)]"
            >
              <span>Skip Loading</span>
              <FastForward className="w-3.5 h-3.5 text-[#38BDF8]" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
