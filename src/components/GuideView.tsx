import React from 'react';
import { motion } from 'motion/react';
import { 
  Check, 
  ExternalLink, 
  Camera, 
  Truck, 
  MousePointerClick, 
  BookmarkCheck,
  ArrowRight,
  Ruler,
  ShieldCheck,
  Scale,
  Store
} from 'lucide-react';
import { AgentId } from '../types/index.ts';
import { DEFAULT_AGENTS, RAIDED_BLACKLIST_AGENTS } from '../utils/agentConverter.ts';
import { AgentHealthBadge } from './Header.tsx';

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

  const workflowSteps = [
    {
      num: '01',
      icon: <BookmarkCheck className="w-5 h-5 text-blue-400" />,
      title: 'Select & Persist Your Purchasing Agent',
      subtitle: 'Automatic browser persistence across all sessions',
      body: 'Purchasing agents act as domestic intermediaries in China that buy from local marketplaces (Weidian, Taobao, 1688) on your behalf. Select your preferred agent in the header or directory below—CNShopper, StarGobuy, and Oopbuy currently operate with the fastest warehouse processing times (Online status).',
    },
    {
      num: '02',
      icon: <MousePointerClick className="w-5 h-5 text-sky-400" />,
      title: 'Direct Product Conversion & Coupon Binding',
      subtitle: 'Single-click routing with embedded partner referral parameters',
      body: 'Every item in the OhMyReps! catalog is linked to its original Chinese marketplace listing. Clicking "Buy" converts the raw store URL into your saved agent’s native product page while embedding our partner invitation code. If you do not have an account yet, registering on that landing page automatically credits your account with the welcome shipping coupon bundle.',
    },
    {
      num: '03',
      icon: <Camera className="w-5 h-5 text-blue-400" />,
      title: 'Domestic Transit & Warehouse QC Inspection',
      subtitle: 'Standard 3–5 day domestic arrival + high-resolution inspection',
      body: 'Once your order is placed, the domestic seller ships the item to your agent’s warehouse (typically 3 to 5 days). Warehouse staff photograph the item on a calibrated measurement grid and record its exact weight in grams. Review these Quality Check (QC) photos in your account dashboard before authorizing international shipment.',
    },
    {
      num: '04',
      icon: <Truck className="w-5 h-5 text-sky-400" />,
      title: 'Parcel Consolidation & International Dispatch',
      subtitle: 'Combine multiple items into a single international shipment',
      body: 'Items can be stored free in your agent’s warehouse for 60–90 days. Wait until all items arrive, select them together in your warehouse tab, apply your signup shipping coupons, and submit a single consolidated parcel using a Tax-Free / Tariffless air line.',
    },
  ];

  const technicalReference = [
    {
      icon: <Store className="w-4 h-4 text-blue-400" />,
      title: 'Marketplace Sources (Weidian vs. Taobao vs. 1688)',
      items: [
        'Weidian: Primary platform for independent batch producers and specialized footwear/outerwear studios.',
        'Taobao: Established retail marketplace offering independent designer labels, knitwear, and accessories.',
        '1688: Wholesale B2B supply platform. Often requires a 2-unit minimum or slight domestic freight fee, but offers direct factory pricing.',
      ],
    },
    {
      icon: <Ruler className="w-4 h-4 text-sky-400" />,
      title: 'Sizing & Garment Measurement Protocol',
      items: [
        'Do not rely on standard US/EU letter sizing (S/M/L). Always consult the seller’s size chart in centimeters (cm).',
        'Measure a well-fitting garment you already own flat across the chest (pit-to-pit) and total back length.',
        'During warehouse QC, request an extra photo with a measuring tape across the chest if sizing tolerances are critical.',
      ],
    },
    {
      icon: <Scale className="w-4 h-4 text-blue-400" />,
      title: 'Volumetric Optimization & Packaging',
      items: [
        'Drop Shoeboxes ("Net Weight"): Removing outer cardboard shoeboxes typically reduces volumetric weight by 25–35%.',
        'Vacuum Packaging: Recommended for down jackets, heavy hoodies, and fleece to prevent volumetric surcharges.',
        'Corner Protection & Stretch Film: Low-cost add-ons ($1–$2) that protect parcel integrity during international air transit.',
      ],
    },
    {
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
      title: 'Customs Declaration & Shipping Line Selection',
      items: [
        'Tax-Free / Triangular Lines: Recommended for EU, UK, US, and Canada. Parcels clear customs through a commercial hub with pre-paid duties.',
        'Optimal Parcel Weight: Keep individual parcels between 4 kg and 8.5 kg. Split hauls exceeding 10 kg into two separate shipments.',
        'Parcel Insurance: Always select warehouse transit & customs insurance (typically 3% of declared value) at checkout.',
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="mx-auto max-w-6xl px-4 py-6 space-y-8"
    >
      {/* Top Reference Header */}
      <div className="rounded-3xl border border-blue-500/35 bg-gradient-to-br from-[#0D1830] via-[#0B101B] to-[#05070B] p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="text-xs font-mono font-bold uppercase tracking-widest text-[#38BDF8]">
              OMR TECHNICAL DOCUMENTATION
            </div>
            <h2 className="font-impact text-3xl sm:text-4xl text-white uppercase tracking-wide leading-none">
              AGENT PURCHASING, QC & LOGISTICS GUIDE
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Complete operational reference for selecting a purchasing agent, converting domestic marketplace links, verifying warehouse quality control (QC) measurements, and consolidating international shipments.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToCatalog}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-[#2563EB] hover:bg-blue-500 px-6 py-3 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-white transition-all shadow-[0_0_25px_rgba(37,99,235,0.4)] cursor-pointer shrink-0"
          >
            <span>Return to Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4-Step End-to-End Ordering Workflow */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 px-1">
          1. Standard 4-Stage Ordering Workflow
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workflowSteps.map((step) => (
            <div
              key={step.num}
              className="rounded-2xl border border-blue-500/20 bg-[#0B101B]/90 p-5 flex flex-col justify-between gap-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#38BDF8] uppercase tracking-wider">
                    STAGE {step.num}
                  </span>
                  <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    {step.icon}
                  </div>
                </div>
                <h4 className="text-sm sm:text-base font-extrabold text-white">
                  {step.title}
                </h4>
                <p className="text-xs font-semibold text-blue-400">
                  {step.subtitle}
                </p>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Reference Grid: Platforms, Sizing, Packaging & Customs */}
      <div className="space-y-3">
        <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 px-1">
          2. Quality Control, Sizing & International Logistics Specifications
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {technicalReference.map((section) => (
            <div
              key={section.title}
              className="rounded-2xl border border-white/10 bg-[#0B101B]/80 p-5 space-y-3"
            >
              <div className="flex items-center gap-2.5 border-b border-white/10 pb-2.5">
                <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                  {section.icon}
                </div>
                <h4 className="text-xs sm:text-sm font-extrabold text-white">
                  {section.title}
                </h4>
              </div>
              <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
                {section.items.map((bullet, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Agent Directory & Live Health Status */}
      <div className="rounded-3xl border border-blue-500/30 bg-[#0B101B]/90 p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-impact text-2xl sm:text-3xl text-white uppercase tracking-wide">
                3. AGENT DIRECTORY & LIVE HEALTH STATUS
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active Route: <strong className="text-[#38BDF8]">{currentAgent.name}</strong> ({currentAgent.couponHeadline}). CNShopper, StarGobuy, and Oopbuy currently provide the fastest order purchasing and warehouse QC turnaround.
            </p>
          </div>

          {currentAgent.signupUrl && (
            <a
              href={currentAgent.signupUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-400/40 px-4 py-2 text-xs font-extrabold text-blue-300 hover:text-white transition-colors shrink-0"
            >
              <span>Register on {currentAgent.name} ({currentAgent.couponHeadline})</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {activeSafeAgents.map((agent) => {
            const isSaved = selectedAgent === agent.id;
            return (
              <div
                key={agent.id}
                className={`flex flex-col justify-between rounded-2xl border p-4 transition-all ${
                  isSaved
                    ? 'border-blue-500 bg-blue-600/15 shadow-[0_0_25px_rgba(37,99,235,0.2)]'
                    : 'border-white/10 bg-[#070B14] hover:border-blue-500/40'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img
                        src={agent.logoUrl}
                        alt={agent.name}
                        className="h-9 w-9 rounded-full object-contain bg-white/10 p-1 border border-white/10 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-white truncate flex items-center gap-1.5 flex-wrap">
                          <span>{agent.name}</span>
                          <AgentHealthBadge status={agent.healthStatus} compact />
                        </div>
                        <div className="font-impact text-sm text-[#38BDF8] tracking-wide uppercase mt-0.5">
                          {agent.couponHeadline}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-400 leading-snug mb-3">
                    {agent.tagline}
                  </p>
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => onSelectAgent(agent.id)}
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-full py-2 px-3 text-xs font-extrabold transition-colors cursor-pointer ${
                      isSaved
                        ? 'bg-[#2563EB] text-white'
                        : 'bg-white/10 hover:bg-white/15 text-slate-200'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Active Route ✓</span>
                      </>
                    ) : (
                      <span>Set as Default</span>
                    )}
                  </button>

                  {agent.signupUrl && (
                    <a
                      href={agent.signupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 hover:bg-blue-500/25 px-3 py-2 text-xs font-bold text-blue-300 transition-colors shrink-0"
                      title={`Register on ${agent.name}`}
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

        {/* Discontinued / Unavailable Agents Row */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-500 font-medium">
            Discontinued / Unsupported Platforms:
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
    </motion.div>
  );
};
