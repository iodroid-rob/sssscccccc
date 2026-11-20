import React from 'react';
import { 
  CheckCircle2, 
  Plus, 
  Minus, 
  HelpCircle, 
  Calculator, 
  ArrowRight, 
  ArrowLeft,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { QUESTION_TYPES_CONFIG } from '../data/curriculumData';

export default function Step3QuestionTypes({ 
  typeAllocation, 
  setTypeAllocation, 
  maxMarks, 
  onNext, 
  onBack 
}) {
  const typeDescriptions = {
    fillups: 'Single word or phrase missing blanks for factual recall.',
    mcq: '4 options (A, B, C, D) with single or multi-correct selection.',
    true_false: 'Binary evaluation statements testing fundamental concepts.',
    matching: 'Column A & Column B pairwise concept or definition association.',
    vsa: '1 to 2 sentence answers testing direct definitions and formula.',
    sa: '3 to 5 sentence conceptual reasoning or numerical calculations.',
    la: 'In-depth derivations, proofs, essays or multi-part complex questions.'
  };

  const handleToggleType = (typeId) => {
    setTypeAllocation((prev) => {
      const current = prev[typeId];
      return {
        ...prev,
        [typeId]: {
          ...current,
          enabled: !current.enabled,
          count: !current.enabled && current.count === 0 ? 2 : current.count
        }
      };
    });
  };

  const handleCountChange = (typeId, delta) => {
    setTypeAllocation((prev) => {
      const current = prev[typeId];
      const newCount = Math.max(0, current.count + delta);
      return {
        ...prev,
        [typeId]: {
          ...current,
          count: newCount,
          enabled: newCount > 0
        }
      };
    });
  };

  const handleMarksPerQuestionChange = (typeId, marks) => {
    setTypeAllocation((prev) => ({
      ...prev,
      [typeId]: {
        ...prev[typeId],
        marksPerQuestion: Math.max(1, Number(marks) || 1)
      }
    }));
  };

  // Calculate totals
  const totalQuestions = Object.values(typeAllocation).reduce(
    (sum, item) => sum + (item.enabled ? item.count : 0),
    0
  );

  const calculatedTotalMarks = Object.values(typeAllocation).reduce(
    (sum, item) => sum + (item.enabled ? item.count * item.marksPerQuestion : 0),
    0
  );

  const marksDiff = maxMarks - calculatedTotalMarks;

  // Presets
  const applyPreset = (presetName) => {
    if (presetName === 'cbse_standard') {
      setTypeAllocation({
        mcq: { enabled: true, count: 16, marksPerQuestion: 1 },
        fillups: { enabled: true, count: 4, marksPerQuestion: 1 },
        true_false: { enabled: true, count: 0, marksPerQuestion: 1 },
        matching: { enabled: true, count: 2, marksPerQuestion: 4 },
        vsa: { enabled: true, count: 6, marksPerQuestion: 2 },
        sa: { enabled: true, count: 7, marksPerQuestion: 3 },
        la: { enabled: true, count: 3, marksPerQuestion: 5 }
      });
    } else if (presetName === 'unit_test_25') {
      setTypeAllocation({
        mcq: { enabled: true, count: 5, marksPerQuestion: 1 },
        fillups: { enabled: true, count: 4, marksPerQuestion: 1 },
        true_false: { enabled: true, count: 4, marksPerQuestion: 1 },
        matching: { enabled: true, count: 1, marksPerQuestion: 4 },
        vsa: { enabled: true, count: 2, marksPerQuestion: 2 },
        sa: { enabled: true, count: 2, marksPerQuestion: 3 },
        la: { enabled: false, count: 0, marksPerQuestion: 5 }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 3: Question Types & Marks Blueprint</h2>
            <p className="text-sm text-slate-500 mt-1">
              Select which types of questions to include and assign question counts and marks per question.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Quick Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('cbse_standard')}
              className="px-2.5 py-1 text-xs font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg border border-indigo-200"
            >
              80 Marks Full Exam
            </button>
            <button
              type="button"
              onClick={() => applyPreset('unit_test_25')}
              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg border border-slate-200"
            >
              25 Marks Unit Test
            </button>
          </div>
        </div>

        {/* Blueprint Summary Tally */}
        <div className="mt-6 p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Questions</p>
              <p className="text-2xl font-bold">{totalQuestions}</p>
            </div>
            <div className="h-8 w-px bg-slate-700"></div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Allocated Marks</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-bold text-indigo-400">{calculatedTotalMarks}</span>
                <span className="text-sm text-slate-400">/ {maxMarks} Max Marks</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {marksDiff === 0 ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg">
                <CheckCircle2 className="w-4 h-4" />
                <span>Exact Match to Max Marks ({maxMarks})</span>
              </div>
            ) : marksDiff > 0 ? (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300 bg-amber-950/60 border border-amber-800/80 px-3 py-1.5 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>Need +{marksDiff} more marks to reach {maxMarks}</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/80 px-3 py-1.5 rounded-lg">
                <AlertCircle className="w-4 h-4" />
                <span>Exceeds Max Marks by {Math.abs(marksDiff)} marks</span>
              </div>
            )}
          </div>
        </div>

        {/* Question Types List */}
        <div className="mt-8 space-y-3">
          {QUESTION_TYPES_CONFIG.map((cfg) => {
            const allocation = typeAllocation[cfg.id] || { enabled: false, count: 0, marksPerQuestion: cfg.defaultMarks };
            const isEnabled = allocation.enabled && allocation.count > 0;
            const subtotal = allocation.count * allocation.marksPerQuestion;

            return (
              <div
                key={cfg.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  isEnabled
                    ? 'border-indigo-600 bg-indigo-50/30 shadow-2xs'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: Checkbox & Name */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id={`type-${cfg.id}`}
                      checked={allocation.enabled}
                      onChange={() => handleToggleType(cfg.id)}
                      className="mt-1 w-5 h-5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div>
                      <label htmlFor={`type-${cfg.id}`} className="font-bold text-slate-900 text-sm cursor-pointer hover:text-indigo-600">
                        {cfg.label}
                      </label>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {typeDescriptions[cfg.id]}
                      </p>
                    </div>
                  </div>

                  {/* Right: Count and Marks Controls */}
                  <div className="flex items-center gap-5 self-end sm:self-center">
                    {/* Number of Questions */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-600 uppercase">Qty:</span>
                      <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleCountChange(cfg.id, -1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="w-9 text-center font-bold text-sm text-slate-900">
                          {allocation.count}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCountChange(cfg.id, 1)}
                          className="px-2.5 py-1 text-slate-600 hover:bg-slate-100 transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Marks per Question */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-600 uppercase">Marks:</span>
                      <input
                        type="number"
                        min="1"
                        max="20"
                        value={allocation.marksPerQuestion}
                        onChange={(e) => handleMarksPerQuestionChange(cfg.id, e.target.value)}
                        className="w-14 px-2 py-1 text-center font-semibold text-sm border border-slate-300 rounded-lg focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>

                    {/* Section Total Marks */}
                    <div className="w-20 text-right">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2.5 py-1 rounded-md">
                        {subtotal} M
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-between items-center">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Books & Chapters</span>
          </button>

          <button
            type="button"
            disabled={totalQuestions === 0}
            onClick={onNext}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition flex items-center gap-2 ${
              totalQuestions === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
            }`}
          >
            <span>Proceed to Question Bank Selection</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
