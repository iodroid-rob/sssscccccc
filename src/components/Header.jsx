import React from 'react';
import { 
  FileText, 
  BookOpen, 
  ListChecks, 
  Database, 
  Eye, 
  RotateCcw,
  Sparkles,
  Zap,
  Sliders,
  Settings,
  ShieldCheck
} from 'lucide-react';
import { getStoredProvider, PROVIDERS } from '../services/aiService';

export default function Header({ 
  activeMode,
  setActiveMode,
  currentStep, 
  setCurrentStep, 
  onReset, 
  onLoadSample,
  onOpenKeyModal,
  apiKeyActive,
  onOpenLicenseModal
}) {
  const steps = [
    { num: 1, label: 'Exam & School', icon: FileText },
    { num: 2, label: 'Books & Chapters', icon: BookOpen },
    { num: 3, label: 'Question Types', icon: ListChecks },
    { num: 4, label: 'Question Bank', icon: Database },
    { num: 5, label: 'Paper & Finalize', icon: Eye },
  ];

  const currentProvider = getStoredProvider();

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-lg text-slate-900 tracking-tight flex items-center gap-1.5">
                ExamCraft <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">Teacher Studio</span>
              </span>
              <p className="text-xs text-slate-500 font-medium">Question Paper & Answer Booklet Creator</p>
            </div>
          </div>

          {/* Center Mode Switcher: Standard Manual vs Generate by AI */}
          <div className="hidden md:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveMode('manual')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeMode === 'manual'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>Standard Paper Creator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('ai')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeMode === 'ai'
                  ? 'bg-gradient-to-r from-amber-500 to-purple-600 text-white shadow-xs'
                  : 'text-slate-700 hover:text-purple-700'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Generate by AI</span>
            </button>
          </div>

          {/* Quick Actions & AI Config */}
          <div className="flex items-center gap-2">
            {/* Mobile Mode Switcher */}
            <div className="flex md:hidden items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
              <button
                type="button"
                onClick={() => setActiveMode('manual')}
                className={`px-2 py-1 rounded ${activeMode === 'manual' ? 'bg-white font-bold' : 'text-slate-600'}`}
              >
                Manual
              </button>
              <button
                type="button"
                onClick={() => setActiveMode('ai')}
                className={`px-2 py-1 rounded ${activeMode === 'ai' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-600'}`}
              >
                AI
              </button>
            </div>

            {/* School License & Enterprise Security Shield */}
            <button
              type="button"
              onClick={onOpenLicenseModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-900 border border-emerald-300 hover:bg-emerald-100 transition shadow-2xs"
              title="School Tenant License & Enterprise Threat Shield"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline font-bold text-emerald-800">School Shield</span>
            </button>

            {/* AI Engine & Model Selector */}
            <button
              type="button"
              onClick={onOpenKeyModal}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-950 border border-indigo-200 hover:bg-indigo-100 transition shadow-2xs"
              title="Select AI Engine & Model (Groq / Gemini with Auto-Fallback)"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span className="hidden sm:inline font-bold">
                {currentProvider === PROVIDERS.GROQ ? 'Groq ⚡ Llama' : 'Gemini ✦ Flash'}
              </span>
            </button>

            <button
              type="button"
              onClick={onLoadSample}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-lg text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition"
              title="Preload Class 10 Science Sample Exam"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Load Sample</span>
            </button>

            <button
              type="button"
              onClick={onReset}
              className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              title="Reset data"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Step Progression Bar: Visible in Standard Manual Creator */}
        {activeMode === 'manual' && (
          <div className="py-2.5 border-t border-slate-100 overflow-x-auto scrollbar-none">
            <nav className="flex items-center justify-between min-w-[620px]">
              {steps.map((s, idx) => {
                const Icon = s.icon;
                const isActive = currentStep === s.num;
                const isPassed = currentStep > s.num;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => setCurrentStep(s.num)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                        : isPassed
                        ? 'text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100'
                        : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold ${
                      isActive ? 'bg-white text-indigo-700' : isPassed ? 'bg-indigo-200 text-indigo-800' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {s.num}
                    </span>
                    <Icon className="w-3.5 h-3.5" />
                    <span>{s.label}</span>
                    {idx < steps.length - 1 && (
                      <span className="text-slate-300 ml-2 font-normal">›</span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
