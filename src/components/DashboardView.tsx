import React from 'react';
import {
  FileText,
  BookOpen,
  HelpCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Upload,
  Brain,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  GraduationCap
} from 'lucide-react';
import { AnalyticsData, Document, Course } from '../types.js';
import { NavTab } from './Navigation.js';

interface DashboardViewProps {
  analytics: AnalyticsData | null;
  documents: Document[];
  courses: Course[];
  setActiveTab: (tab: NavTab) => void;
  userName?: string;
}

export function DashboardView({
  analytics,
  documents,
  courses,
  setActiveTab,
  userName = 'John',
}: DashboardViewProps) {
  const readyDocs = documents.filter((d) => d.status === 'ready');

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-xl bg-blue-600 p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-white/15 border border-white/20 px-3 py-1 rounded-full text-white text-xs font-semibold backdrop-blur-xs">
            <Sparkles size={14} className="text-blue-100" />
            <span>AI Computer Science Academic Platform</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Welcome back, {userName} 👋
          </h1>
          <p className="text-sm text-blue-100 leading-relaxed">
            Turn lecture notes, slides, and textbooks into your personal AI Academic Tutor with instant RAG citations, practice exam generation, and progress tracking.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('notes')}
              className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-blue-700 font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-sm transition"
            >
              <Upload size={16} />
              <span>Upload Notes</span>
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className="inline-flex items-center space-x-2 bg-blue-700 hover:bg-blue-800 text-white border border-blue-500/50 text-xs sm:text-sm px-4 py-2 rounded-lg transition"
            >
              <Brain size={16} className="text-blue-200" />
              <span>Ask AI Tutor</span>
            </button>
          </div>
        </div>

        {/* Decorative graphic overlay */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* First-Time User Onboarding Guide if no docs uploaded */}
      {readyDocs.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-slate-800 space-y-3 shadow-sm">
          <div className="flex items-center space-x-2.5 text-amber-800 font-bold text-sm">
            <AlertTriangle size={18} className="text-amber-600" />
            <span>Get Started in 3 Quick Steps:</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 space-y-1">
              <span className="font-bold text-blue-600">1. Create a Course</span>
              <p className="text-slate-600">Create a course code (e.g. CSC 111, CSC 311) to organize your notes.</p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 space-y-1">
              <span className="font-bold text-blue-600">2. Upload Materials</span>
              <p className="text-slate-600">Upload PDF lecture slides, Word docs, or scanned images.</p>
            </div>
            <div className="bg-white p-3.5 rounded-lg border border-amber-200/80 space-y-1">
              <span className="font-bold text-blue-600">3. Ask & Practice</span>
              <p className="text-slate-600">Ask questions, generate exam quizzes, and practice flashcards!</p>
            </div>
          </div>
          <div className="pt-1">
            <button
              onClick={() => setActiveTab('courses')}
              className="bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded transition shadow-xs"
            >
              Set up First Course →
            </button>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Total Notes</span>
            <FileText size={16} className="text-blue-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{analytics?.totalNotes || documents.length}</span>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{readyDocs.length} Ready</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Courses</span>
            <BookOpen size={16} className="text-indigo-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{analytics?.totalCourses || courses.length}</span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Active</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Practiced</span>
            <HelpCircle size={16} className="text-cyan-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{analytics?.questionsPracticed || 18}</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Mastered</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Quizzes</span>
            <Clock size={16} className="text-amber-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{analytics?.quizzesCompleted || 3}</span>
            <span className="text-[10px] bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Completed</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Avg Accuracy</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-emerald-600">{analytics?.averageScore || 82}%</span>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Advanced</span>
          </div>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Study Hours</span>
            <Sparkles size={16} className="text-purple-600" />
          </div>
          <div className="flex items-end justify-between mt-1">
            <span className="text-2xl font-bold text-slate-900">{analytics?.studyTimeHours || 14.5}h</span>
            <span className="text-[10px] bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Log</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Quick Actions & Recent Documents */}
        <div className="lg:col-span-2 space-y-6">
          {/* Action Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div
              onClick={() => setActiveTab('generator')}
              className="group bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:border-blue-500/50 p-5 rounded-xl cursor-pointer transition space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <HelpCircle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition">
                  Generate Exam Questions
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Generate MCQs, True/False, Short-answer, and Essay questions directly from lecture notes.
                </p>
              </div>
              <div className="flex items-center text-xs text-blue-600 font-semibold space-x-1 pt-1">
                <span>Start Generator</span>
                <ArrowRight size={14} />
              </div>
            </div>

            <div
              onClick={() => setActiveTab('exam')}
              className="group bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:border-indigo-500/50 p-5 rounded-xl cursor-pointer transition space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <Clock size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-indigo-600 transition">
                  Interactive Exam Mode
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Take timed examination simulations with automatic objective and AI essay marking.
                </p>
              </div>
              <div className="flex items-center text-xs text-indigo-600 font-semibold space-x-1 pt-1">
                <span>Launch Exam</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>

          {/* Recent Uploaded Notes */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-slate-800 text-base flex items-center space-x-2">
                <FileText size={18} className="text-blue-600" />
                <span>Uploaded Academic Notes</span>
              </h2>
              <button
                onClick={() => setActiveTab('notes')}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold"
              >
                View All ({documents.length})
              </button>
            </div>

            {documents.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs space-y-2">
                <p>No documents uploaded yet.</p>
                <button
                  onClick={() => setActiveTab('notes')}
                  className="bg-blue-600 text-white px-3.5 py-1.5 rounded-md text-xs font-semibold shadow-xs"
                >
                  Upload Lecture Notes
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.slice(0, 4).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => setActiveTab('chat')}
                    className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 rounded-lg cursor-pointer transition"
                  >
                    <div className="flex items-center space-x-3 overflow-hidden">
                      <div className="w-8 h-8 rounded bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 font-sans text-xs font-bold uppercase">
                        {doc.fileType}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-semibold text-slate-900 truncate">{doc.fileName}</p>
                        <p className="text-[10px] text-slate-500">
                          {doc.courseCode} • {doc.pageCount} Pages • {doc.chunkCount} Chunks
                        </p>
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded capitalize shrink-0 ${
                        doc.status === 'ready'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {doc.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: AI Recommendations & Topic Mastery */}
        <div className="space-y-6">
          {/* Personalized Recommendations */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-4">
            <h2 className="font-bold text-slate-800 text-base flex items-center space-x-2">
              <Brain size={18} className="text-purple-600" />
              <span>AI Study Recommendations</span>
            </h2>

            <div className="space-y-3">
              {analytics?.recommendations.map((rec, i) => (
                <div key={i} className="bg-slate-50 border border-slate-200 rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-900">{rec.topic}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-mono font-bold">
                      {rec.accuracy}% Accuracy
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{rec.reason}</p>
                  <div className="pt-1 flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab('study_mode')}
                      className="text-[11px] bg-purple-600 hover:bg-purple-700 text-white font-medium px-2.5 py-1 rounded transition shadow-xs"
                    >
                      Revise Topic
                    </button>
                    <button
                      onClick={() => setActiveTab('generator')}
                      className="text-[11px] bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium px-2.5 py-1 rounded transition"
                    >
                      Practice Quiz
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Mastery Summary */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm">Weak & Strong Topics Analysis</h3>

            <div className="space-y-2">
              <span className="text-[11px] font-semibold text-rose-600 uppercase tracking-wider block">
                Needs Revision (Weak)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analytics?.weakTopics.map((wt, idx) => (
                  <span
                    key={idx}
                    className="bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium px-2 py-0.5 rounded"
                  >
                    {wt}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <span className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider block">
                Mastered Topics (Strong)
              </span>
              <div className="flex flex-wrap gap-1.5">
                {analytics?.strongTopics.map((st, idx) => (
                  <span
                    key={idx}
                    className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-medium px-2 py-0.5 rounded flex items-center space-x-1"
                  >
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    <span>{st}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
