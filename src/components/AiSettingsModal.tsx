import React, { useState } from 'react';
import { X, Sparkles, Key, Check, ExternalLink, Cpu, Bot } from 'lucide-react';

export type AiProvider = 'gemini' | 'openai' | 'claude' | 'groq';

export interface AiConfig {
  provider: AiProvider;
  model: string;
  keys: {
    gemini: string;
    openai: string;
    claude: string;
    groq: string;
  };
}

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AiConfig;
  onSaveConfig: (newConfig: AiConfig) => void;
}

const PROVIDERS: {
  id: AiProvider;
  name: string;
  icon: string;
  models: { id: string; name: string; tag: string }[];
  keyUrl: string;
  placeholder: string;
}[] = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    icon: '✨',
    models: [
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash', tag: '1M Context • Recommended' },
      { id: 'gemini-2.0-flash', name: 'Gemini 2.0 Flash', tag: 'Fastest Multimodal' },
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', tag: 'Deep Reasoning' },
    ],
    keyUrl: 'https://aistudio.google.com/app/apikey',
    placeholder: 'AIzaSy...',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    icon: '⚡',
    models: [
      { id: 'gpt-4o', name: 'GPT-4o', tag: 'Flagship Intelligence' },
      { id: 'gpt-4o-mini', name: 'GPT-4o Mini', tag: 'Fast & Affordable' },
    ],
    keyUrl: 'https://platform.openai.com/api-keys',
    placeholder: 'sk-proj-...',
  },
  {
    id: 'claude',
    name: 'Anthropic Claude',
    icon: '🧠',
    models: [
      { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet', tag: 'Top Storytelling' },
      { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku', tag: 'Ultra-fast' },
    ],
    keyUrl: 'https://console.anthropic.com/settings/keys',
    placeholder: 'sk-ant-...',
  },
  {
    id: 'groq',
    name: 'Groq (DeepSeek / Llama)',
    icon: '🚀',
    models: [
      { id: 'deepseek-r1-distill-llama-70b', name: 'DeepSeek R1 Distill', tag: 'Viral Reasoning' },
      { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B', tag: 'Ultra Low Latency' },
    ],
    keyUrl: 'https://console.groq.com/keys',
    placeholder: 'gsk_...',
  },
];

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [selectedProvider, setSelectedProvider] = useState<AiProvider>(config.provider);
  const [selectedModel, setSelectedModel] = useState<string>(config.model);
  const [keys, setKeys] = useState(config.keys);

  if (!isOpen) return null;

  const currentProviderObj = PROVIDERS.find((p) => p.id === selectedProvider) || PROVIDERS[0];

  const handleProviderChange = (pId: AiProvider) => {
    setSelectedProvider(pId);
    const pObj = PROVIDERS.find((p) => p.id === pId);
    if (pObj && pObj.models.length > 0) {
      setSelectedModel(pObj.models[0].id);
    }
  };

  const handleSave = () => {
    onSaveConfig({
      provider: selectedProvider,
      model: selectedModel,
      keys,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f131f] border border-white/20 w-full max-w-xl p-6 sm:p-8 rounded-3xl shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-white">AI Engine & API Settings</h3>
            <p className="text-xs text-slate-400">
              Choose your preferred AI brain for podcast context & viral moment extraction
            </p>
          </div>
        </div>

        {/* Provider Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
          {PROVIDERS.map((p) => {
            const isSelected = selectedProvider === p.id;
            const hasKey = !!keys[p.id];
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProviderChange(p.id)}
                className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-purple-600/30 border-purple-500 ring-2 ring-purple-500/40 text-white'
                    : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg">{p.icon}</span>
                  {hasKey && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </div>
                <span className="text-xs font-bold truncate">{p.name}</span>
              </button>
            );
          })}
        </div>

        {/* Model Selection */}
        <div className="mb-5">
          <label className="text-xs font-bold text-slate-300 block mb-2 uppercase tracking-wider">
            Select {currentProviderObj.name} Model
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {currentProviderObj.models.map((m) => (
              <div
                key={m.id}
                onClick={() => setSelectedModel(m.id)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  selectedModel === m.id
                    ? 'bg-purple-950/60 border-purple-500 text-white ring-1 ring-purple-500/50'
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">{m.name}</span>
                  {selectedModel === m.id && <Check className="w-3.5 h-3.5 text-purple-400" />}
                </div>
                <span className="text-[10px] text-purple-300 block mt-0.5">{m.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* API Key Input */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {currentProviderObj.name} API Key
            </label>
            <a
              href={currentProviderObj.keyUrl}
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
            >
              <span>Get Free {currentProviderObj.name} Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="relative">
            <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="password"
              value={keys[selectedProvider] || ''}
              onChange={(e) =>
                setKeys({
                  ...keys,
                  [selectedProvider]: e.target.value.trim(),
                })
              }
              placeholder={currentProviderObj.placeholder}
              className="w-full pl-10 pr-4 py-2.5 bg-[#0a0d16] border border-white/10 rounded-xl text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition-all"
            />
          </div>
          <span className="text-[11px] text-slate-500 block mt-1.5">
            Keys are stored securely in your local browser storage.
          </span>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-xs font-bold text-white transition-all cursor-pointer shadow-lg shadow-purple-600/30"
          >
            Save & Activate
          </button>
        </div>
      </div>
    </div>
  );
};
