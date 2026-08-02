import React, { useState } from 'react';
import {
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  RotateCw,
  Check,
  AlertTriangle,
  Shuffle,
  Loader2
} from 'lucide-react';
import { Flashcard, Course, Document } from '../types.js';

interface FlashcardsViewProps {
  flashcards: Flashcard[];
  courses: Course[];
  documents: Document[];
  onGenerateFlashcards: (data: { courseId?: string; documentId?: string; topic?: string }) => Promise<void>;
  onUpdateStatus: (id: string, status: 'known' | 'difficult' | 'unseen') => Promise<void>;
}

export function FlashcardsView({
  flashcards,
  courses,
  documents,
  onGenerateFlashcards,
  onUpdateStatus,
}: FlashcardsViewProps) {
  const [courseId, setCourseId] = useState<string>(courses[0]?.id || '');
  const [documentId, setDocumentId] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cardsList, setCardsList] = useState<Flashcard[]>(flashcards);

  React.useEffect(() => {
    setCardsList(flashcards);
  }, [flashcards]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      await onGenerateFlashcards({
        courseId: courseId || undefined,
        documentId: documentId || undefined,
        topic: topic || undefined,
      });
      setCurrentIdx(0);
      setIsFlipped(false);
    } catch (err: any) {
      alert('Error generating flashcards: ' + (err?.message || 'Error'));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShuffle = () => {
    const shuffled = [...cardsList].sort(() => Math.random() - 0.5);
    setCardsList(shuffled);
    setCurrentIdx(0);
    setIsFlipped(false);
  };

  const handleStatus = async (status: 'known' | 'difficult') => {
    if (cardsList[currentIdx]) {
      await onUpdateStatus(cardsList[currentIdx].id, status);
      if (currentIdx < cardsList.length - 1) {
        setCurrentIdx((prev) => prev + 1);
        setIsFlipped(false);
      }
    }
  };

  const currentCard = cardsList[currentIdx];

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto text-slate-900">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
            <Layers className="text-blue-600" />
            <span>AI Flashcards Generator & Deck</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Master core computer science definitions, complexity algorithms, and formulas with spaced repetition.
          </p>
        </div>

        <button
          onClick={handleShuffle}
          disabled={cardsList.length === 0}
          className="inline-flex items-center space-x-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition"
        >
          <Shuffle size={14} />
          <span>Shuffle Deck</span>
        </button>
      </div>

      {/* Generator Options */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4">
        <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs items-end font-medium">
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Course Module</label>
            <select
              value={courseId}
              onChange={(e) => {
                setCourseId(e.target.value);
                setDocumentId('');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Courses Notes</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Document (Optional)</label>
            <select
              value={documentId}
              onChange={(e) => setDocumentId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 truncate"
            >
              <option value="">All Notes in Module</option>
              {documents
                .filter((d) => !courseId || d.courseId === courseId)
                .map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fileName}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">Topic Keyword</label>
            <input
              type="text"
              placeholder="e.g. CPU Architecture, BST Trees..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isGenerating}
            className="flex items-center justify-center space-x-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 rounded-lg shadow-xs transition"
          >
            {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
            <span>Generate Deck</span>
          </button>
        </form>
      </div>

      {/* Main Flashcard Container */}
      {!currentCard ? (
        <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-500 text-xs space-y-3">
          <Layers size={36} className="mx-auto text-slate-400" />
          <p>No flashcards available in this deck. Click "Generate Deck" above to create custom cards!</p>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl mx-auto">
          {/* Card Counter & Progress */}
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span className="font-bold text-blue-600">
              Card {currentIdx + 1} of {cardsList.length}
            </span>
            <div className="flex items-center space-x-2">
              <span className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-bold text-slate-700 shadow-xs">
                {currentCard.topic || 'CS Core'}
              </span>
            </div>
          </div>

          {/* 3D Interactive Card */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`min-h-[280px] sm:min-h-[320px] border-2 rounded-2xl p-8 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-md relative select-none ${
              isFlipped
                ? 'border-blue-400 bg-gradient-to-br from-blue-50/50 via-white to-blue-50/30'
                : 'border-slate-200 hover:border-slate-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span>{isFlipped ? 'BACK (EXPLANATION)' : 'FRONT (QUESTION / CONCEPT)'}</span>
              <span className="flex items-center space-x-1 text-blue-600 font-bold">
                <RotateCw size={12} />
                <span>Click to flip</span>
              </span>
            </div>

            <div className="my-auto text-center space-y-3">
              <p className="text-base sm:text-xl font-bold text-slate-900 leading-relaxed">
                {isFlipped ? currentCard.back : currentCard.front}
              </p>
            </div>

            <div className="text-[10px] text-slate-500 text-center font-medium">
              Status: <span className="uppercase text-slate-800 font-bold">{currentCard.status}</span>
            </div>
          </div>

          {/* Controls: Known / Difficult & Prev/Next */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleStatus('known')}
                className="inline-flex items-center space-x-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                <Check size={14} />
                <span>Mark Known</span>
              </button>

              <button
                onClick={() => handleStatus('difficult')}
                className="inline-flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-semibold px-4 py-2 rounded-lg transition"
              >
                <AlertTriangle size={14} />
                <span>Mark Difficult</span>
              </button>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setCurrentIdx((prev) => Math.max(0, prev - 1));
                  setIsFlipped(false);
                }}
                disabled={currentIdx === 0}
                className="p-2.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 shadow-xs"
              >
                <ChevronLeft size={18} />
              </button>

              <button
                onClick={() => {
                  setCurrentIdx((prev) => Math.min(cardsList.length - 1, prev + 1));
                  setIsFlipped(false);
                }}
                disabled={currentIdx === cardsList.length - 1}
                className="p-2.5 rounded-lg bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-700 border border-slate-200 shadow-xs"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
