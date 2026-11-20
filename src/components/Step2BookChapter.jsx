import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  CheckSquare, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { getBooksForClass } from '../data/curriculumData';

export default function Step2BookChapter({ 
  books, 
  setBooks, 
  selectedBookIds, 
  setSelectedBookIds, 
  selectedChapterIds, 
  setSelectedChapterIds, 
  classLevel,
  onNext, 
  onBack 
}) {
  const [showAddBookModal, setShowAddBookModal] = useState(false);
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookSubject, setNewBookSubject] = useState('');
  const [newBookChapters, setNewBookChapters] = useState(['Chapter 1: Introduction', 'Chapter 2: Fundamental Concepts']);
  const [filterByClassOnly, setFilterByClassOnly] = useState(true);

  // Filter books matching selected class
  const classSpecificBooks = getBooksForClass(classLevel, books);
  const displayedBooks = filterByClassOnly ? classSpecificBooks : books;

  // If currently selected books do not match the class, auto-select first book of class
  useEffect(() => {
    if (classSpecificBooks.length > 0) {
      const hasCurrentClassSelected = selectedBookIds.some(id => 
        classSpecificBooks.some(b => b.id === id)
      );
      if (!hasCurrentClassSelected) {
        const first = classSpecificBooks[0];
        setSelectedBookIds([first.id]);
        setSelectedChapterIds(first.chapters.map(c => c.id));
      }
    }
  }, [classLevel]);

  // Toggle a book selection
  const handleToggleBook = (bookId) => {
    let nextBooks;
    if (selectedBookIds.includes(bookId)) {
      nextBooks = selectedBookIds.filter((id) => id !== bookId);
      const bookObj = books.find((b) => b.id === bookId) || classSpecificBooks.find(b => b.id === bookId);
      if (bookObj) {
        const bookChapIds = bookObj.chapters.map((c) => c.id);
        setSelectedChapterIds(selectedChapterIds.filter((id) => !bookChapIds.includes(id)));
      }
    } else {
      nextBooks = [...selectedBookIds, bookId];
      const bookObj = books.find((b) => b.id === bookId) || classSpecificBooks.find(b => b.id === bookId);
      if (bookObj) {
        const bookChapIds = bookObj.chapters.map((c) => c.id);
        setSelectedChapterIds(Array.from(new Set([...selectedChapterIds, ...bookChapIds])));
      }
    }
    setSelectedBookIds(nextBooks);
  };

  const handleSelectAllBookChapters = (book) => {
    const chapIds = book.chapters.map((c) => c.id);
    setSelectedChapterIds(Array.from(new Set([...selectedChapterIds, ...chapIds])));
  };

  const handleDeselectAllBookChapters = (book) => {
    const chapIds = book.chapters.map((c) => c.id);
    setSelectedChapterIds(selectedChapterIds.filter((id) => !chapIds.includes(id)));
  };

  const handleToggleChapter = (chapterId) => {
    if (selectedChapterIds.includes(chapterId)) {
      setSelectedChapterIds(selectedChapterIds.filter((id) => id !== chapterId));
    } else {
      setSelectedChapterIds([...selectedChapterIds, chapterId]);
    }
  };

  const handleCreateCustomBook = (e) => {
    e.preventDefault();
    if (!newBookTitle.trim()) return;

    const bookId = `custom-book-${Date.now()}`;
    const chapterObjects = newBookChapters
      .filter((title) => title.trim().length > 0)
      .map((title, idx) => ({
        id: `custom-ch-${Date.now()}-${idx + 1}`,
        title: title.trim()
      }));

    const newBook = {
      id: bookId,
      title: newBookTitle.trim(),
      subject: newBookSubject.trim() || 'Custom Subject',
      classLevel: classLevel || 'Custom Class',
      chapters: chapterObjects
    };

    setBooks([...books, newBook]);
    setSelectedBookIds([...selectedBookIds, bookId]);
    setSelectedChapterIds([...selectedChapterIds, ...chapterObjects.map((c) => c.id)]);

    setShowAddBookModal(false);
    setNewBookTitle('');
    setNewBookSubject('');
    setNewBookChapters(['Chapter 1: ', 'Chapter 2: ']);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Step 2: Select Book(s) & Chapters</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
                {classLevel}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Curriculum updated for <strong>{classLevel}</strong>. Select textbooks and choose whether to include all chapters or selective chapters.
            </p>
          </div>
          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
            Step 2 of 5
          </span>
        </div>

        {/* 1. Books Selection Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {classLevel} Syllabus Books ({displayedBooks.length})
              </label>
              <button
                type="button"
                onClick={() => setFilterByClassOnly(!filterByClassOnly)}
                className="text-[11px] text-indigo-600 hover:underline font-medium"
              >
                {filterByClassOnly ? 'Show all other classes too' : `Filter only ${classLevel}`}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setShowAddBookModal(true)}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Add Custom Book / Syllabus
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {displayedBooks.map((book) => {
              const isSelected = selectedBookIds.includes(book.id);
              const selectedCount = book.chapters.filter((c) => selectedChapterIds.includes(c.id)).length;

              return (
                <div
                  key={book.id}
                  onClick={() => handleToggleBook(book.id)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs ring-1 ring-indigo-200'
                      : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        {book.subject}
                      </span>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 mt-2 line-clamp-1">{book.title}</h4>
                  <div className="mt-2 text-xs flex items-center justify-between text-slate-500">
                    <span className="text-[11px] font-bold text-slate-400">{book.classLevel}</span>
                    <span className="font-medium text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full text-[11px]">
                      {selectedCount} / {book.chapters.length} ch
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Display Chapters of Selected Books */}
        <div className="mt-8 space-y-6">
          {selectedBookIds.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <BookOpen className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No books selected yet</p>
              <p className="text-xs text-slate-500 mt-1">Please select at least one book above to view and choose its chapters.</p>
            </div>
          ) : (
            selectedBookIds.map((bookId) => {
              const book = books.find((b) => b.id === bookId) || classSpecificBooks.find(b => b.id === bookId);
              if (!book) return null;

              const selectedCount = book.chapters.filter((c) => selectedChapterIds.includes(c.id)).length;

              return (
                <div key={book.id} className="p-5 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 rounded">
                          {book.subject}
                        </span>
                        <h3 className="font-bold text-slate-900 text-base">{book.title}</h3>
                        <span className="text-xs text-slate-500">({book.classLevel})</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedCount} of {book.chapters.length} chapters selected for this exam
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleSelectAllBookChapters(book)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition flex items-center gap-1.5"
                      >
                        <CheckSquare className="w-3.5 h-3.5 text-indigo-600" />
                        Select All Chapters
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeselectAllBookChapters(book)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-600 rounded-lg text-xs font-medium shadow-2xs transition"
                      >
                        Deselect All
                      </button>
                    </div>
                  </div>

                  {/* Chapters Checkbox List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                    {book.chapters.map((chapter) => {
                      const isChecked = selectedChapterIds.includes(chapter.id);
                      return (
                        <label
                          key={chapter.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                            isChecked
                              ? 'bg-white border-indigo-300 shadow-2xs ring-1 ring-indigo-200'
                              : 'bg-white/60 border-slate-200 hover:bg-white text-slate-600'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleToggleChapter(chapter.id)}
                            className="mt-0.5 w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                          />
                          <div className="text-xs">
                            <span className={`font-semibold ${isChecked ? 'text-slate-900' : 'text-slate-700'}`}>
                              {chapter.title}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
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
            <span>Back to Exam Info</span>
          </button>

          <button
            type="button"
            disabled={selectedChapterIds.length === 0}
            onClick={onNext}
            className={`px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md transition flex items-center gap-2 ${
              selectedChapterIds.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-lg'
            }`}
          >
            <span>Proceed to Question Types</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Add Custom Book Modal */}
      {showAddBookModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 p-6 space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Add Custom Textbook & Chapters for {classLevel}</h3>
            <form onSubmit={handleCreateCustomBook} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Book Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Secondary Physics Guide"
                  value={newBookTitle}
                  onChange={(e) => setNewBookTitle(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                <input
                  type="text"
                  placeholder="e.g. Physics / Mathematics"
                  value={newBookSubject}
                  onChange={(e) => setNewBookSubject(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700 uppercase">Chapters</label>
                  <button
                    type="button"
                    onClick={() => setNewBookChapters([...newBookChapters, `Chapter ${newBookChapters.length + 1}: `])}
                    className="text-xs text-indigo-600 font-semibold"
                  >
                    + Add Chapter
                  </button>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {newBookChapters.map((ch, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={ch}
                      onChange={(e) => {
                        const copy = [...newBookChapters];
                        copy[idx] = e.target.value;
                        setNewBookChapters(copy);
                      }}
                      className="w-full px-3 py-1.5 border rounded-lg text-sm"
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddBookModal(false)}
                  className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700"
                >
                  Save & Use Book
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
