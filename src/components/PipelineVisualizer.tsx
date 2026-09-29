import React from 'react';
import { Radio, Mic, Cpu, Film, Sparkles, CheckCircle2 } from 'lucide-react';

interface PipelineVisualizerProps {
  isAnalyzing: boolean;
  step: number;
}

export const PipelineVisualizer: React.FC<PipelineVisualizerProps> = ({ isAnalyzing, step }) => {
  if (!isAnalyzing) return null;

  const steps = [
    {
      id: 1,
      title: 'Audio Demuxing',
      desc: '128kbps stream (~120MB from 4GB)',
      icon: Radio,
    },
    {
      id: 2,
      title: 'Whisper Transcribe',
      desc: 'Word-level millisecond timing',
      icon: Mic,
    },
    {
      id: 3,
      title: 'Gemini 1M+ Analysis',
      desc: '3s hook & retention index',
      icon: Cpu,
    },
    {
      id: 4,
      title: '9:16 Face Re-framing',
      desc: 'Active speaker tracking',
      icon: Film,
    },
    {
      id: 5,
      title: 'Kinetic Subtitles',
      desc: 'Animated karaoke burn',
      icon: Sparkles,
    },
  ];

  return (
    <div className="glass-box p-5 sm:p-6 rounded-3xl border border-purple-500/40 bg-purple-950/30 mb-8 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-3 h-3 rounded-full bg-purple-400 animate-ping" />
        <h3 className="text-base sm:text-lg font-extrabold text-white">
          AI Reel Generation Pipeline in Progress...
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
        {steps.map((s, idx) => {
          const isDone = step > s.id;
          const isCurrent = step === s.id;
          const Icon = s.icon;

          return (
            <div
              key={s.id}
              className={`p-3.5 rounded-2xl border transition-all ${
                isCurrent
                  ? 'bg-purple-600/30 border-purple-500 shadow-lg shadow-purple-500/30 scale-102'
                  : isDone
                  ? 'bg-emerald-950/30 border-emerald-500/40'
                  : 'bg-white/[0.02] border-white/5 opacity-50'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                    isCurrent
                      ? 'bg-purple-600 text-white'
                      : isDone
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/5 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                {isDone ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : isCurrent ? (
                  <div className="w-3.5 h-3.5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">0{idx + 1}</span>
                )}
              </div>

              <h4 className="text-xs font-bold text-white mb-0.5">{s.title}</h4>
              <p className="text-[10px] text-slate-400 leading-tight">{s.desc}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
