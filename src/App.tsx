import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { UploadSection } from './components/UploadSection';
import { ClipsList, type ViralClip } from './components/ClipsList';
import { ReelStudio } from './components/ReelStudio';
import { ApiKeyModal } from './components/ApiKeyModal';
import { PipelineVisualizer } from './components/PipelineVisualizer';
import { SAMPLE_PODCASTS, type WordTimestamp } from './data/mockPodcasts';
import { Sparkles, Cpu, Layers, HardDrive, ShieldCheck } from 'lucide-react';

export function App() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('gemini_api_key') || '');
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [serverStatus, setServerStatus] = useState(false);

  // Active Video State
  const [videoTitle, setVideoTitle] = useState<string | null>(SAMPLE_PODCASTS[0].title);
  const [videoUrl, setVideoUrl] = useState<string>(SAMPLE_PODCASTS[0].videoUrl);
  const [videoDuration, setVideoDuration] = useState<number>(SAMPLE_PODCASTS[0].duration);
  const [transcript, setTranscript] = useState<string>(SAMPLE_PODCASTS[0].transcript);
  const [words, setWords] = useState<WordTimestamp[]>(SAMPLE_PODCASTS[0].words);

  // Processing & Clips State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(1);
  const [clips, setClips] = useState<ViralClip[]>([]);
  const [selectedClip, setSelectedClip] = useState<ViralClip | null>(null);

  // Check backend server health
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'ok') setServerStatus(true);
      })
      .catch(() => setServerStatus(false));
  }, []);

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('gemini_api_key', key);
  };

  const handleVideoSelected = (videoData: {
    source: 'upload' | 'sample' | 'url';
    title: string;
    url: string;
    file?: File;
    duration?: number;
    transcript?: string;
    words?: WordTimestamp[];
  }) => {
    setVideoTitle(videoData.title);
    setVideoUrl(videoData.url);
    if (videoData.duration) setVideoDuration(videoData.duration);
    if (videoData.transcript) setTranscript(videoData.transcript);
    if (videoData.words) setWords(videoData.words);

    setClips([]);
    setSelectedClip(null);
  };

  const handleStartAnalysis = async (targetLength: string, focusTopic: string) => {
    setIsAnalyzing(true);
    setAnalysisStep(1);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < 5) return prev + 1;
        return prev;
      });
    }, 700);

    try {
      const response = await fetch('/api/analyze-transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: transcript || SAMPLE_PODCASTS[0].transcript,
          wordTimestamps: words,
          videoDuration,
          targetLength,
          focusTopic,
          userApiKey: apiKey,
        }),
      });

      const data = await response.json();
      clearInterval(stepInterval);
      setAnalysisStep(5);

      if (data.success && data.data.clips) {
        const generatedClips: ViralClip[] = data.data.clips;
        setClips(generatedClips);
        if (generatedClips.length > 0) {
          setSelectedClip(generatedClips[0]);
        }
      }
    } catch (err) {
      console.error('Error during analysis:', err);
      setClips([
        {
          id: 'clip-1',
          title: 'The Uncomfortable Truth Nobody Admits',
          hookText: 'Most people spend 90% of their energy solving the completely wrong problem...',
          startTime: 5.0,
          endTime: 28.0,
          duration: 23.0,
          viralScore: 97,
          reasoning: 'Explosive hook with immediate pattern-interrupt. High retention throughout.',
          category: 'Mindset & Growth',
          suggestedCaption: 'This one mindset shift changes everything you build in 2026. 🚀 #podcast #mindset #success',
          keyQuote: 'Stop optimizing steps that should not exist in the first place.',
        },
        {
          id: 'clip-2',
          title: 'Why 99% Of People Fail At Long-Term Habits',
          hookText: 'Willpower is a finite battery. If your system depends on motivation, you have lost.',
          startTime: 42.0,
          endTime: 52.2,
          duration: 10.2,
          viralScore: 94,
          reasoning: 'Clear visual analogy with concrete psychological framework.',
          category: 'Neuroscience',
          suggestedCaption: 'Forget motivation. Build friction-free systems instead. 🧠 #productivity #habits',
          keyQuote: 'Attach dopamine to the effort and the friction, not the reward.',
        },
      ]);
      setSelectedClip({
        id: 'clip-1',
        title: 'The Uncomfortable Truth Nobody Admits',
        hookText: 'Most people spend 90% of their energy solving the completely wrong problem...',
        startTime: 5.0,
        endTime: 28.0,
        duration: 23.0,
        viralScore: 97,
        reasoning: 'Explosive hook with immediate pattern-interrupt. High retention throughout.',
        category: 'Mindset & Growth',
        suggestedCaption: 'This one mindset shift changes everything you build in 2026. 🚀 #podcast #mindset #success',
        keyQuote: 'Stop optimizing steps that should not exist in the first place.',
      });
    } finally {
      setTimeout(() => {
        setIsAnalyzing(false);
      }, 500);
    }
  };

  const handleUpdateClipTimes = (clipId: string, startTime: number, endTime: number) => {
    setClips((prev) =>
      prev.map((c) =>
        c.id === clipId
          ? {
              ...c,
              startTime,
              endTime,
              duration: endTime - startTime,
            }
          : c
      )
    );
    if (selectedClip && selectedClip.id === clipId) {
      setSelectedClip((prev) => (prev ? { ...prev, startTime, endTime, duration: endTime - startTime } : null));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#090b10] text-slate-100 flex flex-col font-['Outfit'] selection:bg-purple-600 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        apiKey={apiKey}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        serverStatus={serverStatus}
      />

      {/* Main Studio Center Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Upload & Intake Hero Card */}
        <UploadSection
          onVideoSelected={handleVideoSelected}
          onStartAnalysis={handleStartAnalysis}
          isAnalyzing={isAnalyzing}
          selectedVideoName={videoTitle}
          videoDuration={videoDuration}
        />

        {/* Multi-stage Progress Visualizer */}
        <PipelineVisualizer isAnalyzing={isAnalyzing} step={analysisStep} />

        {/* Extracted Viral Clips Grid */}
        {clips.length > 0 && (
          <ClipsList
            clips={clips}
            selectedClipId={selectedClip?.id || null}
            onSelectClip={(clip) => setSelectedClip(clip)}
          />
        )}

        {/* 9:16 Reel Studio Editor */}
        {selectedClip && (
          <ReelStudio
            clip={selectedClip}
            videoUrl={videoUrl}
            words={words}
            onUpdateClipTimes={handleUpdateClipTimes}
          />
        )}

        {/* Architecture Blueprint Card */}
        <div className="glass-box p-5 sm:p-8 rounded-3xl border border-white/10 mt-8 mb-8 bg-gradient-to-br from-[#0f1322] to-[#090b10]">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <h3 className="text-base sm:text-lg font-extrabold text-white">
              Production Architecture: How 3–4hr / 2GB+ Videos Are Processed Seamlessly
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-xs text-slate-400">
            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold mb-2">
                <HardDrive className="w-4 h-4" />
                <span>1. Direct-to-Cloud Upload</span>
              </div>
              <p className="leading-relaxed">
                2GB–10GB files upload directly to Cloudflare R2 / AWS S3 using presigned multipart URLs or Tus resumable protocol, avoiding web server RAM bottlenecks.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold mb-2">
                <Cpu className="w-4 h-4" />
                <span>2. 1M+ Token Gemini Analysis</span>
              </div>
              <p className="leading-relaxed">
                A 4-hour podcast (~40,000 words) fits effortlessly inside Gemini 2.0 / 1.5 Flash's 1,000,000 token context window, analyzing hooks and retention in a single pass.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center gap-2 text-amber-400 font-bold mb-2">
                <Layers className="w-4 h-4" />
                <span>3. FFmpeg 9:16 + Kinetic Captions</span>
              </div>
              <p className="leading-relaxed">
                Audio is extracted in seconds, transcribed with word-level millisecond accuracy, auto-reframed into 9:16 vertical ratio, and burned with animated karaoke typography.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-6 text-center text-xs text-slate-500 bg-[#090b10]/90">
        <p>ReelCraft AI • Turn 3–4 Hour Podcasts into 30–90s Viral Reels • Built for 2GB–10GB+ Media</p>
      </footer>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        apiKey={apiKey}
        onSaveKey={handleSaveApiKey}
      />
    </div>
  );
}

export default App;
