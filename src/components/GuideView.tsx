import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  ExternalLink, 
  Camera, 
  Truck, 
  MousePointerClick, 
  BookmarkCheck,
  ArrowLeft,
  Ruler,
  ShieldCheck,
  Scale,
  Store
} from 'lucide-react';
import { AgentId } from '../types/index.ts';
import { DEFAULT_AGENTS } from '../utils/agentConverter.ts';

interface GuideViewProps {
  selectedAgent: AgentId;
  onSelectAgent: (agent: AgentId) => void;
  onBackToCatalog: () => void;
}

export const GuideView: React.FC<GuideViewProps> = ({
  selectedAgent,
  onSelectAgent,
  onBackToCatalog,
}) => {
  const activeSafeAgents = DEFAULT_AGENTS.filter(a => a.id !== 'raw');
  const currentAgent = DEFAULT_AGENTS.find(a => a.id === selectedAgent) || DEFAULT_AGENTS[0];

  const steps = [
    {
      num: '1',
      icon: <BookmarkCheck className="w-5 h-5 text-blue-400" />,
      title: 'Pick Your Agent',
      body: 'Choose which shipping agent you want to use at the top of the site (like CNShopper, StarGobuy, or Oopbuy). The site remembers your choice automatically.',
    },
    {
      num: '2',
      icon: <MousePointerClick className="w-5 h-5 text-sky-400" />,
      title: 'Click Buy & Create an Account',
      body: 'When you click any item on OhMyReps!, it opens directly inside your saved agent. If you don’t have an account yet, just sign up on that page to get your shipping coupons.',
    },
    {
      num: '3',
      icon: <Camera className="w-5 h-5 text-blue-400" />,
      title: 'Check Your QC Photos',
      body: 'After you buy, the seller ships the item to your agent’s warehouse in 3–5 days. Your agent takes free QC photos so you can check the quality and sizing before shipping it home.',
    },
    {
      num: '4',
      icon: <Truck className="w-5 h-5 text-sky-400" />,
      title: 'Ship Your Haul',
      body: 'Once your items arrive at the warehouse, select them together, apply your shipping coupon, and ship them to your house in one package.',
    },
  ];

  const tips = [
    {
      icon: <Ruler className="w-4 h-4 text-sky-400" />,
      title: 'Sizing Tips',
      items: [
        'Don’t guess your normal S/M/L size—always check the size chart in cm.',
        'Measure a hoodie or tee you already own (pit-to-pit and length) and compare.',
        'Ask your agent for an extra measurement photo during QC if you aren’t sure.',
      ],
    },
    {
      icon: <Scale className="w-4 h-4 text-blue-400" />,
      title: 'Save Money on Shipping',
      items: [
        'Remove shoeboxes ("Drop Box") before shipping to cut weight and volume by ~30%.',
        'Use vacuum packaging on puffers and hoodies so your box stays small.',
      ],
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: 'Shipping & Customs',
      items: [
        'Use Tax-Free / Tariffless lines whenever available.',
        'Keep packages around 4kg–8.5kg. If your haul is over 10kg, split it into two boxes.',
        'Always tick the cheap parcel insurance box at checkout just in case.',
      ],
    },
    {
      icon: <Store className="w-4 h-4 text-blue-400" />,
      title: 'Buying from Yupoo Sellers',
      items: [
        'Open any seller on the Sellers tab and click the item album you want.',
        'Copy the Weidian or Taobao link shown in the album description and paste it into your agent’s search bar.',
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="mx-auto w-full min-w-0 max-w-5xl px-4 py-6 space-y-6"
    >
      {/* Header */}
      <div className="rounded-3xl border border-blue-500/30 bg-gradient-to-br from-[#0D1830] via-[#0B101B] to-[#05070B] p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h2 className="font-impact text-3xl sm:text-4xl text-white uppercase tracking-wide">
              HOW TO <span className="text-[#38BDF8]">ORDER</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              New to buying with an agent? Here is how it works in 4 simple steps.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-2 self-start sm:self-center rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Catalog</span>
          </button>
        </div>
      </div>

      {/* 4 Simple Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {steps.map((step) => (
          <div
            key={step.num}
            className="rounded-2xl border border-white/10 bg-[#0B101B] p-5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-[#38BDF8]">
                STEP {step.num}
              </span>
              {step.icon}
            </div>
            <h3 className="text-base font-extrabold text-white">
              {step.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {step.body}
            </p>
          </div>
        ))}
      </div>

      {/* Quick Tips */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {tips.map((section) => (
          <div
            key={section.title}
            className="rounded-2xl border border-white/10 bg-[#0B101B] p-5 space-y-2.5"
          >
            <div className="flex items-center gap-2">
              {section.icon}
              <h4 className="text-sm font-extrabold text-white">
                {section.title}
              </h4>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-300 leading-relaxed">
              {section.items.map((bullet, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Agents List */}
      <div className="rounded-3xl border border-white/10 bg-[#0B101B] p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-extrabold text-white">
              Supported Agents & Signup Coupons
            </h3>
            <p className="text-xs text-slate-400">
              Currently selected: <strong className="text-[#38BDF8]">{currentAgent.name}</strong>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeSafeAgents.map((agent) => {
            const isSaved = selectedAgent === agent.id;
            return (
              <div
                key={agent.id}
                className={`flex items-center justify-between gap-3 rounded-2xl border p-3 transition-all ${
                  isSaved
                    ? 'border-blue-500 bg-blue-600/15'
                    : 'border-white/10 bg-[#070B14]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img
                    src={agent.logoUrl}
                    alt={agent.name}
                    className="h-8 w-8 rounded-full object-contain bg-white/10 p-1 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-xs font-extrabold text-white truncate">
                      {agent.name}
                    </div>
                    <div className="text-[11px] font-mono text-[#38BDF8] truncate">
                      {agent.couponHeadline}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => onSelectAgent(agent.id)}
                    className={`rounded-full px-3 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white/10 hover:bg-white/15 text-slate-200'
                    }`}
                  >
                    {isSaved ? (
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
                      className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/25 px-2.5 py-1.5 text-[11px] font-bold text-blue-300 transition-colors"
                    >
                      <span>Sign Up</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};
