import React, { useState, useEffect } from 'react';
import { 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ExternalLink, 
  Loader2, 
  Sparkles, 
  Trash2, 
  Zap, 
  Cpu,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  RefreshCw
} from 'lucide-react';
import { 
  getStoredApiKey, 
  saveStoredApiKey, 
  getStoredProvider, 
  saveStoredProvider, 
  getStoredModel, 
  saveStoredModel, 
  testConnection, 
  checkServerShield,
  PROVIDERS, 
  AVAILABLE_GROQ_MODELS, 
  AVAILABLE_GEMINI_MODELS 
} from '../services/aiService';

export default function AiConfigurationModal({ isOpen, onClose, onKeyUpdated }) {
  const [provider, setProvider] = useState(PROVIDERS.GEMINI);
  const [selectedModel, setSelectedModel] = useState('gemini-2.5-flash');
  const [apiKey, setApiKey] = useState('');
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);
  const [serverActive, setServerActive] = useState(true);
  const [showAdvancedByok, setShowAdvancedByok] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const currentKey = getStoredApiKey();
      setApiKey(currentKey);
      const currentProvider = getStoredProvider();
      setProvider(currentProvider);
      setSelectedModel(getStoredModel());
      setTestStatus(null);
      checkServerShield().then((s) => setServerActive(Boolean(s?.online)));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleProviderChange = (newProvider) => {
    setProvider(newProvider);
    setTestStatus(null);
    if (newProvider === PROVIDERS.GROQ) {
      setSelectedModel('llama-3.3-70b-versatile');
    } else {
      setSelectedModel('gemini-2.5-flash');
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setTestStatus(null);
    try {
      const res = await testConnection(apiKey.trim(), provider, selectedModel);
      setTestStatus({ 
        success: true, 
        message: `Success! Engine verified: ${res.provider} (${res.activeModel}).` 
      });
    } catch (err) {
      setTestStatus({ 
        success: false, 
        message: err.message || 'Connection test failed.' 
      });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveStoredProvider(provider);
    saveStoredModel(selectedModel);
    if (apiKey.trim()) {
      saveStoredApiKey(apiKey.trim());
    }
    if (onKeyUpdated) onKeyUpdated(apiKey.trim() || 'global-cloud-active');
    onClose();
  };

  const handleRemoveKey = () => {
    saveStoredApiKey('');
    setApiKey('');
    setTestStatus(null);
    if (onKeyUpdated) onKeyUpdated('global-cloud-active');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 text-amber-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base">AI Engine & Model Selection</h3>
              <p className="text-xs text-indigo-200 font-medium">Select LLM Engine with Auto-Fallbacks</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Cloud Active Status Banner */}
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-950">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <div>
                <p className="font-bold text-emerald-900">Pre-Configured Global Cloud AI: Active</p>
                <p className="text-[11px] text-emerald-700 font-medium">
                  Secret keys stay hidden in backend/Cloudflare. No BYOK required for teachers.
                </p>
              </div>
            </div>
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
          </div>

          {/* Provider Selection Tabs */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select AI Engine
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => handleProviderChange(PROVIDERS.GROQ)}
                className={`p-3 rounded-xl border-2 text-left transition flex items-start gap-2.5 ${
                  provider === PROVIDERS.GROQ
                    ? 'border-amber-500 bg-amber-50/60 ring-1 ring-amber-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm shrink-0">
                  ⚡
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    Groq LPU
                    <span className="text-[9px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.5 rounded">
                      500 tok/s
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Ultra-fast hardware LPUs, zero waiting</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleProviderChange(PROVIDERS.GEMINI)}
                className={`p-3 rounded-xl border-2 text-left transition flex items-start gap-2.5 ${
                  provider === PROVIDERS.GEMINI
                    ? 'border-indigo-600 bg-indigo-50/60 ring-1 ring-indigo-300'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold text-sm shrink-0">
                  ✦
                </div>
                <div>
                  <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                    Google Gemini
                    <span className="text-[9px] bg-indigo-100 text-indigo-800 font-bold px-1.5 py-0.5 rounded">
                      Smart
                    </span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Deep curriculum reasoning & math solutions</p>
                </div>
              </button>
            </div>
          </div>

          {/* Model Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                Select Specific Model
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                Auto-Fallback Protected
              </span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setTestStatus(null);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
            >
              {provider === PROVIDERS.GROQ
                ? AVAILABLE_GROQ_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))
                : AVAILABLE_GEMINI_MODELS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
            </select>
          </div>

          {/* High-Availability Fallback Indicator */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-indigo-600" />
              High-Availability Fallback Mechanism
            </p>
            <p className="text-[11px] text-slate-600">
              If your chosen model experiences high load or a 503 spike, ExamCraft automatically fails over to the next healthy model (e.g. <code>gemini-2.5-flash</code>) so exam generation never gets interrupted.
            </p>
          </div>

          {/* Optional BYOK Accordion (For advanced developers only) */}
          <div className="pt-1 border-t border-slate-200">
            <button
              type="button"
              onClick={() => setShowAdvancedByok(!showAdvancedByok)}
              className="w-full flex items-center justify-between py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-slate-400" />
                Custom API Key Override (Optional Developer BYOK)
              </span>
              {showAdvancedByok ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showAdvancedByok && (
              <div className="mt-2.5 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in duration-100">
                <p className="text-[11px] text-slate-500">
                  The app already has global server keys configured. Only enter a key here if you want to bypass the server and use your private API quota.
                </p>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => {
                    setApiKey(e.target.value);
                    setTestStatus(null);
                  }}
                  placeholder="Leave empty to use built-in global server key"
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-mono outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {apiKey && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={handleRemoveKey}
                      className="text-[11px] text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Clear Custom Key
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Status feedback */}
          {testStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testStatus.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              {testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{testStatus.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={testing}
            onClick={handleTest}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl shadow-2xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> : <Zap className="w-3.5 h-3.5 text-amber-500" />}
            <span>Test Connection</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition"
            >
              Save Model Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
