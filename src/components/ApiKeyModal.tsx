import React, { useState } from 'react';
import { X, Key, ShieldCheck, Sparkles, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiKey: string;
  onSaveKey: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  apiKey,
  onSaveKey,
}) => {
  const [inputKey, setInputKey] = useState(apiKey);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(inputKey.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/20 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
          <Key className="w-6 h-6" />
        </div>

        <h3 className="text-xl font-bold text-white mb-2 font-['Syne']">
          Google Gemini API Key
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-6">
          Power your podcast intelligence with Gemini 2.0 / 1.5 Flash. Its 1,000,000+ token context window reads full 4-hour conversations to find high-virality hooks with zero hallucination.
        </p>

        <div className="mb-6">
          <label className="text-[11px] font-bold text-slate-300 block mb-2 uppercase tracking-wider">
            Gemini API Key
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIzaSy..."
            className="w-full py-3 px-4 bg-[#0d101d] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-slate-500">Stored locally in your browser</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              <span>Get Free API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="btn-secondary flex-1 py-3 text-xs font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn-primary flex-1 py-3 text-xs font-bold cursor-pointer"
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};
