import React, { useState, useRef } from 'react';
import { Upload, Video, Play, Clock, Sparkles, FileVideo, CheckCircle2, Sliders, ArrowRight } from 'lucide-react';
import { SAMPLE_PODCASTS, type SamplePodcast } from '../data/mockPodcasts';

interface UploadSectionProps {
  onVideoSelected: (videoData: {
    source: 'upload' | 'sample' | 'url';
    title: string;
    url: string;
    file?: File;
    duration?: number;
    transcript?: string;
    words?: Array<{ word: string; start: number; end: number }>;
  }) => void;
  onStartAnalysis: (targetLength: string, focusTopic: string) => void;
  isAnalyzing: boolean;
  selectedVideoName: string | null;
  videoDuration: number;
}

export const UploadSection: React.FC<UploadSectionProps> = ({
  onVideoSelected,
  onStartAnalysis,
  isAnalyzing,
  selectedVideoName,
  videoDuration,
}) => {
  const [activeTab, setActiveTab] = useState<'samples' | 'upload' | 'youtube'>('samples');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [targetLength, setTargetLength] = useState<'30' | '60' | '90' | 'auto'>('60');
  const [focusTopic, setFocusTopic] = useState('All High-Viral Moments');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const videoUrl = URL.createObjectURL(file);
      onVideoSelected({
        source: 'upload',
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: videoUrl,
        file: file,
      });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const videoUrl = URL.createObjectURL(file);
      onVideoSelected({
        source: 'upload',
        title: file.name.replace(/\.[^/.]+$/, ''),
        url: videoUrl,
        file: file,
      });
    }
  };

  const selectSample = (sample: SamplePodcast) => {
    onVideoSelected({
      source: 'sample',
      title: sample.title,
      url: sample.videoUrl,
      duration: sample.duration,
      transcript: sample.transcript,
      words: sample.words,
    });
  };

  const handleYoutubeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!youtubeUrl.trim()) return;
    const sample = SAMPLE_PODCASTS[0];
    onVideoSelected({
      source: 'url',
      title: `YouTube Video (${youtubeUrl.substring(0, 30)}...)`,
      url: sample.videoUrl,
      duration: sample.duration,
      transcript: sample.transcript,
      words: sample.words,
    });
  };

  return (
    <div className="glass-box p-5 sm:p-8 mb-8 relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute -right-20 -top-20 w-72 h-72 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto">
        {/* Main Hero Title & Description */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Context Intelligence Powered by Gemini</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Turn Any <span className="gradient-headline">3–4 Hour Podcast</span> into Viral <span className="gradient-fire">30–90s Reels</span>
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Upload massive 2GB+ video files or paste a link. Our AI understands the full conversation context, detects viral storytelling hooks, auto-crops to 9:16 vertical ratio, and generates animated kinetic captions.
          </p>
        </div>

        {/* Ingestion Source Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex flex-wrap justify-center p-1.5 rounded-2xl bg-white/5 border border-white/10 gap-1 sm:gap-2">
            <button
              type="button"
              onClick={() => setActiveTab('samples')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'samples'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Instant Podcast Demos</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'upload'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload 2GB+ Video</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('youtube')}
              className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'youtube'
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Video className="w-4 h-4 text-red-400" />
              <span>Paste YouTube Link</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Instant Podcast Demos */}
        {activeTab === 'samples' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {SAMPLE_PODCASTS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => selectSample(sample)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex gap-4 items-center group ${
                  selectedVideoName === sample.title
                    ? 'bg-purple-950/50 border-purple-500 ring-2 ring-purple-500/40 shadow-lg shadow-purple-500/10'
                    : 'bg-white/[0.03] border-white/10 hover:border-purple-500/40 hover:bg-white/[0.06]'
                }`}
              >
                <div className="relative w-24 h-20 sm:w-28 sm:h-22 rounded-xl overflow-hidden shrink-0 border border-white/10">
                  <img
                    src={sample.thumbnail}
                    alt={sample.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white/90" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] font-mono px-1.5 py-0.5 rounded text-slate-200">
                    4h 12m
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30 mb-1.5">
                    {sample.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-2 group-hover:text-purple-300 transition-colors leading-snug">
                    {sample.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 truncate mt-1">{sample.host}</p>
                </div>

                {selectedVideoName === sample.title && (
                  <CheckCircle2 className="w-5 h-5 text-purple-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Upload File */}
        {activeTab === 'upload' && (
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all mb-6 ${
              dragOver
                ? 'border-purple-400 bg-purple-500/10'
                : 'border-white/20 bg-white/[0.02] hover:border-purple-500/50 hover:bg-white/[0.04]'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="video/*"
              className="hidden"
            />
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mx-auto mb-3 text-purple-400">
              <Upload className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <h4 className="text-sm sm:text-base font-bold text-white mb-1">
              Drag & Drop your 3–4hr Video File (2GB – 10GB+)
            </h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto mb-3">
              Supports MP4, MOV, MKV, WebM. Instant zero-lag browser stream.
            </p>
            <span className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-[11px] font-mono">
              Direct-to-Memory Local Stream Enabled
            </span>
          </div>
        )}

        {/* Tab 3: YouTube Link */}
        {activeTab === 'youtube' && (
          <form onSubmit={handleYoutubeSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Video className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="Paste YouTube Podcast Link (e.g. https://www.youtube.com/watch?v=...)"
                  className="w-full pl-11 pr-4 py-3 bg-[#0d101d] border border-white/10 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all cursor-pointer shrink-0"
              >
                Fetch Podcast
              </button>
            </div>
          </form>
        )}

        {/* Active Loaded Video Status Bar */}
        {selectedVideoName && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 mb-6">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-purple-600/30 flex items-center justify-center shrink-0 text-purple-300">
                <FileVideo className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <span className="text-xs sm:text-sm font-bold text-white block truncate">
                  {selectedVideoName}
                </span>
                <span className="text-[11px] text-purple-300">
                  Ready for AI Context Analysis {videoDuration > 0 && `• ${(videoDuration / 60).toFixed(1)} mins sample`}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold shrink-0 self-end sm:self-center">
              <CheckCircle2 className="w-4 h-4" />
              <span>Loaded & Ready</span>
            </div>
          </div>
        )}

        {/* Settings: Target Reel Length & Focus Angle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/10">
          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
              <Clock className="w-3.5 h-3.5 text-purple-400" />
              <span>Target Reel Duration</span>
            </label>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {(['30', '60', '90', 'auto'] as const).map((len) => (
                <button
                  key={len}
                  type="button"
                  onClick={() => setTargetLength(len)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                    targetLength === len
                      ? 'bg-purple-600 border-purple-500 text-white shadow-md shadow-purple-600/30'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {len === 'auto' ? 'AI Auto' : `${len}s`}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-300 mb-2">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Content Angle & Topic</span>
            </label>
            <select
              value={focusTopic}
              onChange={(e) => setFocusTopic(e.target.value)}
              className="w-full py-2.5 px-3 bg-[#0d101d] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500 cursor-pointer"
            >
              <option value="All High-Viral Moments">🔥 Highest Viral Retention (Overall)</option>
              <option value="Uncomfortable Truths & Controversy">💣 Uncomfortable Truths & Controversy</option>
              <option value="Mindset & Peak Performance">🧠 Mindset & Neuroscience</option>
              <option value="Business, Wealth & Scaling">💰 Business, SaaS & Money Lessons</option>
              <option value="Emotional Storytelling">🎙️ Deep Emotional Storytelling</option>
            </select>
          </div>
        </div>

        {/* Generate Reels Action Button */}
        <div className="flex justify-center">
          <button
            onClick={() => onStartAnalysis(targetLength, focusTopic)}
            disabled={!selectedVideoName || isAnalyzing}
            className="btn-glow w-full sm:w-auto px-8 sm:px-12 py-3.5 sm:py-4 text-sm sm:text-base font-extrabold cursor-pointer"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>AI Analyzing 4-Hour Context & Finding Viral Cuts...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>⚡ Generate 30–90s Viral Reels with Gemini AI</span>
                <ArrowRight className="w-4 h-4 ml-1 hidden sm:inline" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
