import React, { useState, useMemo } from 'react';
import { 
  Database, 
  Search, 
  CheckCircle2, 
  Plus, 
  ArrowRight, 
  ArrowLeft, 
  CheckSquare
} from 'lucide-react';
import { QUESTION_TYPES_CONFIG } from '../data/curriculumData';
import AddQuestionModal from './AddQuestionModal';

export default function Step4QuestionBank({
  questionBank,
  setQuestionBank,
  selectedQuestionIds,
  setSelectedQuestionIds,
  typeAllocation,
  selectedBookIds,
  selectedChapterIds,
  books,
  onNext,
  onBack
}) {
  const [activeTypeTab, setActiveTypeTab] = useState('all');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Filter available questions based on books, selected chapters, and active filters
  const filteredQuestions = useMemo(() => {
    return questionBank.filter((q) => {
      // Must belong to selected books or custom questions
      if (selectedBookIds.length > 0 && !selectedBookIds.includes(q.bookId) && !q.id.startsWith('custom-') && !q.id.startsWith('ai-')) {
        return false;
      }

      // Must belong to selected chapters or custom
      if (selectedChapterIds.length > 0 && !selectedChapterIds.includes(q.chapterId) && !q.id.startsWith('custom-') && !q.id.startsWith('ai-')) {
        return false;
      }

      // Filter by type tab
      if (activeTypeTab !== 'all' && q.type !== activeTypeTab) {
        return false;
      }

      // Filter by specific chapter filter
      if (selectedChapterFilter !== 'all' && q.chapterId !== selectedChapterFilter) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const inText = q.text.toLowerCase().includes(query);
        const inAnswer = (q.answer || '').toLowerCase().includes(query);
        if (!inText && !inAnswer) return false;
      }

      return true;
    });
  }, [questionBank, selectedBookIds, selectedChapterIds, activeTypeTab, selectedChapterFilter, searchQuery]);

  // Toggle selection of a question
  const handleToggleQuestion = (id) => {
    if (selectedQuestionIds.includes(id)) {
      setSelectedQuestionIds(selectedQuestionIds.filter((qid) => qid !== id));
    } else {
      setSelectedQuestionIds([...selectedQuestionIds, id]);
    }
  };

  // Auto-pick questions from existing curriculum bank to fulfill counts planned in Step 3
  const handleAutoPickFromBank = () => {
    const newSelected = new Set(selectedQuestionIds);

    Object.entries(typeAllocation).forEach(([type, info]) => {
      if (!info.enabled || info.count <= 0) return;

      const candidateQuestions = questionBank.filter(
        (q) => q.type === type && (selectedChapterIds.includes(q.chapterId) || q.id.startsWith('custom-') || q.id.startsWith('ai-'))
      );

      const currentSelectedCount = Array.from(newSelected).filter((id) => {
        const q = questionBank.find((item) => item.id === id);
        return q && q.type === type;
      }).length;

      const needed = info.count - currentSelectedCount;
      if (needed > 0) {
        let added = 0;
        for (const cand of candidateQuestions) {
          if (!newSelected.has(cand.id)) {
            newSelected.add(cand.id);
            added++;
            if (added >= needed) break;
          }
        }
      }
    });

    setSelectedQuestionIds(Array.from(newSelected));
  };

  const handleAddCustomQuestion = (newQuestion) => {
    setQuestionBank([newQuestion, ...questionBank]);
    setSelectedQuestionIds([...selectedQuestionIds, newQuestion.id]);
  };

  const getChapterName = (chapterId) => {
    for (const b of books) {
      const ch = b.chapters.find((c) => c.id === chapterId);
      if (ch) return ch.title;
    }
    return 'Curriculum Topic';
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 4: Select Questions from Question Bank</h2>
            <p className="text-sm text-slate-500 mt-1">
              Browse syllabus-verified questions. Hand-pick your choices or auto-select to match your blueprint counts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleAutoPickFromBank}
              className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Auto-Pick by Blueprint</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Question</span>
            </button>
          </div>
        </div>

        {/* Blueprint Fulfillment Status Trackers */}
        <div className="mt-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Selection Progress by Question Type:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {QUESTION_TYPES_CONFIG.map((cfg) => {
              const req = typeAllocation[cfg.id];
              const targetCount = req?.enabled ? req.count : 0;
              const currentSelected = selectedQuestionIds.filter((id) => {
                const q = questionBank.find((item) => item.id === id);
                return q && q.type === cfg.id;
              }).length;

              const isComplete = currentSelected >= targetCount && targetCount > 0;

              return (
                <div
                  key={cfg.id}
                  onClick={() => setActiveTypeTab(cfg.id)}
                  className={`p-2 rounded-lg border text-center cursor-pointer transition ${
                    activeTypeTab === cfg.id
                      ? 'border-indigo-600 bg-indigo-100/50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <p className="text-[10px] font-bold uppercase truncate text-slate-600">{cfg.id}</p>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    {currentSelected} <span className="text-xs text-slate-400 font-normal">/ {targetCount}</span>
                  </p>
                  {targetCount > 0 && (
                    <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 ${
                      isComplete ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isComplete ? 'Ready' : `Need ${targetCount - currentSelected}`}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="mt-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none">
            <button
              type="button"
              onClick={() => setActiveTypeTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                activeTypeTab === 'all'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Types ({questionBank.length})
            </button>
            {QUESTION_TYPES_CONFIG.map((cfg) => {
              const count = questionBank.filter((q) => q.type === cfg.id).length;
              return (
                <button
                  key={cfg.id}
                  type="button"
                  onClick={() => setActiveTypeTab(cfg.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                    activeTypeTab === cfg.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cfg.id.toUpperCase()} ({count})
                </button>
              );
            })}
          </div>

          <div className="relative w-full md:w-64 flex-shrink-0">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question bank..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Question Cards List */}
        <div className="mt-6 space-y-3">
          {filteredQuestions.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Database className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No questions found</p>
              <p className="text-xs text-slate-500 mt-1">
                Try selecting different filters or click "Add Custom Question".
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => {
              const isSelected = selectedQuestionIds.includes(q.id);

              return (
                <div
                  key={q.id}
                  onClick={() => handleToggleQuestion(q.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-xs ring-1 ring-indigo-200'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                      />
                      <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                        {q.type.replace('_', ' ')}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {getChapterName(q.chapterId)}
                      </span>
                    </div>

                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>
                  </div>

                  <p className="text-sm font-semibold text-slate-900 mt-2.5 leading-relaxed">
                    {q.text}
                  </p>

                  {q.type === 'mcq' && q.options && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-4 text-xs text-slate-600">
                      {q.options.map((opt, i) => (
                        <div key={i} className="p-1 rounded bg-slate-50 border border-slate-100">
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === 'matching' && q.matchPairs && (
                    <div className="mt-2 pl-4 text-xs space-y-1">
                      {q.matchPairs.map((pair, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-slate-600">
                          <span className="font-medium text-slate-800 w-44">{pair.left}</span>
                          <span className="text-slate-400">➔</span>
                          <span>{pair.right}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {q.answer && (
                    <div className="mt-2.5 text-xs text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded">
                      <span className="font-semibold text-slate-700">Answer:</span>
                      <span className="text-indigo-700 italic">{q.answer}</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Question Types</span>
          </button>

          <button
            type="button"
            disabled={selectedQuestionIds.length === 0}
            onClick={onNext}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition flex items-center gap-2 ${
              selectedQuestionIds.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
            }`}
          >
            <span>Preview Question Paper ({selectedQuestionIds.length})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddQuestion={handleAddCustomQuestion}
        selectedBooks={selectedBookIds}
        selectedChapters={selectedChapterIds}
      />
    </div>
  );
}
