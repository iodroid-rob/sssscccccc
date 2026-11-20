import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Image as ImageIcon, 
  Trash2, 
  FileText, 
  Calendar, 
  BookMarked, 
  CheckCircle2, 
  BookOpen, 
  Sliders, 
  Sparkles, 
  Loader2, 
  Zap, 
  Plus, 
  Minus,
  ArrowLeft,
  RotateCcw
} from 'lucide-react';
import LogoPickerModal from './LogoPickerModal';
import Step5PreviewPaper from './Step5PreviewPaper';
import { 
  generateFullPaperWithAi, 
  getStoredApiKey, 
  getStoredSchoolLicense,
  getStoredProvider, 
  getStoredModel, 
  PROVIDERS 
} from '../services/aiService';
import { getBooksForClass } from '../data/curriculumData';

export default function AiStudio({
  books,
  paperInfo,
  setPaperInfo,
  paperQuestions,
  setPaperQuestions,
  onOpenKeyModal
}) {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [hasGeneratedPaper, setHasGeneratedPaper] = useState(false);

  // Available books for the selected class
  const classBooks = getBooksForClass(paperInfo.classLevel, books);

  const [selectedBookId, setSelectedBookId] = useState(classBooks[0]?.id || 'book-phy-12');
  const [selectedChapterIds, setSelectedChapterIds] = useState(
    classBooks[0]?.chapters.map((c) => c.id) || []
  );

  const [difficulty, setDifficulty] = useState('Balanced');
  const [targetMarks, setTargetMarks] = useState(80);
  const [specialNotes, setSpecialNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');

  // When class changes, automatically update available books and chapters!
  useEffect(() => {
    const updatedClassBooks = getBooksForClass(paperInfo.classLevel, books);
    if (updatedClassBooks.length > 0) {
      const firstBook = updatedClassBooks[0];
      setSelectedBookId(firstBook.id);
      setSelectedChapterIds(firstBook.chapters.map((c) => c.id));
    }
  }, [paperInfo.classLevel, books]);

  // Question Blueprint breakdown
  const [breakdown, setBreakdown] = useState({
    mcq: { count: 16, marks: 1, label: 'Multiple Choice (MCQ)' },
    fillups: { count: 4, marks: 1, label: 'Fill in the Blanks' },
    true_false: { count: 4, marks: 1, label: 'True / False' },
    matching: { count: 2, marks: 4, label: 'Match the Following (4 pairs)' },
    vsa: { count: 6, marks: 2, label: 'Very Short Answers (VSA)' },
    sa: { count: 6, marks: 3, label: 'Short Answers (SA)' },
    la: { count: 4, marks: 5, label: 'Long Answers (LA)' }
  });

  const activeBook = classBooks.find((b) => b.id === selectedBookId) || classBooks[0] || { chapters: [], subject: 'General' };

  // Calculate current marks tally
  const totalAllocatedMarks = Object.values(breakdown).reduce(
    (sum, item) => sum + item.count * item.marks,
    0
  );

  const totalQuestionsCount = Object.values(breakdown).reduce(
    (sum, item) => sum + item.count,
    0
  );

  const updateCount = (type, delta) => {
    setBreakdown((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        count: Math.max(0, prev[type].count + delta)
      }
    }));
  };

  const applyPreset = (preset) => {
    if (preset === '80_marks') {
      setTargetMarks(80);
      setBreakdown({
        mcq: { count: 16, marks: 1, label: 'Multiple Choice (MCQ)' },
        fillups: { count: 4, marks: 1, label: 'Fill in the Blanks' },
        true_false: { count: 4, marks: 1, label: 'True / False' },
        matching: { count: 2, marks: 4, label: 'Match the Following (4 pairs)' },
        vsa: { count: 6, marks: 2, label: 'Very Short Answers (VSA)' },
        sa: { count: 6, marks: 3, label: 'Short Answers (SA)' },
        la: { count: 4, marks: 5, label: 'Long Answers (LA)' }
      });
    } else if (preset === '50_marks') {
      setTargetMarks(50);
      setBreakdown({
        mcq: { count: 10, marks: 1, label: 'Multiple Choice (MCQ)' },
        fillups: { count: 4, marks: 1, label: 'Fill in the Blanks' },
        true_false: { count: 4, marks: 1, label: 'True / False' },
        matching: { count: 1, marks: 4, label: 'Match the Following (4 pairs)' },
        vsa: { count: 4, marks: 2, label: 'Very Short Answers (VSA)' },
        sa: { count: 4, marks: 3, label: 'Short Answers (SA)' },
        la: { count: 2, marks: 5, label: 'Long Answers (LA)' }
      });
    } else if (preset === '25_marks') {
      setTargetMarks(25);
      setBreakdown({
        mcq: { count: 5, marks: 1, label: 'Multiple Choice (MCQ)' },
        fillups: { count: 3, marks: 1, label: 'Fill in the Blanks' },
        true_false: { count: 3, marks: 1, label: 'True / False' },
        matching: { count: 1, marks: 4, label: 'Match the Following (4 pairs)' },
        vsa: { count: 2, marks: 2, label: 'Very Short Answers (VSA)' },
        sa: { count: 2, marks: 3, label: 'Short Answers (SA)' },
        la: { count: 0, marks: 5, label: 'Long Answers (LA)' }
      });
    }
  };

  const handleSelectAllChapters = () => {
    setSelectedChapterIds(activeBook.chapters.map((c) => c.id));
  };

  const handleDeselectAllChapters = () => {
    setSelectedChapterIds([]);
  };

  const handleToggleChapter = (id) => {
    if (selectedChapterIds.includes(id)) {
      setSelectedChapterIds(selectedChapterIds.filter((c) => c !== id));
    } else {
      setSelectedChapterIds([...selectedChapterIds, id]);
    }
  };

  // Trigger Full AI Generation
  const handleGeneratePaper = async () => {
    const key = getStoredApiKey();
    const schoolLicense = getStoredSchoolLicense();

    if (!key && !schoolLicense) {
      onOpenKeyModal();
      return;
    }

    if (selectedChapterIds.length === 0) {
      alert(`Please select at least one chapter from ${activeBook.title}.`);
      return;
    }

    setLoading(true);
    setLoadingStage('Connecting to AI Engine...');

    const chosenChapters = activeBook.chapters.filter((c) => selectedChapterIds.includes(c.id));

    try {
      setLoadingStage(`Reading ${chosenChapters.length} chapters & synthesizing questions...`);

      const questions = await generateFullPaperWithAi({
        apiKey: key,
        providerChoice: getStoredProvider(),
        modelChoice: getStoredModel(),
        subject: activeBook.subject,
        classLevel: paperInfo.classLevel,
        chapters: chosenChapters,
        difficulty,
        targetMarks,
        typeBreakdown: breakdown,
        specialInstructions: specialNotes
      });

      setLoadingStage('Structuring paper layout, answer booklet lines, and solutions...');

      const updatedPaperInfo = {
        ...paperInfo,
        maxMarks: targetMarks
      };
      setPaperInfo(updatedPaperInfo);

      const enriched = questions.map((q) => ({
        ...q,
        bookId: activeBook.id,
        chapterId: chosenChapters[0]?.id || 'ai-ch'
      }));

      setPaperQuestions(enriched);
      setHasGeneratedPaper(true);
      setLoading(false);
    } catch (err) {
      alert(`AI Generation error: ${err.message}`);
      setLoading(false);
    }
  };

  const currentProvider = getStoredProvider();

  // If paper has already been generated by AI, show the completed paper view directly inside AI Studio!
  if (hasGeneratedPaper) {
    return (
      <div className="max-w-5xl mx-auto space-y-6 pb-16">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 p-4 rounded-2xl border border-emerald-700/60 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md no-print">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                AI Exam Paper Generated Successfully ({paperQuestions.length} Questions • {paperInfo.maxMarks} Marks)
              </h3>
              <p className="text-xs text-emerald-200">
                Created for <strong>{paperInfo.classLevel} {activeBook.subject}</strong> with full answer booklet lines and marking scheme.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setHasGeneratedPaper(false)}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition flex items-center gap-1.5 flex-shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Change Blueprint / Re-generate</span>
          </button>
        </div>

        {/* Realistic Question Paper Sheet */}
        <Step5PreviewPaper
          paperInfo={paperInfo}
          setPaperInfo={setPaperInfo}
          questions={paperQuestions}
          setQuestions={setPaperQuestions}
          onBack={() => setHasGeneratedPaper(false)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* AI Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 rounded-2xl p-6 sm:p-8 text-white shadow-lg border border-indigo-900/50">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 border border-amber-400/30">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight">AI Exam Paper Studio</h1>
              <p className="text-xs text-indigo-200 mt-0.5">
                Automatically adapts syllabus for <strong>{paperInfo.classLevel}</strong> across Physics, Chemistry, Math, Science & Humanities.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 border border-white/20 text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {currentProvider === PROVIDERS.GROQ ? 'Groq LPU (Ultra-Fast)' : 'Gemini Flash'}
            </span>
            <button
              type="button"
              onClick={onOpenKeyModal}
              className="px-2.5 py-1 text-xs text-slate-300 hover:text-white underline font-medium"
            >
              Engine Settings
            </button>
          </div>
        </div>
      </div>

      {/* 1. School & Examination Details Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex items-center gap-2 pb-3 border-b border-slate-200">
          <Building2 className="w-5 h-5 text-indigo-600" />
          <h2 className="font-bold text-base text-slate-900">1. School & Examination Credentials</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              School / Institution Name
            </label>
            <input
              type="text"
              value={paperInfo.schoolName}
              onChange={(e) => setPaperInfo({ ...paperInfo, schoolName: e.target.value })}
              placeholder="e.g. St. Xavier's International School"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Examination Name
            </label>
            <input
              type="text"
              value={paperInfo.examName}
              onChange={(e) => setPaperInfo({ ...paperInfo, examName: e.target.value })}
              placeholder="e.g. Annual Board / Pre-Board Examination"
              className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Class Selector */}
          <div>
            <label className="block text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1 flex items-center justify-between">
              <span>Class Level</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 rounded font-bold">Auto-updates</span>
            </label>
            <select
              value={paperInfo.classLevel}
              onChange={(e) => setPaperInfo({ ...paperInfo, classLevel: e.target.value })}
              className="w-full px-3 py-2 border-2 border-indigo-400 bg-indigo-50/50 rounded-xl text-sm font-bold text-indigo-950 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={`Class ${i + 1}`}>
                  Class {i + 1}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Paper Set
            </label>
            <select
              value={paperInfo.set}
              onChange={(e) => setPaperInfo({ ...paperInfo, set: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Set A">Set A</option>
              <option value="Set B">Set B</option>
              <option value="Set C">Set C</option>
              <option value="Set D">Set D</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Time Allowed
            </label>
            <input
              type="text"
              value={paperInfo.timeAllowed}
              onChange={(e) => setPaperInfo({ ...paperInfo, timeAllowed: e.target.value })}
              placeholder="3 Hours"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Academic Session
            </label>
            <input
              type="text"
              value={paperInfo.session}
              onChange={(e) => setPaperInfo({ ...paperInfo, session: e.target.value })}
              placeholder="2025-2026"
              className="w-full px-3 py-2 border border-slate-300 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Logo and Paper Format */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Logo Picker */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {paperInfo.logoUrl ? (
                <img src={paperInfo.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded border" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-slate-400">
                  <ImageIcon className="w-5 h-5" />
                </div>
              )}
              <div>
                <p className="text-xs font-bold text-slate-800">School Logo</p>
                <p className="text-[11px] text-slate-500">{paperInfo.logoUrl ? 'Active on paper' : 'Optional'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsLogoModalOpen(true)}
                className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 rounded-lg hover:bg-slate-100"
              >
                {paperInfo.logoUrl ? 'Change' : 'Select Logo'}
              </button>
              {paperInfo.logoUrl && (
                <button
                  type="button"
                  onClick={() => setPaperInfo({ ...paperInfo, logoUrl: '', hasLogo: false })}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Paper Format Choice */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Layout Format</p>
              <p className="text-[11px] text-slate-500">
                {paperInfo.paperFormat === 'answer_booklet' ? 'With ruled answer spaces' : 'Compact question only'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPaperInfo({ ...paperInfo, paperFormat: 'question_only' })}
                className={`px-2 py-1 rounded ${paperInfo.paperFormat === 'question_only' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
              >
                Question Only
              </button>
              <button
                type="button"
                onClick={() => setPaperInfo({ ...paperInfo, paperFormat: 'answer_booklet' })}
                className={`px-2 py-1 rounded ${paperInfo.paperFormat === 'answer_booklet' ? 'bg-indigo-600 text-white' : 'text-slate-600'}`}
              >
                Answer Booklet
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Subject & Chapters Selection */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-base text-slate-900">
              2. {paperInfo.classLevel} Subject & Chapters for AI to Cover
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSelectAllChapters}
              className="text-xs text-indigo-600 font-bold hover:underline"
            >
              Select All Chapters
            </button>
            <span className="text-slate-300">|</span>
            <button
              type="button"
              onClick={handleDeselectAllChapters}
              className="text-xs text-slate-500 hover:text-slate-700"
            >
              Deselect All
            </button>
          </div>
        </div>

        {/* Book Selector */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
            Select {paperInfo.classLevel} Subject / Textbook
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => {
              setSelectedBookId(e.target.value);
              const found = classBooks.find((b) => b.id === e.target.value);
              if (found) {
                setSelectedChapterIds(found.chapters.map((c) => c.id));
              }
            }}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            {classBooks.map((b) => (
              <option key={b.id} value={b.id}>
                [{b.subject}] {b.title} ({b.chapters.length} Chapters)
              </option>
            ))}
          </select>
        </div>

        {/* Chapters Grid */}
        <div className="pt-2">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {activeBook.title} Chapters ({selectedChapterIds.length} of {activeBook.chapters.length} Selected)
            </label>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              {activeBook.subject}
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
            {activeBook.chapters.map((ch) => {
              const isChecked = selectedChapterIds.includes(ch.id);
              return (
                <label
                  key={ch.id}
                  className={`flex items-start gap-2.5 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                    isChecked
                      ? 'bg-indigo-50/70 border-indigo-400 font-semibold text-slate-900 ring-1 ring-indigo-200'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleToggleChapter(ch.id)}
                    className="mt-0.5 w-4 h-4 text-indigo-600 rounded"
                  />
                  <span>{ch.title}</span>
                </label>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. AI Exam Blueprint & Target Marks Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-indigo-600" />
            <h2 className="font-bold text-base text-slate-900">3. Exam Blueprint & Question Distribution</h2>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-slate-500 font-semibold">Presets:</span>
            <button
              type="button"
              onClick={() => applyPreset('80_marks')}
              className="px-2.5 py-1 text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg hover:bg-indigo-100"
            >
              80 Marks Full Exam
            </button>
            <button
              type="button"
              onClick={() => applyPreset('50_marks')}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200"
            >
              50 Marks
            </button>
            <button
              type="button"
              onClick={() => applyPreset('25_marks')}
              className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-200"
            >
              25 Marks
            </button>
          </div>
        </div>

        {/* Target Marks & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Target Maximum Marks
            </label>
            <input
              type="number"
              min="10"
              max="200"
              value={targetMarks}
              onChange={(e) => setTargetMarks(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-lg font-bold text-indigo-700 focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Test Difficulty Level
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold focus:bg-white focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="Balanced">Balanced (Standard Board Mix - Easy, Medium, Application)</option>
              <option value="Easy">Easy (Recall & Fundamentals)</option>
              <option value="Moderate">Moderate (Conceptual Reasoning & Numerical)</option>
              <option value="HOTS">Challenging / HOTS (Higher Order Thinking)</option>
            </select>
          </div>
        </div>

        {/* Live Blueprint Summary Bar */}
        <div className="p-4 rounded-xl bg-slate-900 text-white flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Allocated by Question Types</p>
            <p className="text-xl font-bold">
              {totalAllocatedMarks} <span className="text-sm font-normal text-slate-400">/ {targetMarks} Marks</span>
            </p>
          </div>

          <div className="text-right">
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Total Questions</p>
            <p className="text-xl font-bold">{totalQuestionsCount}</p>
          </div>

          <div>
            {totalAllocatedMarks === targetMarks ? (
              <span className="px-3 py-1 bg-emerald-900/60 border border-emerald-500/50 text-emerald-300 text-xs font-bold rounded-lg flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Exact {targetMarks}M Match
              </span>
            ) : totalAllocatedMarks < targetMarks ? (
              <span className="px-3 py-1 bg-amber-900/60 border border-amber-500/50 text-amber-300 text-xs font-bold rounded-lg">
                Add {targetMarks - totalAllocatedMarks} more marks
              </span>
            ) : (
              <span className="px-3 py-1 bg-rose-900/60 border border-rose-500/50 text-rose-300 text-xs font-bold rounded-lg">
                Exceeds by {totalAllocatedMarks - targetMarks} marks
              </span>
            )}
          </div>
        </div>

        {/* Set of Questions Breakdown Grid */}
        <div className="space-y-2.5 pt-2">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Specify Question Types & Quantities
          </label>

          {Object.entries(breakdown).map(([typeKey, cfg]) => (
            <div
              key={typeKey}
              className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-xs text-slate-900">{cfg.label}</p>
                <p className="text-[11px] text-slate-500">{cfg.marks} Mark{cfg.marks > 1 ? 's' : ''} each</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => updateCount(typeKey, -1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center font-bold text-xs text-slate-900">
                    {cfg.count}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateCount(typeKey, 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-100"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="w-16 text-right">
                  <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">
                    {cfg.count * cfg.marks} M
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Optional Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Teacher Notes / Custom Focus Topics (Optional)
          </label>
          <input
            type="text"
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="e.g. Include numerical problems and balancing equations"
            className="w-full px-3.5 py-2 border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* 4. Action Button */}
      <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-sm text-slate-900">Ready to Generate {paperInfo.classLevel} Exam</h3>
          <p className="text-xs text-slate-500">
            AI will synthesize all {totalQuestionsCount} questions ({totalAllocatedMarks} Marks) covering {activeBook.subject}.
          </p>
        </div>

        <button
          type="button"
          disabled={loading || selectedChapterIds.length === 0}
          onClick={handleGeneratePaper}
          className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-amber-500 via-indigo-600 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{loadingStage || 'Generating Paper...'}</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Generate Complete {targetMarks} Marks Exam Paper</span>
            </>
          )}
        </button>
      </div>

      {/* Logo Modal */}
      <LogoPickerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        selectedLogo={paperInfo.logoUrl}
        onSelectLogo={(url) => {
          setPaperInfo({ ...paperInfo, logoUrl: url, hasLogo: true });
        }}
      />
    </div>
  );
}
