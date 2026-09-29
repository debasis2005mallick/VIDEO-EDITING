import React from 'react';
import { Zap, Bot, ShieldCheck, Cpu, SlidersHorizontal } from 'lucide-react';
import type { AiConfig } from './AiSettingsModal';

interface NavbarProps {
  aiConfig: AiConfig;
  onOpenAiModal: () => void;
  serverStatus: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ aiConfig, onOpenAiModal, serverStatus }) => {
  const getProviderBadge = () => {
    switch (aiConfig.provider) {
      case 'gemini':
        return { name: 'Gemini 2.0 / 1.5', icon: '✨', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
      case 'openai':
        return { name: 'OpenAI GPT-4o', icon: '⚡', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
      case 'claude':
        return { name: 'Claude 3.5 Sonnet', icon: '🧠', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
      case 'groq':
        return { name: 'DeepSeek / Groq', icon: '🚀', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
      default:
        return { name: 'AI Engine', icon: '🤖', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    }
  };

  const badge = getProviderBadge();
  const hasActiveKey = Boolean(aiConfig?.keys && aiConfig?.provider && aiConfig.keys[aiConfig.provider]);

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-8 py-3.5 border-b border-white/10 bg-[#06070a]/90 backdrop-blur-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-500 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-500/25 shrink-0">
            <div className="w-full h-full bg-[#0b0e17] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-purple-400 fill-purple-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white font-['Plus_Jakarta_Sans']">
                ReelCraft <span className="text-purple-400">AI</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 font-mono">
                3–4HR ➔ 9:16 REELS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Auto-cuts long podcast videos into 30–90s viral shorts with kinetic subtitles
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* FFmpeg Engine Status */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs text-slate-300">
            <span className={`w-2 h-2 rounded-full ${serverStatus ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'}`}></span>
            <span className="font-medium">{serverStatus ? 'FFmpeg Online' : 'Browser Engine'}</span>
          </div>

          {/* AI Settings Modal Trigger */}
          <button
            type="button"
            onClick={onOpenAiModal}
            className={`flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer hover:brightness-110 shadow-sm ${badge.color}`}
          >
            <span>{badge.icon}</span>
            <span>{badge.name}</span>
            {hasActiveKey ? (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <SlidersHorizontal className="w-3.5 h-3.5 opacity-70 shrink-0" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
