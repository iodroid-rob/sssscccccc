import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { QUESTION_TYPES_CONFIG } from '../data/curriculumData';

export default function AddQuestionModal({ isOpen, onClose, onAddQuestion, selectedBooks, selectedChapters }) {
  const [type, setType] = useState('mcq');
  const [text, setText] = useState('');
  const [marks, setMarks] = useState(1);
  const [answer, setAnswer] = useState('');
  const [answerLinesCount, setAnswerLinesCount] = useState(1);
  const [options, setOptions] = useState(['A) ', 'B) ', 'C) ', 'D) ']);
  const [matchPairs, setMatchPairs] = useState([
    { left: '1. Item A', right: 'a) Definition A' },
    { left: '2. Item B', right: 'b) Definition B' }
  ]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setType(newType);
    const config = QUESTION_TYPES_CONFIG.find((c) => c.id === newType);
    if (config) {
      setMarks(config.defaultMarks);
      setAnswerLinesCount(config.defaultLines);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newQuestion = {
      id: `custom-q-${Date.now()}`,
      bookId: selectedBooks[0] || 'custom-book',
      chapterId: selectedChapters[0] || 'custom-ch',
      type,
      marks: Number(marks) || 1,
      text: text.trim(),
      answer: answer.trim(),
      answerLinesCount: Number(answerLinesCount) || 1,
      options: type === 'mcq' ? options.filter(Boolean) : undefined,
      matchPairs: type === 'matching' ? matchPairs : undefined
    };

    onAddQuestion(newQuestion);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
        <div className="px-6 py-4 bg-indigo-900 text-white flex items-center justify-between">
          <h3 className="font-semibold text-lg">Add New Question to Question Bank</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-indigo-800 transition text-slate-300 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Question Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Question Type
            </label>
            <select
              value={type}
              onChange={(e) => handleTypeChange(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            >
              <option value="fillups">Fill in the Blanks (Fillups)</option>
              <option value="mcq">Multiple Choice Questions (MCQ)</option>
              <option value="true_false">True / False</option>
              <option value="matching">Match the Following</option>
              <option value="vsa">Very Short Answers (VSA)</option>
              <option value="sa">Short Answers (SA)</option>
              <option value="la">Long Answers (LA)</option>
            </select>
          </div>

          {/* Question Text */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Question Statement / Problem
            </label>
            <textarea
              rows={3}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter the question text here..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
            />
          </div>

          {/* MCQ Options */}
          {type === 'mcq' && (
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Choices / Options
              </label>
              {options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  value={opt}
                  onChange={(e) => {
                    const next = [...options];
                    next[i] = e.target.value;
                    setOptions(next);
                  }}
                  placeholder={`Option ${i + 1}`}
                  className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>
          )}

          {/* Matching Pairs */}
          {type === 'matching' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Matching Pairs (Column A & Column B)
                </label>
                <button
                  type="button"
                  onClick={() => setMatchPairs([...matchPairs, { left: '', right: '' }])}
                  className="text-xs text-indigo-600 font-semibold flex items-center gap-1 hover:text-indigo-800"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Row
                </button>
              </div>
              {matchPairs.map((pair, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={pair.left}
                    onChange={(e) => {
                      const next = [...matchPairs];
                      next[idx].left = e.target.value;
                      setMatchPairs(next);
                    }}
                    placeholder={`Item ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 border rounded-lg text-sm"
                  />
                  <span className="text-slate-400 font-bold">⇄</span>
                  <input
                    type="text"
                    value={pair.right}
                    onChange={(e) => {
                      const next = [...matchPairs];
                      next[idx].right = e.target.value;
                      setMatchPairs(next);
                    }}
                    placeholder={`Match ${idx + 1}`}
                    className="flex-1 px-3 py-1.5 border rounded-lg text-sm"
                  />
                  {matchPairs.length > 2 && (
                    <button
                      type="button"
                      onClick={() => setMatchPairs(matchPairs.filter((_, i) => i !== idx))}
                      className="text-rose-500 hover:text-rose-700 p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Marks & Answer space */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Marks Allotted
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Answer Ruled Lines (for Booklet)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                value={answerLinesCount}
                onChange={(e) => setAnswerLinesCount(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Expected Answer / Solution */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Teacher's Answer / Solution (For Answer Key)
            </label>
            <input
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="e.g. Option B / True / Solution steps..."
              className="w-full px-3 py-2 border rounded-lg text-sm"
            />
          </div>

          <div className="pt-4 border-t flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium shadow-md transition flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add to Question Bank
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
