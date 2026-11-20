import React, { useState, useEffect } from 'react';
import { Key, CheckCircle2, AlertCircle, X, ExternalLink, Loader2, Sparkles, Trash2, Cpu } from 'lucide-react';
import { 
  getStoredApiKey, 
  saveStoredApiKey, 
  testGeminiApiKey, 
  getStoredModel, 
  saveStoredModel,
  AVAILABLE_MODELS 
} from '../services/geminiService';

export default function GeminiApiKeyModal({ isOpen, onClose, onKeyUpdated }) {
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-4-hydrogen');
  const [customModel, setCustomModel] = useState('');
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setApiKey(getStoredApiKey());
      const stored = getStoredModel();
      const existsInList = AVAILABLE_MODELS.some(m => m.id === stored);
      if (existsInList) {
        setSelectedModel(stored);
      } else {
        setSelectedModel('custom');
        setCustomModel(stored);
      }
      setTestStatus(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeModelId = selectedModel === 'custom' ? (customModel.trim() || 'gemini-4-hydrogen') : selectedModel;

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setTestStatus({ success: false, message: 'Please enter a Gemini API Key first.' });
      return;
    }

    setTesting(true);
    setTestStatus(null);
    try {
      const res = await testGeminiApiKey(apiKey.trim(), activeModelId);
      setTestStatus({ 
        success: true, 
        message: `Connection successful! Active model: ${res.activeModel || activeModelId}.` 
      });
    } catch (err) {
      setTestStatus({ success: false, message: err.message || 'Connection failed. Check your API key.' });
    } finally {
      setTesting(false);
    }
  };

  const handleSave = () => {
    saveStoredApiKey(apiKey.trim());
    saveStoredModel(activeModelId);
    if (onKeyUpdated) onKeyUpdated(apiKey.trim());
    onClose();
  };

  const handleRemove = () => {
    saveStoredApiKey('');
    setApiKey('');
    setTestStatus(null);
    if (onKeyUpdated) onKeyUpdated('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base">Gemini AI Model & API Configuration</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Configure your Gemini model and API key. Powered by Google's cutting-edge reasoning engines.
          </p>

          {/* Model Selection Dropdown */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>Selected Gemini Model</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Gemini 4 Ready
              </span>
            </label>
            <select
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setTestStatus(null);
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {AVAILABLE_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
              <option value="custom">Custom Model ID...</option>
            </select>

            {selectedModel === 'custom' && (
              <input
                type="text"
                value={customModel}
                onChange={(e) => setCustomModel(e.target.value)}
                placeholder="Enter model string, e.g. gemini-4-hydrogen"
                className="mt-2 w-full px-3.5 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            )}

            <p className="text-[11px] text-slate-500 mt-1">
              Active Model: <code className="text-indigo-600 font-semibold">{activeModelId}</code>
            </p>
          </div>

          {/* API Key Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type="password"
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setTestStatus(null);
                }}
                placeholder="AIzaSy..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 font-mono outline-none"
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs">
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-600 hover:text-indigo-800 font-medium inline-flex items-center gap-1 hover:underline"
              >
                <span>Get a Free API Key from Google AI Studio</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {apiKey && (
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove Key
                </button>
              )}
            </div>
          </div>

          {/* Test Status feedback */}
          {testStatus && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                testStatus.success
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800 font-medium'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              {testStatus.success ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              )}
              <span>{testStatus.message}</span>
            </div>
          )}
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            disabled={testing || !apiKey.trim()}
            onClick={handleTest}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl shadow-2xs transition flex items-center gap-1.5 disabled:opacity-40"
          >
            {testing ? <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" /> : <Key className="w-3.5 h-3.5" />}
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
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
