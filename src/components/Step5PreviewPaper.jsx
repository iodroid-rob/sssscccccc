import React, { useState } from 'react';
import { 
  Printer, 
  FileDown, 
  Lock, 
  Unlock, 
  Edit3, 
  Check, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Plus, 
  BookMarked, 
  FileText, 
  AlertTriangle, 
  ArrowLeft,
  Sparkles,
  Eye,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { exportPaperToDocx } from '../utils/docxExport';
import { exportPaperToPdf } from '../utils/pdfExport';
import { QUESTION_TYPES_CONFIG } from '../data/curriculumData';

export default function Step5PreviewPaper({
  paperInfo,
  setPaperInfo,
  questions,
  setQuestions,
  onBack
}) {
  const [isFinalized, setIsFinalized] = useState(false);
  const [showFinalizeConfirmModal, setShowFinalizeConfirmModal] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [showAnswerKey, setShowAnswerKey] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const isBooklet = paperInfo.paperFormat === 'answer_booklet';

  // Total marks tally of current questions
  const totalAllocatedMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 1), 0);

  // Group questions by type order
  const typeOrder = ['mcq', 'fillups', 'true_false', 'matching', 'vsa', 'sa', 'la'];
  const typeLabels = {
    mcq: 'Section A: Multiple Choice Questions',
    fillups: 'Section B: Fill in the Blanks',
    true_false: 'Section C: True / False Statements',
    matching: 'Section D: Match the Following',
    vsa: 'Section E: Very Short Answer Questions',
    sa: 'Section F: Short Answer Questions',
    la: 'Section G: Long Answer Questions'
  };

  // Reorder questions
  const moveQuestion = (idx, direction) => {
    if (isFinalized) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= questions.length) return;
    const nextList = [...questions];
    const [moved] = nextList.splice(idx, 1);
    nextList.splice(newIdx, 0, moved);
    setQuestions(nextList);
  };

  // Delete question
  const deleteQuestion = (id) => {
    if (isFinalized) return;
    setQuestions(questions.filter((q) => q.id !== id));
  };

  // Update question inline
  const updateQuestion = (id, field, value) => {
    if (isFinalized) return;
    setQuestions(questions.map((q) => (q.id === id ? { ...q, [field]: value } : q)));
  };

  // Finalize confirmation
  const handleFinalize = () => {
    setIsFinalized(true);
    setEditingQuestionId(null);
    setShowFinalizeConfirmModal(false);
  };

  // Export to Word (.docx)
  const handleExportWord = async () => {
    setIsExporting(true);
    try {
      await exportPaperToDocx({
        paperInfo,
        questions,
        isAnswerBooklet: isBooklet,
        includeAnswerKey: showAnswerKey
      });
    } catch (err) {
      console.error('Word export error:', err);
      alert('Error exporting to Word file. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Export to PDF
  const handleExportPdf = async () => {
    setIsExporting(true);
    const fileName = `${(paperInfo.examName || 'Paper').replace(/\s+/g, '_')}_${paperInfo.classLevel || 'Class'}_Set_${paperInfo.set || 'A'}.pdf`;
    try {
      await exportPaperToPdf('printable-paper-sheet', fileName);
    } finally {
      setIsExporting(false);
    }
  };

  // Print paper directly
  const handlePrint = () => {
    window.print();
  };

  // Calculate question sequential numbering
  let questionGlobalCounter = 1;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Action Control Toolbar */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200 no-print">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-slate-900">
                Step 5: Question Paper View & Finalization
              </h2>
              {isFinalized ? (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-2xs">
                  <Lock className="w-3.5 h-3.5" />
                  FINALIZED & LOCKED
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-100 text-amber-800 border border-amber-300 rounded-full text-xs font-bold flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" />
                  DRAFT (EDITABLE)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {isFinalized
                ? "Paper is locked. Teachers cannot edit once finalized. Ready to print or export to Word / PDF."
                : "You can edit questions, reorder, adjust marks, or finalize when ready."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Finalize Button / Status */}
            {!isFinalized ? (
              <button
                type="button"
                onClick={() => setShowFinalizeConfirmModal(true)}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2"
              >
                <Lock className="w-4 h-4" />
                <span>Finalize Question Paper</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Create an editable revision copy of this question paper?')) {
                      setIsFinalized(false);
                    }
                  }}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold border border-slate-300 flex items-center gap-1.5 transition"
                  title="Unlock as new draft revision"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Duplicate as Draft</span>
                </button>
              </div>
            )}

            {/* Answer Key Toggle */}
            <button
              type="button"
              onClick={() => setShowAnswerKey(!showAnswerKey)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                showAnswerKey
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showAnswerKey ? 'Hide Answer Key' : 'Show Answer Key'}</span>
            </button>

            {/* EXPORT OPTIONS (Active after finalization or preview) */}
            <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>

            {/* Print Button */}
            <button
              type="button"
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print Paper</span>
            </button>

            {/* Save as Word File (.docx) */}
            <button
              type="button"
              onClick={handleExportWord}
              disabled={isExporting}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <FileDown className="w-4 h-4" />
              <span>Save as Word (.docx)</span>
            </button>

            {/* Save as PDF */}
            <button
              type="button"
              onClick={handleExportPdf}
              disabled={isExporting}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center gap-1.5"
            >
              <FileText className="w-4 h-4" />
              <span>Save as PDF</span>
            </button>
          </div>
        </div>

        {/* Paper Format & Marks Indicator Banner */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="font-bold text-slate-900">Format:</span>
              {isBooklet ? (
                <span className="text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                  Question Paper + Answer Booklet (With Writing Lines)
                </span>
              ) : (
                <span className="text-slate-700 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Only Question Paper (Standard Compact)
                </span>
              )}
            </span>

            <span>
              <span className="font-bold text-slate-900">Questions:</span> {questions.length} Total
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">Paper Marks:</span>
            <span className={`font-bold px-2 py-0.5 rounded ${
              totalAllocatedMarks === paperInfo.maxMarks
                ? 'bg-emerald-100 text-emerald-800'
                : 'bg-amber-100 text-amber-800'
            }`}>
              {totalAllocatedMarks} / {paperInfo.maxMarks} Marks
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================== */}
      {/* REALISTIC A4 QUESTION PAPER SHEET (PRINTABLE CONTAINER)    */}
      {/* ========================================================== */}
      <div
        id="printable-paper-sheet"
        className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 sm:p-12 font-serif text-slate-900 paper-page"
        style={{ fontFamily: '"Crimson Pro", "Times New Roman", Times, serif' }}
      >
        {/* Top Header */}
        <div className="border-b-2 border-slate-900 pb-4 text-center relative">
          <div className="flex items-center justify-between gap-4">
            {/* Optional Logo on Left */}
            {paperInfo.hasLogo && paperInfo.logoUrl ? (
              <div className="w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <img
                  src={paperInfo.logoUrl}
                  alt="School Crest"
                  className="max-h-20 max-w-20 object-contain"
                />
              </div>
            ) : (
              <div className="w-16 hidden sm:block"></div>
            )}

            {/* School Name & Exam Title */}
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-slate-950">
                {paperInfo.schoolName || 'ACADEMIC INSTITUTION'}
              </h1>
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-slate-800 mt-1">
                {paperInfo.examName || 'EXAMINATION'} {paperInfo.session ? `(${paperInfo.session})` : ''}
              </h2>
              {isBooklet && (
                <p className="text-xs font-bold uppercase tracking-widest text-indigo-900 mt-1 font-sans">
                  [ QUESTION PAPER CUM ANSWER BOOKLET ]
                </p>
              )}
            </div>

            {/* Right Spacer or Set Badge */}
            <div className="w-20 flex-shrink-0 text-right">
              <span className="inline-block border-2 border-slate-900 px-3 py-1 font-bold text-sm tracking-wider uppercase">
                {paperInfo.set || 'SET A'}
              </span>
            </div>
          </div>

          {/* Subheader Metadata Row */}
          <div className="mt-4 pt-3 border-t border-slate-300 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm font-sans font-semibold text-slate-800">
            <div className="text-left">
              <span>CLASS: </span>
              <span className="font-bold">{paperInfo.classLevel || 'Class 10'}</span>
            </div>
            <div className="text-center sm:text-left">
              <span>TIME: </span>
              <span className="font-bold">{paperInfo.timeAllowed || '3 Hours'}</span>
            </div>
            <div className="text-center sm:text-right">
              <span>SET: </span>
              <span className="font-bold">{paperInfo.set || 'Set A'}</span>
            </div>
            <div className="text-right">
              <span>MAX. MARKS: </span>
              <span className="font-bold">{paperInfo.maxMarks || 80}</span>
            </div>
          </div>
        </div>

        {/* Student Credential Fields (Especially essential for Answer Booklet) */}
        <div className="mt-4 p-3 border border-slate-300 rounded-lg font-sans text-xs grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50/50">
          <div>
            <span className="font-bold text-slate-700">Student's Name:</span>
            <div className="border-b border-dotted border-slate-400 mt-3"></div>
          </div>
          <div>
            <span className="font-bold text-slate-700">Roll Number:</span>
            <div className="border-b border-dotted border-slate-400 mt-3"></div>
          </div>
          <div>
            <span className="font-bold text-slate-700">Section:</span>
            <div className="border-b border-dotted border-slate-400 mt-3"></div>
          </div>
          <div>
            <span className="font-bold text-slate-700">Invigilator Sign:</span>
            <div className="border-b border-dotted border-slate-400 mt-3"></div>
          </div>
        </div>

        {/* General Instructions */}
        <div className="mt-4 p-4 border border-slate-400 rounded-lg text-xs font-sans leading-relaxed bg-slate-50/30">
          <p className="font-bold uppercase tracking-wider text-slate-900 mb-1 underline">
            General Instructions:
          </p>
          <ul className="list-disc pl-5 space-y-0.5 text-slate-700">
            {paperInfo.instructions ? (
              paperInfo.instructions.split('\n').filter(Boolean).map((inst, i) => (
                <li key={i}>{inst.trim()}</li>
              ))
            ) : (
              <>
                <li>Read all instructions and questions carefully before writing your answers.</li>
                <li>All questions are compulsory unless internal choice is specified.</li>
                {isBooklet ? (
                  <li className="font-semibold text-indigo-900">
                    Write answers strictly within the specified ruled lines / answer space under each question.
                  </li>
                ) : (
                  <li>Write all answers legibly on your separate answer sheet.</li>
                )}
                <li>Marks for each question are mentioned on the right side.</li>
              </>
            )}
          </ul>
        </div>

        {/* ========================================================== */}
        {/* QUESTIONS BODY SECTIONS                                     */}
        {/* ========================================================== */}
        <div className="mt-8 space-y-8">
          {typeOrder.map((currType) => {
            const sectionQuestions = questions.filter((q) => q.type === currType);
            if (sectionQuestions.length === 0) return null;

            return (
              <div key={currType} className="space-y-4">
                {/* Section Header */}
                <div className="border-b-2 border-slate-800 pb-1">
                  <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-slate-900">
                    {typeLabels[currType] || currType.toUpperCase()}
                  </h3>
                </div>

                {/* Section Questions */}
                <div className="space-y-6">
                  {sectionQuestions.map((q) => {
                    const qIdxInMaster = questions.findIndex((item) => item.id === q.id);
                    const qNumber = qIdxInMaster + 1;
                    const isEditing = editingQuestionId === q.id && !isFinalized;

                    return (
                      <div
                        key={q.id}
                        className={`group relative p-3 rounded-xl transition ${
                          isEditing
                            ? 'bg-indigo-50/70 border border-indigo-300'
                            : 'hover:bg-slate-50/50'
                        }`}
                      >
                        {/* Teacher Edit Controls (ONLY DISPLAYED IF NOT FINALIZED) */}
                        {!isFinalized && (
                          <div className="no-print absolute top-2 right-2 flex items-center gap-1 opacity-80 group-hover:opacity-100 transition">
                            <button
                              type="button"
                              onClick={() => moveQuestion(qIdxInMaster, -1)}
                              disabled={qIdxInMaster === 0}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-200"
                              title="Move Question Up"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveQuestion(qIdxInMaster, 1)}
                              disabled={qIdxInMaster === questions.length - 1}
                              className="p-1 text-slate-500 hover:text-slate-900 disabled:opacity-30 rounded hover:bg-slate-200"
                              title="Move Question Down"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEditingQuestionId(isEditing ? null : q.id)}
                              className={`p-1 rounded transition ${
                                isEditing ? 'bg-indigo-600 text-white' : 'text-slate-500 hover:text-indigo-600 hover:bg-slate-200'
                              }`}
                              title="Edit Question Text & Marks"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteQuestion(q.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-slate-200"
                              title="Remove Question"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}

                        {/* Question Text Row */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-2 flex-1">
                            <span className="font-bold text-base text-slate-900 font-sans min-w-[2.5rem]">
                              Q{qNumber}.
                            </span>

                            {isEditing ? (
                              <div className="space-y-3 flex-1 font-sans">
                                <div>
                                  <label className="text-[11px] font-bold text-slate-600 uppercase">Question Text</label>
                                  <textarea
                                    rows={2}
                                    value={q.text}
                                    onChange={(e) => updateQuestion(q.id, 'text', e.target.value)}
                                    className="w-full p-2 text-sm border rounded-lg focus:ring-1 focus:ring-indigo-500"
                                  />
                                </div>

                                <div className="flex items-center gap-4 text-xs">
                                  <div>
                                    <label className="font-bold text-slate-600 mr-1">Marks:</label>
                                    <input
                                      type="number"
                                      min="1"
                                      max="20"
                                      value={q.marks}
                                      onChange={(e) => updateQuestion(q.id, 'marks', Number(e.target.value))}
                                      className="w-16 p-1 border rounded"
                                    />
                                  </div>
                                  {isBooklet && (
                                    <div>
                                      <label className="font-bold text-slate-600 mr-1">Answer Lines:</label>
                                      <input
                                        type="number"
                                        min="1"
                                        max="30"
                                        value={q.answerLinesCount || 3}
                                        onChange={(e) => updateQuestion(q.id, 'answerLinesCount', Number(e.target.value))}
                                        className="w-16 p-1 border rounded"
                                      />
                                    </div>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => setEditingQuestionId(null)}
                                    className="ml-auto px-3 py-1 bg-indigo-600 text-white rounded text-xs font-semibold"
                                  >
                                    Done
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-base text-slate-900 leading-relaxed flex-1">
                                {q.text}
                              </p>
                            )}
                          </div>

                          {/* Marks on right side */}
                          <div className="font-sans font-bold text-sm text-slate-900 flex-shrink-0 text-right min-w-[4rem]">
                            [{q.marks} Mark{q.marks > 1 ? 's' : ''}]
                          </div>
                        </div>

                        {/* MCQ Options Display */}
                        {q.type === 'mcq' && q.options && (
                          <div className="mt-2.5 ml-10 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                            {q.options.map((opt, i) => (
                              <div key={i} className="flex items-center gap-1.5">
                                <span className="text-slate-800">{opt}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Matching Pairs Display */}
                        {q.type === 'matching' && q.matchPairs && (
                          <div className="mt-3 ml-10 border border-slate-300 rounded-lg overflow-hidden text-sm">
                            <table className="w-full font-sans text-xs">
                              <thead className="bg-slate-100 font-bold border-b border-slate-300">
                                <tr>
                                  <th className="py-1.5 px-3 text-left w-1/2">Column A</th>
                                  <th className="py-1.5 px-3 text-left w-1/2">Column B</th>
                                </tr>
                              </thead>
                              <tbody>
                                {q.matchPairs.map((pair, idx) => (
                                  <tr key={idx} className="border-b border-slate-200 last:border-none">
                                    <td className="py-1.5 px-3 font-medium text-slate-800">{pair.left}</td>
                                    <td className="py-1.5 px-3 text-slate-700">{pair.right}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* ======================================================= */}
                        {/* ANSWER BOOKLET WRITING SPACE (RULED LINES FOR STUDENTS) */}
                        {/* ======================================================= */}
                        {isBooklet && (
                          <div className="mt-3 ml-8 pt-1">
                            <span className="text-xs font-sans font-bold text-slate-500 italic block mb-1">
                              Answer:
                            </span>
                            <div className="space-y-2">
                              {[...Array(q.answerLinesCount || (q.type === 'la' ? 10 : q.type === 'sa' ? 6 : q.type === 'vsa' ? 3 : 1))].map((_, lineIdx) => (
                                <div key={lineIdx} className="answer-ruled-line"></div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Paper End Mark */}
        <div className="mt-12 pt-6 border-t border-slate-300 text-center font-sans text-xs font-bold text-slate-500 uppercase tracking-widest">
          --- End of Question Paper ---
        </div>

        {/* ========================================================== */}
        {/* OPTIONAL TEACHER'S ANSWER KEY (PRINTABLE IF ACTIVE)       */}
        {/* ========================================================== */}
        {showAnswerKey && (
          <div className="mt-16 pt-8 border-t-2 border-dashed border-slate-400 font-sans">
            <div className="text-center mb-6">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-900 rounded font-bold text-xs uppercase tracking-wider">
                CONFIDENTIAL TEACHER COPY
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-2">
                Official Answer Key & Marking Scheme
              </h3>
            </div>

            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      Q{idx + 1}. ({q.type.toUpperCase()})
                    </span>
                    <span className="font-semibold text-slate-600">
                      {q.marks} Mark{q.marks > 1 ? 's' : ''}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-700 italic">
                    <span className="font-bold not-italic text-indigo-800">Model Solution: </span>
                    {q.answer || 'Refer to textbook evaluation rubrics.'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center no-print">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-semibold text-sm transition flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Question Bank</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold text-sm shadow-md transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Paper</span>
          </button>
        </div>
      </div>

      {/* FINALIZATION CONFIRMATION MODAL */}
      {showFinalizeConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
              <Lock className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="font-bold text-lg text-slate-900">
                Finalize & Lock Question Paper?
              </h3>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                As per examination compliance, <strong>once finalized, teachers cannot edit the question paper</strong>. All questions, marks, and order will be permanently locked for final printing and word/pdf export.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1 font-medium text-slate-700 border border-slate-100">
              <div className="flex justify-between">
                <span>School:</span>
                <span className="font-bold">{paperInfo.schoolName}</span>
              </div>
              <div className="flex justify-between">
                <span>Exam:</span>
                <span className="font-bold">{paperInfo.examName}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Marks:</span>
                <span className="font-bold text-indigo-700">{totalAllocatedMarks} / {paperInfo.maxMarks}</span>
              </div>
              <div className="flex justify-between">
                <span>Format:</span>
                <span className="font-bold">{isBooklet ? 'Answer Booklet' : 'Question Only'}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowFinalizeConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cancel (Keep Editing)
              </button>
              <button
                type="button"
                onClick={handleFinalize}
                className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow transition flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Yes, Finalize Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
