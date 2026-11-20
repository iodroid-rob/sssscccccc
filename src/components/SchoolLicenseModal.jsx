import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Key, 
  Building2, 
  CheckCircle2, 
  AlertCircle, 
  Lock, 
  RefreshCw, 
  X, 
  ExternalLink,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { 
  getStoredSchoolLicense, 
  saveStoredSchoolLicense, 
  verifySchoolLicenseOnServer,
  checkServerShield
} from '../services/aiService';

export default function SchoolLicenseModal({ isOpen, onClose, onLicenseUpdated }) {
  const [tokenInput, setTokenInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [schoolInfo, setSchoolInfo] = useState(null);
  const [shieldStatus, setShieldStatus] = useState(null);

  const DEMO_KEYS = [
    { name: 'DPS RK Puram (Enterprise)', key: 'SCH-DPS-2026-X9A' },
    { name: 'DAV Public School (Standard)', key: 'SCH-DAV-2026-B4Z' },
    { name: "St. Xavier's Collegiate", key: 'SCH-STX-2026-M8K' },
    { name: 'Kendriya Vidyalaya (Institutional)', key: 'SCH-KV-2026-Q1R' }
  ];

  useEffect(() => {
    if (isOpen) {
      const current = getStoredSchoolLicense();
      setTokenInput(current);
      checkLicense(current);
    }
  }, [isOpen]);

  async function checkLicense(tokenToTest) {
    setLoading(true);
    setError(null);
    try {
      const [shield, licenseRes] = await Promise.all([
        checkServerShield(),
        verifySchoolLicenseOnServer(tokenToTest)
      ]);

      setShieldStatus(shield);
      if (licenseRes.success) {
        setSchoolInfo(licenseRes.school);
      } else {
        setSchoolInfo(null);
        setError(licenseRes.error || 'Invalid School License Key');
      }
    } catch (err) {
      setError('Could not connect to authentication server');
    } finally {
      setLoading(false);
    }
  }

  function handleSave() {
    if (!tokenInput.trim()) {
      setError('Please provide a school license token');
      return;
    }
    saveStoredSchoolLicense(tokenInput.trim());
    checkLicense(tokenInput.trim());
    if (onLicenseUpdated) onLicenseUpdated(tokenInput.trim());
  }

  function handleSelectDemoKey(k) {
    setTokenInput(k);
    saveStoredSchoolLicense(k);
    checkLicense(k);
    if (onLicenseUpdated) onLicenseUpdated(k);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/20 backdrop-blur-xs shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                School License & Security Shield
              </h3>
              <p className="text-emerald-100 text-xs">
                Commercial Multi-Tenant Authentication & Threat Defense
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Active Tenant Status Card */}
          {schoolInfo ? (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Active License
                  </span>
                  <h4 className="text-base font-bold text-slate-900">{schoolInfo.name}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 font-medium">
                    Plan: <span className="text-emerald-700 font-semibold">{schoolInfo.tier}</span> • Valid until: <span className="font-semibold">{schoolInfo.validUntil}</span>
                  </p>
                </div>
                <Building2 className="w-8 h-8 text-emerald-600 opacity-60" />
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-amber-900">License Required for Paper Generation</h4>
                  <p className="text-xs text-amber-700 mt-0.5">
                    Please activate your authorized School License Key or select one of the demonstration schools below.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Security Shields Grid */}
          <div>
            <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-600" />
              Enterprise Protections Active
            </h5>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Zero-Leak AI Keys
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">API tokens stay securely in backend proxy.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Anti-DDoS / Rate Limit
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">35 papers / 15m quota prevents wallet drain.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Prompt Injection Guard
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Blocks jailbreaks & instruction overrides.</p>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Dual AI Resilience
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">Auto-recovery from upstream LLM spikes.</p>
              </div>
            </div>
          </div>

          {/* License Token Input */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700">
              School License Key / Access Token
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={tokenInput}
                onChange={(e) => setTokenInput(e.target.value)}
                placeholder="e.g. SCH-DPS-2026-X9A"
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={handleSave}
                disabled={loading}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition flex items-center gap-1.5 disabled:opacity-50"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Activate'}
              </button>
            </div>
            {error && (
              <p className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Quick Demo School Presets */}
          <div className="pt-2 border-t border-slate-100">
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
              Select School License Preset (For Testing)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
              {DEMO_KEYS.map((k) => (
                <button
                  key={k.key}
                  type="button"
                  onClick={() => handleSelectDemoKey(k.key)}
                  className={`text-left p-2 rounded-lg border text-xs font-medium transition ${
                    tokenInput === k.key
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-bold'
                      : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                >
                  <p className="truncate">{k.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{k.key}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            ExamCraft B2B Enterprise Shield v1.0
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
