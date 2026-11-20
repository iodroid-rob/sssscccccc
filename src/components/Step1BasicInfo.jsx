import React, { useState } from 'react';
import { 
  Building2, 
  Image as ImageIcon, 
  CheckCircle2, 
  Trash2, 
  FileText, 
  Calendar, 
  GraduationCap, 
  Tag, 
  Award, 
  Clock, 
  BookMarked,
  Layers,
  ArrowRight
} from 'lucide-react';
import LogoPickerModal from './LogoPickerModal';

export default function Step1BasicInfo({ paperInfo, setPaperInfo, onNext }) {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);

  const handleChange = (field, value) => {
    setPaperInfo((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleLogo = (enabled) => {
    setPaperInfo((prev) => ({
      ...prev,
      hasLogo: enabled,
      logoUrl: enabled ? prev.logoUrl : ''
    }));
    if (enabled && !paperInfo.logoUrl) {
      setIsLogoModalOpen(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Intro Banner */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 1: School & Examination Profile</h2>
            <p className="text-sm text-slate-500 mt-1">
              Configure your institution details, exam credentials, and paper format mode.
            </p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
            Step 1 of 5
          </span>
        </div>

        <div className="mt-8 space-y-6">
          {/* 1. School Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              1. School / Institution Name <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="w-5 h-5" />
              </div>
              <input
                type="text"
                required
                value={paperInfo.schoolName}
                onChange={(e) => handleChange('schoolName', e.target.value)}
                placeholder="e.g. St. Xavier's International School / Delhi Public School"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* 2. School Logo (Optional, with gallery picker & upload) */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-bold text-slate-800">School Logo / Emblem (Optional)</span>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-600">
                  <input
                    type="checkbox"
                    checked={paperInfo.hasLogo}
                    onChange={(e) => handleToggleLogo(e.target.checked)}
                    className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                  />
                  Include Logo in Header
                </label>
              </div>
            </div>

            {paperInfo.hasLogo && (
              <div className="pt-2 flex flex-wrap items-center gap-4">
                {paperInfo.logoUrl ? (
                  <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <img
                      src={paperInfo.logoUrl}
                      alt="Selected School Logo"
                      className="w-14 h-14 object-cover rounded-lg border border-slate-100"
                    />
                    <div>
                      <p className="text-xs font-semibold text-slate-800">Logo Active</p>
                      <button
                        type="button"
                        onClick={() => setIsLogoModalOpen(true)}
                        className="text-xs text-indigo-600 font-medium hover:underline"
                      >
                        Change from Gallery / Upload
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleChange('logoUrl', '')}
                      className="p-1.5 text-slate-400 hover:text-rose-600 transition"
                      title="Remove logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsLogoModalOpen(true)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs flex items-center gap-2 transition"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Select Picture from Gallery or Upload
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 3, 4. Examination Name & Session */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                3. Examination Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <FileText className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={paperInfo.examName}
                  onChange={(e) => handleChange('examName', e.target.value)}
                  placeholder="e.g. Half-Yearly Examination / Annual Exam"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                4. Academic Session <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Calendar className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={paperInfo.session}
                  onChange={(e) => handleChange('session', e.target.value)}
                  placeholder="e.g. 2025-2026"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>
          </div>

          {/* 5, 6, 7. Class, Set, Maximum Marks, Time */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                5. Class <span className="text-rose-500">*</span>
              </label>
              <select
                value={paperInfo.classLevel}
                onChange={(e) => handleChange('classLevel', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                {[...Array(12)].map((_, i) => (
                  <option key={i + 1} value={`Class ${i + 1}`}>
                    Class {i + 1}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                6. Paper Set <span className="text-rose-500">*</span>
              </label>
              <select
                value={paperInfo.set}
                onChange={(e) => handleChange('set', e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              >
                <option value="Set A">Set A</option>
                <option value="Set B">Set B</option>
                <option value="Set C">Set C</option>
                <option value="Set D">Set D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                7. Max Marks <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="10"
                max="200"
                value={paperInfo.maxMarks}
                onChange={(e) => handleChange('maxMarks', Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-bold text-indigo-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Time Allowed
              </label>
              <input
                type="text"
                value={paperInfo.timeAllowed}
                onChange={(e) => handleChange('timeAllowed', e.target.value)}
                placeholder="e.g. 3 Hours"
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
              />
            </div>
          </div>

          {/* 8. PAPER FORMAT OPTION: QUESTION PAPER ONLY vs ANSWER BOOKLET COMBINED */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              8. Format Style: Paper Type Selection <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Option A: Only Question Paper */}
              <div
                onClick={() => handleChange('paperFormat', 'question_only')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paperInfo.paperFormat === 'question_only'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Only Question Paper</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Standard compact exam sheet</p>
                    </div>
                  </div>
                  {paperInfo.paperFormat === 'question_only' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div className="mt-3 text-xs text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-100">
                  Students write answers on a separate answer sheet. Questions are packed efficiently without writing lines.
                </div>
              </div>

              {/* Option B: Question Paper + Answer Booklet with Writing Space */}
              <div
                onClick={() => handleChange('paperFormat', 'answer_booklet')}
                className={`relative p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                  paperInfo.paperFormat === 'answer_booklet'
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                      <BookMarked className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">Question Paper + Answer Booklet</h4>
                      <p className="text-xs text-indigo-600 font-semibold mt-0.5">Worksheet style with answer lines</p>
                    </div>
                  </div>
                  {paperInfo.paperFormat === 'answer_booklet' && (
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  )}
                </div>
                <div className="mt-3 text-xs text-slate-600 leading-relaxed bg-white/70 p-2.5 rounded-lg border border-slate-100">
                  Generates designated ruled lines / writing spaces directly below every question for students to answer within the paper.
                </div>
              </div>
            </div>
          </div>

          {/* General Instructions */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              General Instructions for Students
            </label>
            <textarea
              rows={3}
              value={paperInfo.instructions}
              onChange={(e) => handleChange('instructions', e.target.value)}
              placeholder="1. All questions are compulsory.&#10;2. Read questions carefully before answering."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none font-mono text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Footer Next Button */}
        <div className="mt-8 pt-6 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
          >
            <span>Proceed to Books & Chapters</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <LogoPickerModal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        selectedLogo={paperInfo.logoUrl}
        onSelectLogo={(url) => {
          handleChange('logoUrl', url);
          handleChange('hasLogo', true);
        }}
      />
    </div>
  );
}
