import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowUpRight, Check } from 'lucide-react';
import { AgentId } from '../types/index.ts';
import { DEFAULT_AGENTS } from '../utils/agentConverter.ts';
import { OhMyRepsLogo } from './Header.tsx';

interface AgentCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgent: AgentId;
  onSelectAgent: (agent: AgentId) => void;
}

export const AgentCompareModal: React.FC<AgentCompareModalProps> = ({
  isOpen,
  onClose,
  selectedAgent,
  onSelectAgent,
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
          transition={{ duration: 0.16 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-blue-500/30 bg-[#070B14] p-5 sm:p-6 shadow-2xl space-y-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <OhMyRepsLogo size="sm" />
                <h2 className="text-lg font-extrabold text-white mt-2">
                  Choose Your Shipping Agent
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pick your preferred agent once. Every product link will automatically open with it.
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean 2-Column Agent Selector Grid */}
            <div className="grid grid-cols-2 gap-2 max-h-[48vh] overflow-y-auto pr-1">
              {activeSafeAgents.map((agent) => {
                const isSelected = selectedAgent === agent.id;
                return (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => onSelectAgent(agent.id)}
                    className={`flex items-center justify-between gap-2 rounded-2xl border p-2.5 text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/20 text-white shadow-[0_0_16px_rgba(37,99,235,0.25)]'
                        : 'border-white/10 bg-[#0B101B] text-slate-300 hover:border-blue-500/40 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={agent.logoUrl}
                        alt={agent.name}
                        className="h-7 w-7 rounded-full object-contain bg-white/10 p-0.5 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-extrabold truncate">
                          {agent.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#38BDF8] truncate">
                          {agent.couponHeadline}
                        </div>
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-[#38BDF8] shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              {currentAgent.signupUrl && (
                <a
                  href={currentAgent.signupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 rounded-2xl border border-blue-500/40 bg-blue-500/15 hover:bg-blue-500/25 py-2.5 text-xs font-bold text-[#38BDF8] hover:text-white transition-colors"
                >
                  <span>New to {currentAgent.name}? Claim {currentAgent.couponHeadline}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}

              <button
                type="button"
                onClick={onClose}
                className="w-full rounded-2xl bg-[#2563EB] hover:bg-blue-500 py-3 text-xs sm:text-sm font-extrabold text-white transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer"
              >
                Continue with {currentAgent.name} →
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
