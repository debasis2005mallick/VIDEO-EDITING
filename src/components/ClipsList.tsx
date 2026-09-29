import React, { useState } from 'react';
import { Flame, Clock, Copy, Check, Scissors, Quote, Sparkles, ArrowRight } from 'lucide-react';
import { formatTime } from '../utils/formatTime';

export interface ViralClip {
  id: string;
  title: string;
  hookText: string;
  startTime: number;
  endTime: number;
  duration: number;
  viralScore: number;
  reasoning: string;
  category: string;
  suggestedCaption: string;
  keyQuote: string;
}

interface ClipsListProps {
  clips: ViralClip[];
  selectedClipId: string | null;
  onSelectClip: (clip: ViralClip) => void;
}

export const ClipsList: React.FC<ClipsListProps> = ({
  clips,
  selectedClipId,
  onSelectClip,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyCaption = (clip: ViralClip, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${clip.title}\n\n${clip.suggestedCaption}`);
    setCopiedId(clip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (clips.length === 0) return null;

  return (
    <div className="mb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white">
              AI Extracted Viral Reels ({clips.length})
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Selected from deep context analysis based on 3-second hook strength, storytelling arc, and viral retention index
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {clips.map((clip) => {
          const isSelected = selectedClipId === clip.id;
          const isEpic = clip.viralScore >= 95;

          return (
            <div
              key={clip.id}
              onClick={() => onSelectClip(clip)}
              className={`glass-panel p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/40 shadow-2xl shadow-purple-500/20'
                  : 'hover:border-purple-500/40 hover:bg-white/[0.05]'
              }`}
            >
              {/* Card Header: Virality Score & Category */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`virality-pill ${isEpic ? 'epic' : 'high'}`}>
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    <span>{clip.viralScore}/100 Virality</span>
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300 bg-purple-950/70 border border-purple-500/30 px-2.5 py-0.5 rounded-full">
                    {clip.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-sm sm:text-base font-bold text-white mb-2.5 group-hover:text-purple-300 transition-colors leading-snug">
                  {clip.title}
                </h3>

                {/* 3s Hook preview */}
                <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 mb-3 text-xs text-slate-300 leading-relaxed">
                  <span className="text-purple-400 font-bold block text-[10px] uppercase tracking-wider mb-1">
                    ⚡ 3s Opening Hook
                  </span>
                  "{clip.hookText}"
                </div>

                {/* Key Quote */}
                {clip.keyQuote && (
                  <div className="flex items-start gap-1.5 text-[11px] text-amber-300/90 italic mb-4">
                    <Quote className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>"{clip.keyQuote}"</span>
                  </div>
                )}
              </div>

              {/* Card Footer: Duration & Open Studio */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-3 mb-3 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{clip.duration.toFixed(1)}s Reel</span>
                  </span>
                  <span className="text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-md">
                    {formatTime(clip.startTime)} ➔ {formatTime(clip.endTime)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectClip(clip)}
                    className="flex-1 py-2.5 px-3 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-md shadow-purple-600/30"
                  >
                    <Scissors className="w-3.5 h-3.5" />
                    <span>Open in 9:16 Studio</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => copyCaption(clip, e)}
                    title="Copy caption and hashtags"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer shrink-0"
                  >
                    {copiedId === clip.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
