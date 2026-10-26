import React from 'react';
import { 
  X, 
  ExternalLink, 
  Camera, 
  CheckCircle2
} from 'lucide-react';
import { ProductItem } from '../types/index.ts';
import { getBrandVisual } from '../utils/brandVisuals.ts';
import { getProxiedImageUrl } from '../utils/agentConverter.ts';

interface QcModalProps {
  product: ProductItem | null;
  onClose: () => void;
}

export const QcModal: React.FC<QcModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const brand = getBrandVisual(product.title, product.category);
  const proxiedImg = getProxiedImageUrl(product.image);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl flex flex-col rounded-3xl border border-blue-500/35 bg-[#070B14] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-[#0B101B]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-white">
                Warehouse Quality Check (QC) Photos
              </h2>
              <p className="text-[11px] text-slate-400">
                Inspect real item photos & warehouse QC before shipping
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            aria-label="Close QC details modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Item recap with real spreadsheet photo */}
          <div className="flex items-center gap-4 p-3 rounded-2xl border border-white/10 bg-[#0B101B]">
            {proxiedImg ? (
              <img
                src={proxiedImg}
                alt={product.title}
                className="w-20 h-20 shrink-0 rounded-xl object-cover border border-white/10 bg-[#05070B]"
              />
            ) : (
              <div className={`w-16 h-16 shrink-0 rounded-xl border border-white/10 flex flex-col items-center justify-center bg-gradient-to-br ${brand.bgGradient}`}>
                <span className="text-xs font-extrabold font-mono text-white">
                  {brand.shortCode}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white line-clamp-2">
                {product.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                <span className="text-blue-400 font-semibold">{product.seller}</span>
                <span>·</span>
                <span className="font-mono text-[#38BDF8] font-bold tabular-nums">{product.price}</span>
                <span>·</span>
                <span>{product.category}</span>
              </div>
            </div>
          </div>

          {/* QC Link Action */}
          {product.qcLink ? (
            <div className="rounded-2xl border border-blue-500/30 bg-[#0B101B] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">
                  Warehouse QC Album Link
                </span>
                <span className="text-[10px] text-blue-400 font-mono">
                  {product.qcLink.includes('uufinds') ? 'uufinds.com' : 'yupoo.com'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Browse high-resolution warehouse inspection photos (measurements, tags, embroidery, stitching).
              </p>
              <a
                href={product.qcLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full rounded-full bg-[#2563EB] hover:bg-blue-500 py-2.5 px-4 text-xs font-extrabold text-white transition-colors"
              >
                <span>Open High-Res QC Album</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          ) : (
            <div className="p-4 rounded-2xl border border-white/10 bg-[#0B101B] text-center text-xs text-slate-400">
              When ordered through CNShopper or our partner agents, free HD warehouse QC photos are automatically provided upon arrival.
            </div>
          )}

          {/* QC Checklist Tips */}
          <div className="space-y-2 rounded-2xl border border-white/10 bg-[#0B101B]/60 p-4 text-xs text-slate-300">
            <h4 className="font-bold text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              Warehouse Inspection Checklist
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc list-inside">
              <li>Compare chest & length measurements against your best-fitting garment.</li>
              <li>Inspect embroidery alignment, stitching, and wash tags.</li>
              <li>Use vacuum packaging on puffers/hoodies to cut volumetric weight.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-white/10 px-6 py-3.5 bg-[#0B101B]">
          <button
            onClick={onClose}
            className="rounded-full bg-white/10 hover:bg-white/15 px-5 py-1.5 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
