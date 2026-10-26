import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ExternalLink, ArrowUpRight, Check } from 'lucide-react';
import { AgentId } from '../types/index.ts';
import { DEFAULT_AGENTS, RAIDED_BLACKLIST_AGENTS } from '../utils/agentConverter.ts';
import { OhMyRepsLogo, AgentHealthBadge } from './Header.tsx';

interface AgentCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgent: AgentId;
  onSelectAgent: (agent: AgentId) => void;
  showOnArrival?: boolean;
  onToggleShowOnArrival?: (val: boolean) => void;
}

export const AgentCompareModal: React.FC<AgentCompareModalProps> = ({
  isOpen,
  onClose,
  selectedAgent,
  onSelectAgent,
  showOnArrival = true,
  onToggleShowOnArrival,
}) => {
  const activeSafeAgents = DEFAULT_AGENTS.filter(a => a.id !== 'raw');
  const currentAgent = DEFAULT_AGENTS.find(a => a.id === selectedAgent) || DEFAULT_AGENTS[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 360, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-blue-500/40 bg-[#070B14] shadow-[0_0_70px_rgba(37,99,235,0.35)] overflow-hidden"
          >
            {/* Top Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-5 sm:px-6 py-4 bg-[#0B101B]">
              <div className="flex items-center gap-3">
                <OhMyRepsLogo size="sm" />
                <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
                  · Agent Routing & Live Warehouse Status
                </span>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Agent Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
              {/* Featured Active Agent Signup Coupon Spotlight */}
              <div className="rounded-2xl border border-blue-500/45 bg-gradient-to-br from-[#0F1E3D] via-[#0B1325] to-[#070B14] p-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    {currentAgent.logoUrl && (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 p-2 shadow-inner">
                        <img
                          src={currentAgent.logoUrl}
                          alt={currentAgent.name}
                          className="h-full w-full rounded-xl object-contain"
                        />
                      </div>
                    )}
                    <div>
                      <div className="flex items-center gap-2 flex-wrap text-xs text-slate-300">
                        <span className="text-base font-extrabold uppercase tracking-wider text-white">
                          {currentAgent.name}
                        </span>
                        <AgentHealthBadge status={currentAgent.healthStatus} />
                        <span className="font-mono text-blue-400 font-bold text-[11px]">
                          · Active Route
                        </span>
                      </div>
                      <div className="font-impact text-2xl sm:text-3xl text-[#38BDF8] tracking-wide uppercase mt-0.5">
                        {currentAgent.couponHeadline}
                      </div>
                      <p className="text-xs text-slate-300 mt-0.5">
                        {currentAgent.bonusText} — All catalog links open directly in {currentAgent.name}.
                      </p>
                    </div>
                  </div>

                  {currentAgent.signupUrl && (
                    <a
                      href={currentAgent.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-blue-500 px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white transition-all shadow-[0_0_25px_rgba(37,99,235,0.45)] shrink-0"
                    >
                      <span>Register & Claim Coupons</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* All 12 Partner Agents Grid with Health Badges */}
              <div className="space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-200">
                    Select Default Agent (CNShopper, StarGobuy & Oopbuy Fastest)
                  </h3>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Online
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" /> High Traffic
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-rose-400" /> Slow
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {activeSafeAgents.map((agent) => {
                    const isSelected = selectedAgent === agent.id;

                    return (
                      <motion.div
                        key={agent.id}
                        whileHover={{ y: -2 }}
                        className={`flex items-center justify-between gap-2.5 rounded-2xl border p-3 transition-colors ${
                          isSelected
                            ? 'border-blue-500 bg-blue-600/20 shadow-[0_0_20px_rgba(37,99,235,0.2)]'
                            : 'border-white/10 bg-[#0B101B]/90 hover:border-blue-500/40'
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => onSelectAgent(agent.id)}
                          className="flex items-center gap-2.5 min-w-0 flex-1 text-left cursor-pointer"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 border border-white/10 p-1.5">
                            <img
                              src={agent.logoUrl}
                              alt={agent.name}
                              className="h-full w-full rounded-full object-contain"
                            />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="text-xs font-extrabold text-white truncate">
                                {agent.name}
                              </span>
                              <AgentHealthBadge status={agent.healthStatus} compact />
                            </div>
                            <div className="font-impact text-sm text-[#38BDF8] tracking-wide uppercase mt-0.5">
                              {agent.couponHeadline}
                            </div>
                          </div>
                        </button>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => onSelectAgent(agent.id)}
                            className={`rounded-full px-3 py-1.5 text-[11px] font-extrabold transition-colors cursor-pointer ${
                              isSelected
                                ? 'bg-[#2563EB] text-white'
                                : 'bg-white/10 hover:bg-white/15 text-slate-200'
                            }`}
                          >
                            {isSelected ? (
                              <span className="flex items-center gap-1">
                                <Check className="w-3 h-3" /> Saved
                              </span>
                            ) : (
                              'Save'
                            )}
                          </button>

                          {agent.signupUrl && (
                            <a
                              href={agent.signupUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/15 hover:bg-blue-500/30 px-2.5 py-1.5 text-[11px] font-bold text-blue-300 transition-colors"
                              title={`Sign up on ${agent.name}`}
                            >
                              <span>Sign Up</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Subtle Crossed-Out Agents Row */}
              <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500 font-medium">
                  Discontinued / Unavailable:
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  {RAIDED_BLACKLIST_AGENTS.map((bad) => (
                    <div
                      key={bad.id}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 line-through opacity-40 select-none"
                    >
                      <img
                        src={bad.logoUrl}
                        alt={bad.name}
                        className="h-4 w-4 rounded-full grayscale object-contain"
                      />
                      <span>{bad.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-wrap justify-between items-center gap-3 border-t border-white/10 px-5 sm:px-6 py-3.5 bg-[#0B101B] text-xs text-slate-400">
              {onToggleShowOnArrival ? (
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={showOnArrival}
                    onChange={(e) => onToggleShowOnArrival(e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
                  />
                  <span>Show agent status on arrival</span>
                </label>
              ) : (
                <span className="flex items-center gap-2">
                  <span>Active Agent: <strong className="text-white">{currentAgent.name}</strong></span>
                  <AgentHealthBadge status={currentAgent.healthStatus} compact />
                </span>
              )}

              <button
                onClick={onClose}
                className="rounded-full bg-[#2563EB] hover:bg-blue-500 px-6 py-2 text-xs font-extrabold uppercase tracking-wider text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer"
              >
                Continue to Catalog →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
