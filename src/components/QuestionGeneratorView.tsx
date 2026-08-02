import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  BookOpen,
  FileText,
  Clock,
  Play,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Loader2,
  SlidersHorizontal
} from 'lucide-react';
import { Course, Document, Quiz } from '../types.js';

interface QuestionGeneratorViewProps {
  courses: Course[];
  documents: Document[];
  onGenerateQuiz: (data: {
    courseId?: string;
    documentId?: string;
    topic?: string;
    difficulty?: string;
    numQuestions?: number;
    questionType?: string;
  }) => Promise<{ quiz: Quiz; error?: string }>;
  onStartExam: (quiz: Quiz) => void;
}

export function QuestionGeneratorView({
  courses,
  documents,
  onGenerateQuiz,
  onStartExam,
}: QuestionGeneratorViewProps) {
  const [courseId, setCourseId] = useState<string>(courses[0]?.id || '');
  const [documentId, setDocumentId] = useState<string>('');
  const [topic, setTopic] = useState('');
  const [difficulty, setDifficulty] = useState('University Exam Level');
  const [numQuestions, setNumQuestions] = useState(5);
  const [questionType, setQuestionType] = useState('mixed');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuiz, setGeneratedQuiz] = useState<Quiz | null>(null);
  const [expandedQId, setExpandedQId] = useState<string | null>(null);

  const courseDocs = documents.filter((d) => !courseId || d.courseId === courseId);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedQuiz(null);

    try {
      const res = await onGenerateQuiz({
        courseId: courseId || undefined,
        documentId: documentId || undefined,
        topic: topic || 'General Course Content',
        difficulty,
        numQuestions,
        questionType,
      });

      if (res.error) {
        alert(res.error);
      } else if (res.quiz) {
        setGeneratedQuiz(res.quiz);
      }
    } catch (err: any) {
      alert('Generation error: ' + (err?.message || 'Error'));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center space-x-2">
          <HelpCircle className="text-blue-600" />
          <span>AI Exam Question Generator</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Generate university-level examination questions, MCQs, and practice problems strictly from your uploaded Computer Science course materials.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Generator Form */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-100 pb-3 font-bold text-sm text-slate-800">
            <SlidersHorizontal size={16} className="text-blue-600" />
            <span>Generator Settings</span>
          </div>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs font-medium">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Course *</label>
              <select
                value={courseId}
                onChange={(e) => {
                  setCourseId(e.target.value);
                  setDocumentId('');
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Courses Notes</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.code} — {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Select Document (Optional)</label>
              <select
                value={documentId}
                onChange={(e) => setDocumentId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 truncate"
              >
                <option value="">Entire Selected Course Notes</option>
                {courseDocs.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.fileName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Specific Topic Focus</label>
              <input
                type="text"
                placeholder="e.g. CPU Architecture, Virtual Memory, AVL Trees..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Difficulty Level</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="Easy">Easy (Fundamental Definitions)</option>
                <option value="Medium">Medium (Application & Mechanics)</option>
                <option value="Hard">Hard (Analysis & Algorithms)</option>
                <option value="University Exam Level">University Exam Level (Strict Midterm/Final)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Question Type</label>
              <select
                value={questionType}
                onChange={(e) => setQuestionType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="mixed">Mixed Types (MCQs, Short-Answer, Essay)</option>
                <option value="mcq">Multiple Choice Questions (MCQ)</option>
                <option value="true_false">True / False Questions</option>
                <option value="short_answer">Short Answer Questions</option>
                <option value="essay">Essay & Algorithmic Problem Solving</option>
                <option value="coding">Programming & Code Questions</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">
                Number of Questions: <span className="font-bold text-blue-600">{numQuestions}</span>
              </label>
              <input
                type="range"
                min={3}
                max={20}
                value={numQuestions}
                onChange={(e) => setNumQuestions(parseInt(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-lg shadow-xs transition"
            >
              {isGenerating ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Generating Questions...</span>
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate AI Exam Questions</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Column: Preview Generated Questions */}
        <div className="lg:col-span-2 space-y-4">
          {!generatedQuiz ? (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-12 text-center text-slate-500 text-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                <HelpCircle size={24} />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Questions Generated Yet</h3>
              <p className="max-w-md mx-auto text-slate-500">
                Select a course module or document, set your desired difficulty, and click <strong className="text-slate-700">Generate AI Exam Questions</strong> to create custom practice tests.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-bold text-slate-900 text-base">{generatedQuiz.title}</h2>
                  <p className="text-xs text-slate-500">
                    {generatedQuiz.questions.length} Questions • {generatedQuiz.difficulty} • Est Duration: {generatedQuiz.durationMinutes} mins
                  </p>
                </div>

                <button
                  onClick={() => onStartExam(generatedQuiz)}
                  className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow-xs transition shrink-0"
                >
                  <Play size={16} />
                  <span>Start Interactive Exam Mode</span>
                </button>
              </div>

              {/* Questions List Preview */}
              <div className="space-y-3">
                {generatedQuiz.questions.map((q, idx) => {
                  const isExpanded = expandedQId === q.id;
                  return (
                    <div key={q.id} className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                      <div
                        onClick={() => setExpandedQId(isExpanded ? null : q.id)}
                        className="flex items-start justify-between cursor-pointer space-x-2"
                      >
                        <div className="flex items-start space-x-2">
                          <span className="font-sans font-bold text-blue-600 text-xs">Q{idx + 1}.</span>
                          <span className="font-semibold text-slate-900 text-sm">{q.question}</span>
                        </div>
                        <button className="text-slate-400 hover:text-slate-700 shrink-0">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 font-medium">
                        <span className="uppercase bg-white px-1.5 py-0.5 rounded border border-slate-200 font-bold">
                          Type: {q.type}
                        </span>
                        <span>•</span>
                        <span>Source: {q.sourceDocName || 'Course Notes'} (Page {q.sourcePage || 1})</span>
                      </div>

                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                          {q.options.map((opt, oIdx) => (
                            <div
                              key={oIdx}
                              className={`p-2 rounded border text-slate-700 text-xs ${
                                isExpanded && opt === q.correctAnswer
                                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-semibold'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}

                      {isExpanded && (
                        <div className="pt-2 border-t border-slate-200 space-y-1.5 text-slate-800 bg-white p-3 rounded-lg border border-slate-200">
                          <div className="flex items-center space-x-2 font-bold text-emerald-700">
                            <CheckCircle2 size={14} />
                            <span>Expected Answer: {q.correctAnswer}</span>
                          </div>
                          <p className="text-slate-600 text-[11px] leading-relaxed">
                            <strong className="text-slate-800">Explanation:</strong> {q.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
