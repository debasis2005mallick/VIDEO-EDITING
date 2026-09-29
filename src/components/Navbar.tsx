import React from 'react';
import { Zap, Key, ShieldCheck, Video } from 'lucide-react';

interface NavbarProps {
  apiKey: string;
  onOpenKeyModal: () => void;
  serverStatus: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ apiKey, onOpenKeyModal, serverStatus }) => {
  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 border-b border-white/10 bg-[#090b10]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-purple-500/20 shrink-0">
            <div className="w-full h-full bg-[#0d101d] rounded-[11px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400 fill-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white">
                ReelCraft <span className="text-purple-400">AI</span>
              </span>
              <span className="hidden xs:inline-block px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                3–4hr ➔ 30–90s Shorts
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Auto-extracts viral moments with 9:16 vertical crop & kinetic captions
            </p>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Engine Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${serverStatus ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'}`}></span>
            <span>{serverStatus ? 'FFmpeg Online' : 'Browser Engine'}</span>
          </div>

          {/* Gemini API Key Button */}
          <button
            onClick={onOpenKeyModal}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 border border-purple-500/30 transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden sm:inline">{apiKey ? 'Gemini Key Configured' : 'Set Gemini Key'}</span>
            <span className="sm:hidden">{apiKey ? 'Key Active' : 'API Key'}</span>
            {apiKey && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />}
          </button>
        </div>
      </div>
    </header>
  );
};
