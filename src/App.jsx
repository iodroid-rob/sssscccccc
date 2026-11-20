import React, { useState } from 'react';
import Header from './components/Header';
import Step1BasicInfo from './components/Step1BasicInfo';
import Step2BookChapter from './components/Step2BookChapter';
import Step3QuestionTypes from './components/Step3QuestionTypes';
import Step4QuestionBank from './components/Step4QuestionBank';
import Step5PreviewPaper from './components/Step5PreviewPaper';
import AiStudio from './components/AiStudio';
import AiConfigurationModal from './components/AiConfigurationModal';
import SchoolLicenseModal from './components/SchoolLicenseModal';
import { 
  INITIAL_BOOKS, 
  INITIAL_QUESTION_BANK, 
  SAMPLE_LOGOS 
} from './data/curriculumData';
import { getStoredApiKey } from './services/aiService';

export default function App() {
  const [activeMode, setActiveMode] = useState('ai'); // Default to AI Studio so teachers land right on the AI generator!
  const [currentStep, setCurrentStep] = useState(1);
  const [isKeyModalOpen, setIsKeyModalOpen] = useState(false);
  const [isLicenseModalOpen, setIsLicenseModalOpen] = useState(false);
  const [apiKeyActive, setApiKeyActive] = useState(Boolean(getStoredApiKey()));

  // School & Exam Details
  const [paperInfo, setPaperInfo] = useState({
    schoolName: 'Delhi Public School & Academy',
    hasLogo: true,
    logoUrl: SAMPLE_LOGOS[0].url,
    examName: 'Annual Comprehensive Examination',
    session: '2025-2026',
    classLevel: 'Class 9',
    set: 'Set A',
    maxMarks: 80,
    timeAllowed: '3 Hours',
    paperFormat: 'answer_booklet',
    instructions: '1. All questions are compulsory unless internal choice is given.\n2. Write your answers neatly in the designated response lines below each question.\n3. Marks for each question are mentioned on the right hand side.'
  });

  // Books & Chapters
  const [books, setBooks] = useState(INITIAL_BOOKS);
  const [selectedBookIds, setSelectedBookIds] = useState(['book-sci-9']);
  const [selectedChapterIds, setSelectedChapterIds] = useState([
    'ch-sci9-1',
    'ch-sci9-2',
    'ch-sci9-3',
    'ch-sci9-4',
    'ch-sci9-5'
  ]);

  // Question Types & Blueprint for Manual Mode
  const [typeAllocation, setTypeAllocation] = useState({
    mcq: { enabled: true, count: 5, marksPerQuestion: 1 },
    fillups: { enabled: true, count: 3, marksPerQuestion: 1 },
    true_false: { enabled: true, count: 3, marksPerQuestion: 1 },
    matching: { enabled: true, count: 1, marksPerQuestion: 4 },
    vsa: { enabled: true, count: 3, marksPerQuestion: 2 },
    sa: { enabled: true, count: 3, marksPerQuestion: 3 },
    la: { enabled: true, count: 2, marksPerQuestion: 5 }
  });

  // Question Bank & Selected Questions
  const [questionBank, setQuestionBank] = useState(INITIAL_QUESTION_BANK);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([
    'q-sci-1',
    'q-sci-2',
    'q-sci-3',
    'q-sci-4',
    'q-sci-5',
    'q-sci-6',
    'q-sci-7'
  ]);

  // Final Paper Questions
  const [paperQuestions, setPaperQuestions] = useState(() => {
    return [
      'q-sci-1',
      'q-sci-2',
      'q-sci-3',
      'q-sci-4',
      'q-sci-5',
      'q-sci-6',
      'q-sci-7'
    ]
      .map((id) => INITIAL_QUESTION_BANK.find((q) => q.id === id))
      .filter(Boolean);
  });

  // When moving to step 5 in manual mode, compile questions
  const handleProceedToStep5FromManual = () => {
    const list = selectedQuestionIds
      .map((id) => questionBank.find((q) => q.id === id))
      .filter(Boolean);
    setPaperQuestions(list);
    setCurrentStep(5);
  };

  const handleReset = () => {
    if (confirm('Are you sure you want to reset all data and start a new question paper?')) {
      setPaperInfo({
        schoolName: '',
        hasLogo: false,
        logoUrl: '',
        examName: '',
        session: '2025-2026',
        classLevel: 'Class 9',
        set: 'Set A',
        maxMarks: 80,
        timeAllowed: '3 Hours',
        paperFormat: 'question_only',
        instructions: ''
      });
      setSelectedBookIds([]);
      setSelectedChapterIds([]);
      setSelectedQuestionIds([]);
      setPaperQuestions([]);
      setCurrentStep(1);
    }
  };

  const handleLoadSample = () => {
    setPaperInfo({
      schoolName: "St. Xavier's Model Senior Secondary School",
      hasLogo: true,
      logoUrl: SAMPLE_LOGOS[0].url,
      examName: 'Annual Comprehensive Examination',
      session: '2025-2026',
      classLevel: 'Class 10',
      set: 'Set A',
      maxMarks: 80,
      timeAllowed: '3 Hours',
      paperFormat: 'answer_booklet',
      instructions: '1. Read the question paper carefully before attempting.\n2. Write answers strictly within the designated answer lines under each question.\n3. Section A contains objective type questions carrying 1 mark each.\n4. Section B and C contain descriptive questions carrying 2, 3 and 5 marks.'
    });

    setSelectedBookIds(['book-sci-10', 'book-math-10']);
    setSelectedChapterIds([
      'ch-sci-1',
      'ch-sci-2',
      'ch-sci-4',
      'ch-sci-6',
      'ch-math-1',
      'ch-math-2',
      'ch-math-5',
      'ch-math-7'
    ]);

    const sampleIds = [
      'q-sci-1',
      'q-math-1',
      'q-sci-2',
      'q-math-2',
      'q-sci-3',
      'q-math-3',
      'q-sci-4',
      'q-math-4',
      'q-sci-5',
      'q-math-5',
      'q-sci-6',
      'q-math-6',
      'q-sci-7',
      'q-math-7'
    ];

    setSelectedQuestionIds(sampleIds);
    setPaperQuestions(
      sampleIds.map((id) => questionBank.find((q) => q.id === id)).filter(Boolean)
    );

    setActiveMode('manual');
    setCurrentStep(5);
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <Header
        activeMode={activeMode}
        setActiveMode={setActiveMode}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        onReset={handleReset}
        onLoadSample={handleLoadSample}
        onOpenKeyModal={() => setIsKeyModalOpen(true)}
        apiKeyActive={apiKeyActive}
        onOpenLicenseModal={() => setIsLicenseModalOpen(true)}
      />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        {/* MODE 1: AI EXAM STUDIO (Full-page AI Generation & Self-contained Preview) */}
        {activeMode === 'ai' && (
          <AiStudio
            books={books}
            paperInfo={paperInfo}
            setPaperInfo={setPaperInfo}
            paperQuestions={paperQuestions}
            setPaperQuestions={setPaperQuestions}
            onOpenKeyModal={() => setIsKeyModalOpen(true)}
          />
        )}

        {/* MODE 2: STANDARD MANUAL PAPER CREATOR (5 Clean Steps) */}
        {activeMode === 'manual' && (
          <>
            {currentStep === 1 && (
              <Step1BasicInfo
                paperInfo={paperInfo}
                setPaperInfo={setPaperInfo}
                onNext={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 2 && (
              <Step2BookChapter
                books={books}
                setBooks={setBooks}
                selectedBookIds={selectedBookIds}
                setSelectedBookIds={setSelectedBookIds}
                selectedChapterIds={selectedChapterIds}
                setSelectedChapterIds={setSelectedChapterIds}
                classLevel={paperInfo.classLevel}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {currentStep === 3 && (
              <Step3QuestionTypes
                typeAllocation={typeAllocation}
                setTypeAllocation={setTypeAllocation}
                maxMarks={paperInfo.maxMarks}
                onNext={() => setCurrentStep(4)}
                onBack={() => setCurrentStep(2)}
              />
            )}

            {currentStep === 4 && (
              <Step4QuestionBank
                questionBank={questionBank}
                setQuestionBank={setQuestionBank}
                selectedQuestionIds={selectedQuestionIds}
                setSelectedQuestionIds={setSelectedQuestionIds}
                typeAllocation={typeAllocation}
                selectedBookIds={selectedBookIds}
                selectedChapterIds={selectedChapterIds}
                books={books}
                onNext={handleProceedToStep5FromManual}
                onBack={() => setCurrentStep(3)}
              />
            )}

            {currentStep === 5 && (
              <Step5PreviewPaper
                paperInfo={paperInfo}
                setPaperInfo={setPaperInfo}
                questions={paperQuestions}
                setQuestions={setPaperQuestions}
                onBack={() => setCurrentStep(4)}
              />
            )}
          </>
        )}
      </main>

      {/* AI Key & Provider Configuration Modal */}
      <AiConfigurationModal
        isOpen={isKeyModalOpen}
        onClose={() => setIsKeyModalOpen(false)}
        onKeyUpdated={(key) => setApiKeyActive(Boolean(key))}
      />

      {/* Commercial School License & Threat Shield Modal */}
      <SchoolLicenseModal
        isOpen={isLicenseModalOpen}
        onClose={() => setIsLicenseModalOpen(false)}
      />
    </div>
  );
}
