import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  BookOpen, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  Check, 
  FileText,
  Sliders,
  Settings,
  Cpu,
  ArrowRight,
  Zap
} from 'lucide-react';
import { 
  generateCurriculumQuestions, 
  getStoredApiKey, 
  getStoredProvider, 
  getStoredModel, 
  AVAILABLE_GROQ_MODELS, 
  AVAILABLE_GEMINI_MODELS,
  PROVIDERS 
} from '../services/aiService';
import { QUESTION_TYPES_CONFIG } from '../data/curriculumData';

export default function AiQuestionGeneratorModal({
  isOpen,
  onClose,
  onQuestionsGenerated,
  selectedBooks,
  selectedChapters,
  books,
  classLevel,
  onOpenKeySettings,
  onProceedToPreview
}) {
  const [selectedChapterId, setSelectedChapterId] = useState('');
  const [chapterContent, setChapterContent] = useState('');
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState('Balanced');
  const [provider, setProvider] = useState(getStoredProvider());
  const [modelChoice, setModelChoice] = useState(getStoredModel());
  const [selectedTypes, setSelectedTypes] = useState([
    'mcq',
    'fillups',
    'true_false',
    'matching',
    'vsa',
    'sa',
    'la'
  ]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState(null);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [selectedGeneratedIds, setSelectedGeneratedIds] = useState([]);

  useEffect(() => {
    if (isOpen) {
      if (!selectedChapterId && selectedChapters.length > 0) {
        setSelectedChapterId(selectedChapters[0]);
      }
      setProvider(getStoredProvider());
      setModelChoice(getStoredModel());
      setError(null);
    }
  }, [isOpen, selectedChapters]);

  if (!isOpen) return null;

  const apiKey = getStoredApiKey();

  const currentChapterObj = (() => {
    for (const b of books) {
      const ch = b.chapters.find((c) => c.id === selectedChapterId);
      if (ch) return { chapter: ch, book: b };
    }
    return null;
  })();

  const handleToggleType = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== typeId));
      }
    } else {
      setSelectedTypes([...selectedTypes, typeId]);
    }
  };

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Please configure your AI API Key first.');
      return;
    }

    setLoading(true);
    setLoadingStep(1);
    setError(null);
    setGeneratedQuestions([]);

    const chapterTitle = currentChapterObj?.chapter.title || 'Selected Syllabus Topics';
    const subject = currentChapterObj?.book.subject || 'General Studies';

    const stepInterval = setInterval(() => {
      setLoadingStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 1000);

    try {
      const questions = await generateCurriculumQuestions({
        apiKey,
        providerChoice: provider,
        modelChoice,
        subject,
        classLevel,
        chapterTitle,
        chapterContent: chapterContent.trim(),
        questionTypes: selectedTypes,
        totalCount: Number(count) || 10,
        difficulty
      });

      const enriched = questions.map((q) => ({
        ...q,
        chapterId: selectedChapterId || 'custom-ch',
        bookId: currentChapterObj?.book.id || 'custom-book'
      }));

      setGeneratedQuestions(enriched);
      setSelectedGeneratedIds(enriched.map((q) => q.id));
    } catch (err) {
      setError(err.message || 'Failed to generate questions. Please try again or switch model.');
    } finally {
      clearInterval(stepInterval);
      setLoading(false);
      setLoadingStep(0);
    }
  };

  const handleApplyToPaper = (goToPreview = false) => {
    const toAdd = generatedQuestions.filter((q) => selectedGeneratedIds.includes(q.id));
    if (toAdd.length > 0) {
      onQuestionsGenerated(toAdd);
      onClose();
      if (goToPreview && onProceedToPreview) {
        onProceedToPreview();
      }
    }
  };

  const toggleSelectGenerated = (id) => {
    if (selectedGeneratedIds.includes(id)) {
      setSelectedGeneratedIds(selectedGeneratedIds.filter((item) => item !== id));
    } else {
      setSelectedGeneratedIds([...selectedGeneratedIds, id]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base flex items-center gap-2">
                <span>AI Question Generator</span>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-mono uppercase">
                  {provider === PROVIDERS.GROQ ? 'Groq LPU (Ultra-Fast)' : 'Gemini 2.5 Flash'}
                </span>
              </h3>
              <p className="text-xs text-slate-300">Read textbook chapters and synthesize brand new exam questions</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onOpenKeySettings}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 border border-white/20"
            >
              <Settings className="w-3.5 h-3.5" /> Engine Settings
            </button>
            <button onClick={onClose} className="p-1 text-slate-300 hover:text-white rounded-lg hover:bg-white/10">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {generatedQuestions.length === 0 ? (
            <div className="space-y-4">
              {/* Target Chapter Selection & Engine Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    1. Target Chapter / Syllabus Unit
                  </label>
                  <select
                    value={selectedChapterId}
                    onChange={(e) => setSelectedChapterId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {selectedChapters.length === 0 ? (
                      <option value="">All Curriculum Chapters</option>
                    ) : (
                      selectedChapters.map((chId) => {
                        for (const b of books) {
                          const ch = b.chapters.find((c) => c.id === chId);
                          if (ch) {
                            return (
                              <option key={ch.id} value={ch.id}>
                                [{b.subject}] {ch.title}
                              </option>
                            );
                          }
                        }
                        return null;
                      })
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                    <span>AI Engine Model</span>
                  </label>
                  <select
                    value={modelChoice}
                    onChange={(e) => setModelChoice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {provider === PROVIDERS.GROQ ? (
                      AVAILABLE_GROQ_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))
                    ) : (
                      AVAILABLE_GEMINI_MODELS.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>

              {/* Paste Book Content */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    2. Chapter Content / Excerpt (Optional)
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Leave blank to use standard curriculum syllabus
                  </span>
                </div>
                <textarea
                  rows={4}
                  value={chapterContent}
                  onChange={(e) => setChapterContent(e.target.value)}
                  placeholder="Paste textbook excerpts, formulas, notes, or chapter paragraphs (or leave blank to let AI synthesize from syllabus)..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none leading-relaxed"
                />
              </div>

              {/* Question Types Checkboxes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  3. Question Formats to Generate
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {QUESTION_TYPES_CONFIG.map((cfg) => {
                    const isChecked = selectedTypes.includes(cfg.id);
                    return (
                      <label
                        key={cfg.id}
                        className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                          isChecked
                            ? 'bg-indigo-50 border-indigo-400 font-bold text-indigo-950 ring-1 ring-indigo-200'
                            : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleType(cfg.id)}
                          className="w-3.5 h-3.5 text-indigo-600 rounded"
                        />
                        <span className="truncate">{cfg.id.toUpperCase()}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Count & Difficulty */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Number of Questions to Generate
                  </label>
                  <select
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                    <option value={20}>20 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Difficulty Level
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                  >
                    <option value="Balanced">Balanced (Standard Board Mix)</option>
                    <option value="Easy">Easy (Conceptual Recall)</option>
                    <option value="Moderate">Moderate (Application & Reasoning)</option>
                    <option value="HOTS">HOTS (Higher Order Thinking Skills)</option>
                  </select>
                </div>
              </div>

              {/* Live Loading Animation */}
              {loading && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-2">
                  <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-900">
                    {provider === PROVIDERS.GROQ ? '⚡ Groq LPU is synthesizing questions at 500+ tokens/sec...' : '🧠 Gemini 2.5 Flash is formulating exam questions...'}
                  </p>
                  <p className="text-[11px] text-slate-500">Fast, dependable curriculum question creation.</p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">
                    Generated {generatedQuestions.length} Brand New Questions
                  </h4>
                  <p className="text-xs text-slate-500">
                    Review and select which questions to add to your paper and question bank:
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setGeneratedQuestions([]);
                    setSelectedGeneratedIds([]);
                  }}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
                >
                  Generate Different Set
                </button>
              </div>

              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {generatedQuestions.map((q, idx) => {
                  const isChecked = selectedGeneratedIds.includes(q.id);
                  return (
                    <div
                      key={q.id}
                      onClick={() => toggleSelectGenerated(q.id)}
                      className={`p-3.5 rounded-xl border-2 cursor-pointer transition ${
                        isChecked
                          ? 'bg-indigo-50/50 border-indigo-500 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="w-4 h-4 text-indigo-600 rounded"
                          />
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                            {q.type}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {q.marks} Mark{q.marks > 1 ? 's' : ''}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-slate-900 mt-2 leading-relaxed">
                        Q{idx + 1}. {q.text}
                      </p>

                      {q.type === 'mcq' && q.options && (
                        <div className="mt-1.5 grid grid-cols-2 gap-1 text-[11px] text-slate-600 pl-4">
                          {q.options.map((opt, i) => (
                            <span key={i}>{opt}</span>
                          ))}
                        </div>
                      )}

                      {q.answer && (
                        <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                          <span className="font-bold">Answer: </span> {q.answer}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>

          {generatedQuestions.length === 0 ? (
            <button
              type="button"
              disabled={loading || !apiKey}
              onClick={handleGenerate}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Questions...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 text-amber-300" />
                  <span>Generate Questions with AI</span>
                </>
              )}
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={selectedGeneratedIds.length === 0}
                onClick={() => handleApplyToPaper(false)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-40"
              >
                <Check className="w-4 h-4" />
                <span>Add to Bank</span>
              </button>
              <button
                type="button"
                disabled={selectedGeneratedIds.length === 0}
                onClick={() => handleApplyToPaper(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-1.5 disabled:opacity-40"
              >
                <span>Add & View Final Paper</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
