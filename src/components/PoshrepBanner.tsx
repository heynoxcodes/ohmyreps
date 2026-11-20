import React from 'react';
import { motion } from 'motion/react';
import { Crown, ExternalLink, Sparkles } from 'lucide-react';

export const POSHREP_YUPOO_URL = 'https://poshrep.x.yupoo.com/';
export const POSHREP_LOGO_PATH = '/assets/aistudio/image_189d5148.png';

export const PoshrepBanner: React.FC = () => {
  return (
    <section
      aria-label="Featured Seller Poshrep"
      className="mx-auto w-full min-w-0 max-w-7xl px-4 pt-3.5 pb-1"
    >
      <motion.a
        href={POSHREP_YUPOO_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.25 }}
        className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 overflow-hidden rounded-2xl border border-[#EEFF66]/45 bg-gradient-to-r from-[#141A0C] via-[#0B101B] to-[#0D1322] p-3.5 sm:px-5 sm:py-3.5 shadow-[0_10px_35px_rgba(238,255,102,0.12)] hover:border-[#EEFF66]/80 hover:shadow-[0_12px_40px_rgba(238,255,102,0.22)] transition-all"
      >
        {/* Subtle neon-yellow ambient highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-16 -top-16 h-44 w-56 rounded-full bg-[#EEFF66]/15 blur-3xl transition-opacity group-hover:opacity-100"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -bottom-16 h-36 w-52 rounded-full bg-blue-500/15 blur-3xl"
        />

        {/* Left: Poshrep Logo + Best Seller Copy */}
        <div className="relative z-10 flex items-center gap-3.5 min-w-0">
          <div className="relative shrink-0">
            <img
              src={POSHREP_LOGO_PATH}
              alt="Poshrep Logo"
              className="h-12 w-12 sm:h-14 sm:w-14 rounded-xl object-cover border-2 border-[#EEFF66]/80 shadow-[0_0_20px_rgba(238,255,102,0.35)]"
            />
            <motion.span
              animate={{ rotate: [-6, 6, -6], y: [0, -1.5, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#EEFF66] text-[#05070B] shadow-md border border-black/20"
            >
              <Crown className="h-3 w-3 fill-[#05070B]" />
            </motion.span>
          </div>

          <div className="min-w-0 space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1 rounded-full bg-[#EEFF66] px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-[#05070B]">
                <Sparkles className="h-2.5 w-2.5 fill-[#05070B]" />
                <span>#1 Best Seller</span>
              </span>
              <span className="text-sm sm:text-base font-black tracking-tight text-white group-hover:text-[#EEFF66] transition-colors">
                Poshrep
              </span>
            </div>
            <p className="text-xs sm:text-[13px] text-slate-300 leading-snug">
              Our #1 recommended seller for the best 1:1 batches &amp; fast shipping.{' '}
              <span className="text-[#EEFF66] font-semibold">
                Use Poshrep for your next haul!
              </span>
            </p>
          </div>
        </div>

        {/* Right: Direct Yupoo CTA */}
        <div className="relative z-10 flex items-center justify-between sm:justify-end gap-3 shrink-0">
          <span className="text-[11px] font-mono text-slate-400 sm:hidden truncate">
            poshrep.x.yupoo.com
          </span>
          <span className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#EEFF66] group-hover:bg-[#f4ff8c] px-4 py-2 text-xs font-black text-[#05070B] shadow-[0_0_20px_rgba(238,255,102,0.35)] transition-all whitespace-nowrap">
            <span>Shop Poshrep Yupoo</span>
            <ExternalLink className="h-3.5 w-3.5 stroke-[2.5]" />
          </span>
        </div>
      </motion.a>
    </section>
  );
};
