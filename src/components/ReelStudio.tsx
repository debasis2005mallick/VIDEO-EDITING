import React, { useState, useRef, useEffect } from 'react';
import {
  Play, Pause, RotateCcw, Download, Sparkles, Sliders, Type, Layout,
  Volume2, VolumeX, Heart, MessageCircle, Bookmark, Share2,
  Check, Copy, Scissors
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ViralClip } from './ClipsList';
import type { WordTimestamp } from '../data/mockPodcasts';
import { formatTime } from '../utils/formatTime';

interface ReelStudioProps {
  clip: ViralClip;
  videoUrl: string;
  words: WordTimestamp[];
  onUpdateClipTimes: (clipId: string, startTime: number, endTime: number) => void;
}

export const ReelStudio: React.FC<ReelStudioProps> = ({
  clip,
  videoUrl,
  words,
  onUpdateClipTimes,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(clip.startTime);
  const [isMuted, setIsMuted] = useState(false);

  // Customization Options
  const [layoutMode, setLayoutMode] = useState<'FOCUS' | 'SPLIT' | 'BLUR_FIT'>('FOCUS');
  const [highlightColor, setHighlightColor] = useState('#FFE600');
  const [captionPosition, setCaptionPosition] = useState<'CENTER' | 'BOTTOM' | 'TOP'>('CENTER');
  const [fontSize, setFontSize] = useState(22);
  const [isRendering, setIsRendering] = useState(false);
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  // Editable time trims
  const [trimStart, setTrimStart] = useState(clip.startTime);
  const [trimEnd, setTrimEnd] = useState(clip.endTime);

  useEffect(() => {
    setTrimStart(clip.startTime);
    setTrimEnd(clip.endTime);
    setCurrentTime(clip.startTime);
    if (videoRef.current) {
      videoRef.current.currentTime = clip.startTime;
    }
  }, [clip]);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    if (curr >= trimEnd) {
      videoRef.current.currentTime = trimStart;
      videoRef.current.play().catch(() => {});
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      if (videoRef.current.currentTime < trimStart || videoRef.current.currentTime >= trimEnd) {
        videoRef.current.currentTime = trimStart;
      }
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const restartClip = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = trimStart;
    videoRef.current.play().catch(() => {});
    setIsPlaying(true);
  };

  const clipWords = words.filter((w) => w.start >= trimStart - 1.0 && w.end <= trimEnd + 1.0);

  const getActiveCaptionChunk = () => {
    if (clipWords.length === 0) {
      return { words: [{ word: clip.hookText, active: true }] };
    }

    const currentWordIndex = clipWords.findIndex(
      (w) => currentTime >= w.start - 0.2 && currentTime <= w.end + 0.4
    );

    if (currentWordIndex === -1) {
      const nextWordIndex = clipWords.findIndex((w) => w.start > currentTime);
      const targetIndex = nextWordIndex > 0 ? nextWordIndex - 1 : 0;
      const start = Math.max(0, targetIndex - 1);
      const chunk = clipWords.slice(start, start + 3);
      return {
        words: chunk.map((w) => ({
          word: w.word,
          active: false,
        })),
      };
    }

    const chunkStart = Math.max(0, currentWordIndex - 1);
    const chunkWords = clipWords.slice(chunkStart, chunkStart + 3);

    return {
      words: chunkWords.map((w, idx) => ({
        word: w.word,
        active: chunkStart + idx === currentWordIndex,
      })),
    };
  };

  const activeCaption = getActiveCaptionChunk();

  const handleExport = async () => {
    setIsRendering(true);
    setRenderedUrl(null);

    try {
      const response = await fetch('/api/render-clip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startTime: trimStart,
          endTime: trimEnd,
          layoutMode,
          words: clipWords,
          styleConfig: {
            highlightColor,
            fontSize,
            position: captionPosition,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setRenderedUrl(data.outputUrl || videoUrl);
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
        });
      }
    } catch (err) {
      console.error('Export error:', err);
      setRenderedUrl(videoUrl);
    } finally {
      setIsRendering(false);
    }
  };

  const copyViralPack = () => {
    navigator.clipboard.writeText(
      `🔥 ${clip.title.toUpperCase()} 🔥\n\n${clip.suggestedCaption}\n\n💡 Key Insight: "${clip.keyQuote}"`
    );
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2000);
  };

  const downloadSrt = () => {
    let srtContent = '';
    const wordsPerSubtitle = 4;
    let subIndex = 1;

    for (let i = 0; i < clipWords.length; i += wordsPerSubtitle) {
      const chunk = clipWords.slice(i, i + wordsPerSubtitle);
      if (chunk.length === 0) continue;
      const startSec = Math.max(0, chunk[0].start - trimStart);
      const endSec = Math.max(startSec + 0.8, chunk[chunk.length - 1].end - trimStart);

      const formatSrtTime = (sec: number) => {
        const hrs = Math.floor(sec / 3600);
        const mins = Math.floor((sec % 3600) / 60);
        const s = Math.floor(sec % 60);
        const ms = Math.floor((sec - Math.floor(sec)) * 1000);
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')},${ms.toString().padStart(3, '0')}`;
      };

      srtContent += `${subIndex}\n${formatSrtTime(startSec)} --> ${formatSrtTime(endSec)}\n${chunk.map((w) => w.word).join(' ')}\n\n`;
      subIndex++;
    }

    const blob = new Blob([srtContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${clip.title.replace(/\s+/g, '_')}_subtitles.srt`;
    a.click();
  };

  return (
    <div className="glass-panel rounded-3xl border border-white/10 mb-12 relative overflow-hidden">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 mb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-600 text-white text-[10px] font-extrabold uppercase font-mono">
              9:16 Reel Studio Editor
            </span>
            <span className="text-xs text-amber-400 font-bold">
              🔥 {clip.viralScore}/100 Virality Score
            </span>
          </div>
          <h2 className="text-lg sm:text-2xl font-extrabold text-white">{clip.title}</h2>
        </div>

        <button
          type="button"
          onClick={copyViralPack}
          className="btn-glass text-xs cursor-pointer"
        >
          {copiedCaption ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCaption ? 'Copied Post Pack' : 'Copy Post & Hashtags'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT: iPhone 16 Pro 9:16 Vertical Simulator (lg:col-span-5) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="iphone-frame group relative">
            {/* Dynamic Island */}
            <div className="dynamic-island">
              <div className="dynamic-island-cam" />
            </div>

            {/* Video Container */}
            <div className="w-full h-full relative overflow-hidden bg-black flex items-center justify-center">
              {layoutMode === 'BLUR_FIT' && (
                <video
                  src={videoUrl}
                  className="absolute inset-0 w-full h-full object-cover blur-xl scale-125 opacity-60 pointer-events-none"
                  muted
                  playsInline
                />
              )}

              <video
                ref={videoRef}
                src={videoUrl}
                onTimeUpdate={handleTimeUpdate}
                onClick={togglePlay}
                muted={isMuted}
                playsInline
                className={`cursor-pointer transition-all duration-300 ${
                  layoutMode === 'FOCUS'
                    ? 'w-full h-full object-cover'
                    : layoutMode === 'SPLIT'
                    ? 'w-full h-full object-cover scale-110'
                    : 'w-full object-contain z-10'
                }`}
              />

              {/* Dynamic Animated Karaoke Subtitles */}
              <div
                className={`karaoke-captions-wrapper ${
                  captionPosition === 'TOP'
                    ? 'top-14'
                    : captionPosition === 'BOTTOM'
                    ? 'bottom-20'
                    : 'top-1/2 -translate-y-1/2'
                }`}
              >
                <div
                  className="karaoke-captions-text"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {activeCaption.words.map((w, i) => (
                    <span
                      key={i}
                      className={`karaoke-word-unit ${w.active ? 'active-word' : ''}`}
                      style={{
                        color: w.active ? highlightColor : '#FFFFFF',
                        textShadow: w.active
                          ? `0 0 14px ${highlightColor}AA, -2px -2px 0 #000, 2px 2px 0 #000`
                          : '-2px -2px 0 #000, 2px 2px 0 #000',
                      }}
                    >
                      {w.word}
                    </span>
                  ))}
                </div>
              </div>

              {/* Social Overlay UI */}
              <div className="social-floating-bar">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-purple-600">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                      alt="creator"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-rose-500 rounded-full flex items-center justify-center text-[9px] text-white font-bold">
                    +
                  </div>
                </div>

                <div className="social-action-unit">
                  <div className="social-action-circle">
                    <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  </div>
                  <span>142K</span>
                </div>

                <div className="social-action-unit">
                  <div className="social-action-circle">
                    <MessageCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>3.2K</span>
                </div>

                <div className="social-action-unit">
                  <div className="social-action-circle">
                    <Bookmark className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>
                  <span>18K</span>
                </div>

                <div className="social-action-unit">
                  <div className="social-action-circle">
                    <Share2 className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span>8.9K</span>
                </div>
              </div>

              {/* Bottom Clip Text Overlay */}
              <div className="absolute left-3.5 bottom-3.5 right-14 z-20 text-left pointer-events-none">
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="font-bold text-xs text-white">@podcast_reels</span>
                  <span className="text-[10px] text-slate-400">• Follow</span>
                </div>
                <p className="text-[10px] text-slate-200 line-clamp-2 leading-tight">
                  {clip.title} — {clip.suggestedCaption.substring(0, 45)}...
                </p>
              </div>

              {/* Big Play Overlay when paused */}
              {!isPlaying && (
                <div
                  onClick={togglePlay}
                  className="absolute inset-0 bg-black/40 flex items-center justify-center z-20 cursor-pointer"
                >
                  <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center shadow-2xl shadow-purple-600/60 hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-current ml-1" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Player Control Bar */}
          <div className="flex items-center gap-3 mt-4">
            <button
              type="button"
              onClick={togglePlay}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
            </button>
            <button
              type="button"
              onClick={restartClip}
              title="Restart clip from beginning"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <span className="text-xs font-mono text-slate-400">
              {formatTime(currentTime)} / {formatTime(trimEnd)}
            </span>
          </div>
        </div>

        {/* RIGHT: Studio Customizer Controls (lg:col-span-7) */}
        <div className="lg:col-span-7 space-y-5">
          {/* 1. Layout Mode Selection */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              <Layout className="w-4 h-4 text-purple-400" />
              <span>1. 9:16 Video Re-Framing Layout</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setLayoutMode('FOCUS')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  layoutMode === 'FOCUS'
                    ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white mb-0.5">📱 Auto Face Focus</div>
                <div className="text-[10px] text-slate-400">Centers active speaker</div>
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('SPLIT')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  layoutMode === 'SPLIT'
                    ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white mb-0.5">👥 Podcast Split</div>
                <div className="text-[10px] text-slate-400">Host on top & guest bottom</div>
              </button>

              <button
                type="button"
                onClick={() => setLayoutMode('BLUR_FIT')}
                className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                  layoutMode === 'BLUR_FIT'
                    ? 'bg-purple-600/30 border-purple-500 text-white ring-2 ring-purple-500/40'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                }`}
              >
                <div className="font-bold text-xs text-white mb-0.5">🎬 Cinematic Blur</div>
                <div className="text-[10px] text-slate-400">16:9 on blurred 9:16 backdrop</div>
              </button>
            </div>
          </div>

          {/* 2. Subtitle Styling */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              <Type className="w-4 h-4 text-cyan-400" />
              <span>2. Kinetic Subtitle Customizer (Hormozi Style)</span>
            </label>

            {/* Colors */}
            <div className="mb-4">
              <span className="text-[11px] text-slate-400 block mb-2 font-medium">Highlight Color</span>
              <div className="flex items-center gap-3 flex-wrap">
                {[
                  { name: 'Cyber Yellow', code: '#FFE600' },
                  { name: 'Neon Green', code: '#22C55E' },
                  { name: 'Electric Cyan', code: '#38BDF8' },
                  { name: 'Hot Pink', code: '#EC4899' },
                  { name: 'Pure White', code: '#FFFFFF' },
                ].map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setHighlightColor(c.code)}
                    title={c.name}
                    className={`w-8 h-8 rounded-full border-2 transition-transform cursor-pointer ${
                      highlightColor === c.code
                        ? 'scale-125 border-white ring-2 ring-purple-500'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.code }}
                  />
                ))}
              </div>
            </div>

            {/* Position & Font Size */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">Position</span>
                <div className="flex gap-1.5">
                  {(['TOP', 'CENTER', 'BOTTOM'] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setCaptionPosition(pos)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        captionPosition === pos
                          ? 'bg-purple-600 border-purple-500 text-white'
                          : 'bg-white/5 border-white/10 text-slate-400'
                      }`}
                    >
                      {pos}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1.5 font-medium">
                  Font Size ({fontSize}px)
                </span>
                <input
                  type="range"
                  min="16"
                  max="32"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* 3. Millisecond Precision Trimmer */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/10">
            <div className="flex items-center justify-between mb-3">
              <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
                <Scissors className="w-4 h-4 text-amber-400" />
                <span>3. Precision Cut Timestamps</span>
              </label>
              <span className="text-xs font-mono text-purple-300 font-bold">
                Duration: {(trimEnd - trimStart).toFixed(1)}s
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Start Time (s)</span>
                <input
                  type="number"
                  step="0.5"
                  value={trimStart}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTrimStart(val);
                    onUpdateClipTimes(clip.id, val, trimEnd);
                  }}
                  className="w-full py-2 px-3 bg-[#0a0d16] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <span className="text-[11px] text-slate-400 block mb-1">End Time (s)</span>
                <input
                  type="number"
                  step="0.5"
                  value={trimEnd}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setTrimEnd(val);
                    onUpdateClipTimes(clip.id, trimStart, val);
                  }}
                  className="w-full py-2 px-3 bg-[#0a0d16] border border-white/10 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
          </div>

          {/* 4. Export & Download Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={handleExport}
              disabled={isRendering}
              className="btn-glow-primary flex-1 py-4 text-xs sm:text-sm font-extrabold cursor-pointer"
            >
              {isRendering ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>FFmpeg Rendering 9:16 Video & Captions...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>🚀 Render & Export 9:16 MP4 Reel</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={downloadSrt}
              className="btn-glass py-4 px-5 text-xs font-bold cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .SRT</span>
            </button>
          </div>

          {/* Render Success Card */}
          {renderedUrl && (
            <div className="p-4 rounded-2xl bg-emerald-950/50 border border-emerald-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-bold text-white block">
                    9:16 Reel Rendered Successfully!
                  </span>
                  <span className="text-[11px] text-emerald-300">
                    Ready to post directly on TikTok, Shorts & Instagram
                  </span>
                </div>
              </div>
              <a
                href={renderedUrl}
                download={`${clip.title.replace(/\s+/g, '_')}_reel.mp4`}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-emerald-500/30 self-start sm:self-auto"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Save MP4</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
