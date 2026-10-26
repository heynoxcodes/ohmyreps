import React, { useState } from 'react';
import { X, FileSpreadsheet, Check, ArrowRight, RotateCcw } from 'lucide-react';
import { DEFAULT_SHEET_ID } from '../utils/sheetParser.ts';

interface CustomSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSheetId: string;
  onChangeSheetId: (id: string) => void;
}

export const CustomSheetModal: React.FC<CustomSheetModalProps> = ({
  isOpen,
  onClose,
  currentSheetId,
  onChangeSheetId,
}) => {
  const [inputUrl, setInputUrl] = useState(
    `https://docs.google.com/spreadsheets/d/${currentSheetId}/htmlview`
  );
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Extract sheet ID from standard google doc url or raw ID
    const match = inputUrl.match(/\/d\/([a-zA-Z0-9-_]+)/);
    let extractedId = '';
    if (match) {
      extractedId = match[1];
    } else if (/^[a-zA-Z0-9-_]{20,}$/.test(inputUrl.trim())) {
      extractedId = inputUrl.trim();
    } else {
      setError('Please provide a valid Google Sheet URL containing /d/<SHEET_ID>/');
      return;
    }

    onChangeSheetId(extractedId);
    onClose();
  };

  const handleResetToDefault = () => {
    onChangeSheetId(DEFAULT_SHEET_ID);
    setInputUrl(`https://docs.google.com/spreadsheets/d/${DEFAULT_SHEET_ID}/htmlview`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg flex flex-col rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 px-6 py-4 bg-zinc-900/60">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Live Google Sheet Source URL
              </h2>
              <p className="text-xs text-zinc-400">
                Connect and sync real-time inventory from any public Google Sheet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors cursor-pointer"
            aria-label="Close sheet modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleApply} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-200">
              Google Sheet URL or ID
            </label>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/14f3ISAO2u.../htmlview"
              className="w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-xs text-zinc-100 font-mono focus:border-amber-500 focus:outline-none"
            />
            {error && <p className="text-[11px] text-rose-400">{error}</p>}
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-3 text-xs text-zinc-400 space-y-1">
            <div className="font-semibold text-zinc-300">Default Connected Sheet:</div>
            <div className="font-mono text-[11px] text-amber-400 break-all">
              {DEFAULT_SHEET_ID} (albynft Oopbuy Catalog)
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to default sheet</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-4 py-1.5 text-xs font-bold text-black cursor-pointer"
              >
                <span>Connect & Sync</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
